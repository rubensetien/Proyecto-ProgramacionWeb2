<script>
    import { onMount, tick } from "svelte";
    import GestionFormatos from "./GestionFormatos.svelte";
    import GestionVariantes from "./GestionVariantes.svelte";
    import Pagination from "../../components/admin/Pagination.svelte";

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    let productos = $state([]);
    let categorias = $state([]);
    let variantes = $state([]);
    let formatos = $state([]);
    let cargando = $state(true);
    let error = $state(null);
    let mostrarModal = $state(false);
    let modoEdicion = $state(false);
    let productoEditando = $state(null);
    let busqueda = $state("");
    let categoriaFiltro = $state("todas");
    let seccionActiva = $state("productos"); // 'productos', 'formatos', 'sabores'

    // Pagination State
    let page = $state(1);
    let limit = $state(5);
    let publicTotal = $state(0);
    let totalPages = $state(1);

    let formulario = $state({
        nombre: "",
        descripcion: "",
        categoria: "",
        variante: "",
        formato: "",
        precioBase: "",
        precioFinal: "",
        imagen: null,
        activo: true,
    });

    let categoriaRequiereSabor = $state(false);

    $effect(() => {
        if (seccionActiva === "productos") {
            cargarDatosAuxiliares();
        }
    });

    $effect(() => {
        if (seccionActiva === "productos") {
            cargarProductos(page, limit, busqueda, categoriaFiltro);
        }
    });

    $effect(() => {
        if (formulario.categoria) {
            const cat = categorias.find((c) => c._id === formulario.categoria);
            if (cat) {
                categoriaRequiereSabor = cat.requiereSabor || false;
                if (!cat.requiereSabor) {
                    formulario.variante = "";
                }
            }
        } else {
            categoriaRequiereSabor = false;
        }
    });

    // Auto-generar nombre
    $effect(() => {
        if (modoEdicion) return;

        let nuevoNombre = "";
        const cat = categorias.find((c) => c._id === formulario.categoria);

        if (formulario.variante) {
            const v = variantes.find((va) => va._id === formulario.variante);
            if (v) nuevoNombre += v.nombre;
        }

        if (formulario.formato) {
            const f = formatos.find((fa) => fa._id === formulario.formato);
            if (f) {
                nuevoNombre = nuevoNombre
                    ? `${nuevoNombre} - ${f.nombre}`
                    : f.nombre;
            }
        }

        if (nuevoNombre) {
            formulario.nombre = nuevoNombre;
        }
    });

    async function cargarDatosAuxiliares() {
        try {
            const token = localStorage.getItem("token");
            const [categoriasRes, variantesRes, formatosRes] =
                await Promise.all([
                    fetch(`${API_URL}/api/categorias`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_URL}/api/variantes?limit=1000`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_URL}/api/formatos?limit=1000`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

            const categoriasData = await categoriasRes.json();
            const variantesData = await variantesRes.json();
            const formatosData = await formatosRes.json();

            if (categoriasData.success !== false)
                categorias = categoriasData.data || [];
            if (variantesData.success !== false)
                variantes = variantesData.data || [];
            if (formatosData.success !== false)
                formatos = formatosData.data || [];
        } catch (err) {
            console.error("Error cargando datos auxiliares:", err);
        }
    }

    async function cargarProductos(p, l, b, c) {
        try {
            cargando = true;
            const token = localStorage.getItem("token");

            let url = `${API_URL}/api/productos?page=${p}&limit=${l}`;
            if (b) url += `&buscar=${encodeURIComponent(b)}`;
            if (c && c !== "todas") url += `&categoria=${c}`;

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success !== false) {
                productos = data.data || [];
                publicTotal = data.total || 0;
                totalPages = data.pages || 1;
                error = null;
            } else {
                error = data.message;
            }
        } catch (err) {
            error = "Error al cargar productos: " + err.message;
        } finally {
            cargando = false;
        }
    }

    function abrirModalNuevo() {
        modoEdicion = false;
        productoEditando = null;
        formulario = {
            nombre: "",
            descripcion: "",
            categoria: "",
            variante: "",
            formato: "",
            precioBase: "",
            precioFinal: "",
            imagen: null,
            activo: true,
        };
        categoriaRequiereSabor = false;
        mostrarModal = true;
    }

    function abrirModalEditar(producto) {
        modoEdicion = true;
        productoEditando = producto;
        formulario = {
            nombre: producto.nombre,
            descripcion: producto.descripcion || "",
            categoria: producto.categoria?._id || "",
            variante: producto.variante?._id || "",
            formato: producto.formato?._id || "",
            precioBase: producto.precioBase || "",
            precioFinal: producto.precioFinal || "",
            imagen: null,
            activo: producto.activo,
        };

        if (producto.categoria) {
            const cat = categorias.find(
                (c) => c._id === producto.categoria?._id,
            );
            categoriaRequiereSabor = cat?.requiereSabor || false;
        }
        mostrarModal = true;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (categoriaRequiereSabor && !formulario.variante) {
            error = "Esta categoría requiere seleccionar un sabor o variante";
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const formDataData = new FormData();

            formDataData.append("nombre", formulario.nombre);
            formDataData.append("descripcion", formulario.descripcion);
            formDataData.append("categoria", formulario.categoria);

            if (formulario.variante)
                formDataData.append("variante", formulario.variante);
            if (formulario.formato)
                formDataData.append("formato", formulario.formato);
            formDataData.append("precioBase", formulario.precioBase);
            formDataData.append("precioFinal", formulario.precioFinal);
            formDataData.append("activo", formulario.activo);

            if (formulario.imagen) {
                formDataData.append("imagen", formulario.imagen);
            }

            const url = modoEdicion
                ? `${API_URL}/api/productos/${productoEditando._id}`
                : `${API_URL}/api/productos`;

            const res = await fetch(url, {
                method: modoEdicion ? "PUT" : "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formDataData,
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                throw new Error(data.message || "Error al guardar producto");
            }

            mostrarModal = false;
            await cargarProductos(page, limit, busqueda, categoriaFiltro);
            error = null;
        } catch (err) {
            error = err.message;
        }
    }

    async function handleEliminar(id) {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/productos/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                throw new Error(data.message || "Error al eliminar");
            }

            await cargarProductos(page, limit, busqueda, categoriaFiltro);
            error = null;
        } catch (err) {
            error = err.message;
        }
    }

    function setPage(p) {
        page = p;
    }
    function setLimit(l) {
        limit = l;
        page = 1;
    }
    function handleFile(e) {
        formulario.imagen = e.target.files[0];
    }
</script>

<div class="gestion-productos">
    <div class="gestion-header">
        <div class="header-content">
            <h2>Gestión de Catálogo</h2>
            <p class="header-description">
                Administración completa del catálogo de productos y atributos
            </p>
        </div>

        {#if seccionActiva === "productos"}
            <button class="btn-nuevo" onclick={abrirModalNuevo}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Nuevo Producto
            </button>
        {/if}
    </div>

    <!-- SUBMENU DE NAVEGACIÓN -->
    <div class="gestion-submenu">
        <button
            class={`submenu-tab ${seccionActiva === "productos" ? "active" : ""}`}
            onclick={() => (seccionActiva = "productos")}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                ><path
                    d="M20 7h-9L9 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
                /></svg
            >
            Productos
        </button>
        <button
            class={`submenu-tab ${seccionActiva === "sabores" ? "active" : ""}`}
            onclick={() => (seccionActiva = "sabores")}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                ><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg
            >
            Sabores
        </button>
        <button
            class={`submenu-tab ${seccionActiva === "formatos" ? "active" : ""}`}
            onclick={() => (seccionActiva = "formatos")}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                ><path
                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line
                    x1="12"
                    y1="22.08"
                    x2="12"
                    y2="12"
                /></svg
            >
            Formatos
        </button>
    </div>

    {#if seccionActiva === "productos"}
        {#if error}
            <div class="alert alert-error">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                {error}
            </div>
        {/if}

        <div class="stats-bar">
            <div class="stat-card">
                <div class="stat-value">{publicTotal}</div>
                <div class="stat-label">productos en lista</div>
            </div>
        </div>

        <div class="filtros-bar">
            <div class="search-box">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                    type="text"
                    placeholder="Buscar por nombre o SKU..."
                    bind:value={busqueda}
                    oninput={() => (page = 1)}
                />
            </div>

            <select
                bind:value={categoriaFiltro}
                onchange={() => (page = 1)}
                class="select-filter"
            >
                <option value="todas">Todas las categorías</option>
                {#each categorias as cat}
                    <option value={cat._id}>{cat.nombre}</option>
                {/each}
            </select>
        </div>

        {#if cargando}
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Cargando datos...</p>
            </div>
        {:else}
            <div class="tabla-container">
                <table class="tabla-productos">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>PRODUCTO</th>
                            <th>CATEGORÍA</th>
                            <th>SABOR/VARIANTE</th>
                            <th>FORMATO</th>
                            <th>PRECIO FINAL</th>
                            <th>ESTADO</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#if productos.length === 0}
                            <tr>
                                <td colspan="8" class="empty-state">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M16 16s-1.5-2-4-2-4 2-4 2"
                                        ></path>
                                        <line x1="9" y1="9" x2="9.01" y2="9"
                                        ></line>
                                        <line x1="15" y1="9" x2="15.01" y2="9"
                                        ></line>
                                    </svg>
                                    <p>No se encontraron productos</p>
                                </td>
                            </tr>
                        {:else}
                            {#each productos as producto}
                                <tr>
                                    <td class="td-sku">{producto.sku || "-"}</td
                                    >
                                    <td class="td-producto">
                                        <div class="producto-info">
                                            {#if producto.imagenPrincipal || producto.imagen}
                                                <img
                                                    src={`${API_URL}${producto.imagenPrincipal || producto.imagen}`}
                                                    alt={producto.nombre}
                                                    class="producto-thumbnail"
                                                />
                                            {/if}
                                            <span>{producto.nombre}</span>
                                        </div>
                                    </td>
                                    <td>{producto.categoria?.nombre || "-"}</td>
                                    <td>{producto.variante?.nombre || "-"}</td>
                                    <td>{producto.formato?.nombre || "-"}</td>
                                    <td class="td-precio"
                                        >€{producto.precioFinal?.toFixed(2)}</td
                                    >
                                    <td>
                                        <span
                                            class={`badge ${producto.activo ? "badge-success" : "badge-inactive"}`}
                                        >
                                            {producto.activo
                                                ? "Activo"
                                                : "Inactivo"}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="acciones">
                                            <button
                                                class="btn-icono btn-editar"
                                                onclick={() =>
                                                    abrirModalEditar(producto)}
                                                title="Editar"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-width="2"
                                                >
                                                    <path
                                                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                                    ></path>
                                                    <path
                                                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                                    ></path>
                                                </svg>
                                            </button>
                                            <button
                                                class="btn-icono btn-eliminar"
                                                onclick={() =>
                                                    handleEliminar(
                                                        producto._id,
                                                    )}
                                                title="Eliminar"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-width="2"
                                                >
                                                    <polyline
                                                        points="3 6 5 6 21 6"
                                                    ></polyline>
                                                    <path
                                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                                    ></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={page}
                {totalPages}
                onPageChange={setPage}
                totalItems={publicTotal}
                itemsPerPage={limit}
                onItemsPerPageChange={setLimit}
                loading={cargando}
            />
        {/if}
    {/if}

    {#if seccionActiva === "sabores"}
        <GestionVariantes />
    {/if}

    {#if seccionActiva === "formatos"}
        <GestionFormatos />
    {/if}

    <!-- Modal solo si estamos en productos -->
    {#if mostrarModal && seccionActiva === "productos"}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="modal-overlay" onclick={() => (mostrarModal = false)}>
            <div class="modal-content" onclick={(e) => e.stopPropagation()}>
                <div class="modal-header">
                    <h3>
                        {modoEdicion ? "Editar Producto" : "Nuevo Producto"}
                    </h3>
                    <button
                        class="btn-close"
                        onclick={() => (mostrarModal = false)}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form onsubmit={handleSubmit} class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nombre del Producto *</label>
                            <input
                                type="text"
                                bind:value={formulario.nombre}
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label>Categoría *</label>
                            <select bind:value={formulario.categoria} required>
                                <option value="">Seleccionar categoría</option>
                                {#each categorias as cat}
                                    <option value={cat._id}>
                                        {cat.nombre}
                                        {cat.requiereSabor
                                            ? " (Requiere sabor)"
                                            : ""}
                                    </option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    {#if categoriaRequiereSabor}
                        <div class="form-group">
                            <label
                                >Sabor / Variante * (Requerido para esta
                                categoría)</label
                            >
                            <select
                                bind:value={formulario.variante}
                                required={categoriaRequiereSabor}
                            >
                                <option value="">Seleccionar sabor</option>
                                {#each variantes as v}
                                    <option value={v._id}>{v.nombre}</option>
                                {/each}
                            </select>
                        </div>
                    {/if}

                    <div class="form-row">
                        <div class="form-group">
                            <label>Formato/Tamaño *</label>
                            <select bind:value={formulario.formato} required>
                                <option value="">Seleccionar formato</option>
                                {#each formatos as f}
                                    <option value={f._id}>
                                        {f.nombre} ({f.capacidad}{f.unidad})
                                    </option>
                                {/each}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Imagen</label>
                            <input
                                type="file"
                                accept="image/*"
                                onchange={handleFile}
                            />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Precio Base *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                bind:value={formulario.precioBase}
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label>Precio Final *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                bind:value={formulario.precioFinal}
                                required
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea bind:value={formulario.descripcion} rows="3"
                        ></textarea>
                    </div>

                    <div class="checkbox-label">
                        <input
                            type="checkbox"
                            bind:checked={formulario.activo}
                        />
                        Producto Activo y Visible
                    </div>

                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn-cancelar"
                            onclick={() => (mostrarModal = false)}
                        >
                            Cancelar
                        </button>
                        <button type="submit" class="btn-guardar">
                            {modoEdicion
                                ? "Actualizar Producto"
                                : "Crear Producto"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>

<style>
    @import "../../styles/admin/gestion/GestionProductos.css";
</style>
