<script>
    import { onMount } from "svelte";
    import ImageUploader from "../../components/admin/ImageUploader.svelte";
    import Pagination from "../../components/admin/Pagination.svelte";

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    let variantes = $state([]);
    let categorias = $state([]);
    let filtroCategoria = $state("");
    let busqueda = $state("");
    let modalAbierto = $state(false);
    let modoEdicion = $state(false);
    let varianteActual = $state(null);
    let notificacion = $state({ mostrar: false, mensaje: "", tipo: "" });
    let loading = $state(false);

    // Pagination State
    let page = $state(1);
    let limit = $state(3);
    let total = $state(0);
    let totalPages = $state(1);

    let formData = $state({
        nombre: "",
        categoria: "",
        descripcion: "",
        precio: "",
        color: "#3498db",
        imagen: "",
        vegano: false,
        sinGluten: false,
        sinLactosa: false,
        disponible: true,
    });

    const coloresDisponibles = [
        "#3498db",
        "#e74c3c",
        "#2ecc71",
        "#f39c12",
        "#9b59b6",
        "#1abc9c",
        "#34495e",
        "#e67e22",
        "#95a5a6",
        "#d35400",
    ];

    onMount(() => {
        cargarCategorias();
    });

    $effect(() => {
        cargarVariantes(page, limit, busqueda, filtroCategoria);
    });

    async function cargarCategorias() {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/categorias`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success !== false) {
                categorias = data.data || [];
            }
        } catch (error) {
            console.error("Error cargando categorías:", error);
        }
    }

    async function cargarVariantes(p, l, b, f) {
        try {
            loading = true;
            const token = localStorage.getItem("token");

            let url = `${API_URL}/api/variantes?page=${p}&limit=${l}`;
            if (b) url += `&search=${encodeURIComponent(b)}`;
            if (f) url += `&categoria=${f}`;

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success !== false) {
                variantes = data.data || [];
                total = data.total || 0;
                totalPages = data.pages || 1;
            }
        } catch (error) {
            console.error("Error cargando variantes:", error);
        } finally {
            loading = false;
        }
    }

    function abrirModal(variante = null) {
        if (variante) {
            modoEdicion = true;
            varianteActual = variante;
            formData = {
                nombre: variante.nombre,
                categoria: variante.categoria?._id || variante.categoria,
                descripcion: variante.descripcion || "",
                precio: variante.precio || "",
                color: variante.color || "#3498db",
                imagen: variante.imagen || "",
                vegano: variante.vegano || false,
                sinGluten: variante.sinGluten || false,
                sinLactosa: variante.sinLactosa || false,
                disponible: variante.disponible !== false,
            };
        } else {
            modoEdicion = false;
            varianteActual = null;
            formData = {
                nombre: "",
                categoria: "",
                descripcion: "",
                precio: "",
                color: "#3498db",
                imagen: "",
                vegano: false,
                sinGluten: false,
                sinLactosa: false,
                disponible: true,
            };
        }
        modalAbierto = true;
    }

    function cerrarModal() {
        modalAbierto = false;
        modoEdicion = false;
        varianteActual = null;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const url = modoEdicion
                ? `${API_URL}/api/variantes/${varianteActual._id}`
                : `${API_URL}/api/variantes`;

            const response = await fetch(url, {
                method: modoEdicion ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success !== false && response.ok) {
                mostrarNotificacion(
                    modoEdicion
                        ? "Sabor actualizado correctamente"
                        : "Sabor creado correctamente",
                    "success",
                );
                await cargarVariantes(page, limit, busqueda, filtroCategoria);
                cerrarModal();
            } else {
                mostrarNotificacion(
                    data.message || "Error al guardar",
                    "error",
                );
            }
        } catch (error) {
            console.error("Error:", error);
            mostrarNotificacion("Error al guardar el sabor", "error");
        }
    }

    async function eliminarVariante(id) {
        if (!confirm("¿Estás seguro de eliminar este sabor?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/variantes/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();

            if (data.success !== false && response.ok) {
                mostrarNotificacion("Sabor eliminado correctamente", "success");
                await cargarVariantes(page, limit, busqueda, filtroCategoria);
            } else {
                mostrarNotificacion(
                    data.message || "Error al eliminar",
                    "error",
                );
            }
        } catch (error) {
            console.error("Error:", error);
            mostrarNotificacion("Error al eliminar el sabor", "error");
        }
    }

    function mostrarNotificacion(mensaje, tipo) {
        notificacion = { mostrar: true, mensaje, tipo };
        setTimeout(() => {
            notificacion = { mostrar: false, mensaje: "", tipo: "" };
        }, 3000);
    }

    function setPage(p) {
        page = p;
    }
    function setLimit(l) {
        limit = l;
        page = 1;
    }
    function setBusquedaHandler(e) {
        busqueda = e.target.value;
        page = 1;
    }
    function setCatHandler(e) {
        filtroCategoria = e.target.value;
        page = 1;
    }
</script>

<div class="gestion-container">
    <div class="gestion-header">
        <div>
            <h2>Gestión de Sabores</h2>
            <span class="count-badge">{total} sabores</span>
        </div>
        <button class="btn-nuevo" onclick={() => abrirModal()}>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nuevo Sabor
        </button>
    </div>

    <div class="filtros-container">
        <input
            type="text"
            class="filtro-busqueda"
            placeholder="Buscar sabor..."
            value={busqueda}
            oninput={setBusquedaHandler}
        />
        <select
            class="filtro-select"
            value={filtroCategoria}
            onchange={setCatHandler}
        >
            <option value="">Todas las categorías</option>
            {#each categorias as cat}
                <option value={cat._id}>{cat.nombre}</option>
            {/each}
        </select>
    </div>

    {#if loading && !variantes.length}
        <div class="gestion-loading">
            <div class="spinner"></div>
            <p>Cargando sabores...</p>
        </div>
    {:else}
        <div class="variantes-grid">
            {#each variantes as variante (variante._id)}
                <div class="variante-card">
                    <div
                        class="variante-color-bar"
                        style="background-color: {variante.color}"
                    ></div>

                    {#if variante.imagen}
                        <div class="variante-imagen">
                            <img
                                src={`${API_URL}${variante.imagen}`}
                                alt={variante.nombre}
                            />
                        </div>
                    {/if}

                    <div class="variante-contenido">
                        <h3>{variante.nombre}</h3>
                        <span class="variante-categoria">
                            {variante.categoria?.nombre || "Sin categoría"}
                        </span>
                        {#if variante.descripcion}
                            <p class="variante-descripcion">
                                {variante.descripcion}
                            </p>
                        {/if}

                        <div class="variante-tags">
                            {#if variante.vegano}<span class="tag tag-vegano"
                                    >🌱 Vegano</span
                                >{/if}
                            {#if variante.sinGluten}<span
                                    class="tag tag-sin-gluten"
                                    >🌾 Sin Gluten</span
                                >{/if}
                            {#if variante.sinLactosa}<span
                                    class="tag tag-sin-lactosa"
                                    >🥛 Sin Lactosa</span
                                >{/if}
                        </div>

                        <div class="variante-footer">
                            <span class="variante-precio"
                                >{(variante?.precio || 0).toFixed(2)}€</span
                            >
                            <div class="variante-acciones">
                                <button
                                    class="btn-accion editar"
                                    onclick={() => abrirModal(variante)}
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
                                    class="btn-accion eliminar"
                                    onclick={() =>
                                        eliminarVariante(variante._id)}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <polyline points="3 6 5 6 21 6"
                                        ></polyline>
                                        <path
                                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <Pagination
            currentPage={page}
            {totalPages}
            onPageChange={setPage}
            totalItems={total}
            itemsPerPage={limit}
            onItemsPerPageChange={setLimit}
            {loading}
        />
    {/if}

    {#if modalAbierto}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="modal-overlay" onclick={cerrarModal}>
            <div class="modal-content" onclick={(e) => e.stopPropagation()}>
                <button class="btn-cerrar" onclick={cerrarModal}>×</button>
                <h2>{modoEdicion ? "Editar Sabor" : "Nuevo Sabor"}</h2>

                <form onsubmit={handleSubmit}>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nombre *</label>
                            <input
                                type="text"
                                bind:value={formData.nombre}
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label>Categoría *</label>
                            <select bind:value={formData.categoria} required>
                                <option value="">Seleccionar...</option>
                                {#each categorias as cat}
                                    <option value={cat._id}>{cat.nombre}</option
                                    >
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea bind:value={formData.descripcion} rows="3"
                        ></textarea>
                    </div>

                    <ImageUploader
                        tipo="variante"
                        imagenActual={formData.imagen
                            ? `${API_URL}${formData.imagen}`
                            : null}
                        onImagenCargada={(url) => (formData.imagen = url)}
                        nombre={formData.nombre}
                    />

                    <div class="form-row">
                        <div class="form-group">
                            <label>Precio (€) *</label>
                            <input
                                type="number"
                                step="0.01"
                                bind:value={formData.precio}
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label>Color</label>
                            <div class="colores-selector">
                                {#each coloresDisponibles as color}
                                    <button
                                        type="button"
                                        class={`color-opcion ${formData.color === color ? "selected" : ""}`}
                                        style="background-color: {color}"
                                        onclick={() => (formData.color = color)}
                                    ></button>
                                {/each}
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input
                                type="checkbox"
                                bind:checked={formData.vegano}
                            />
                            🌱 Vegano
                        </label>
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input
                                type="checkbox"
                                bind:checked={formData.sinGluten}
                            />
                            🌾 Sin Gluten
                        </label>
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input
                                type="checkbox"
                                bind:checked={formData.sinLactosa}
                            />
                            🥛 Sin Lactosa
                        </label>
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input
                                type="checkbox"
                                bind:checked={formData.disponible}
                            />
                            Disponible
                        </label>
                    </div>

                    <div class="modal-acciones">
                        <button
                            type="button"
                            class="btn-cancelar"
                            onclick={cerrarModal}
                        >
                            Cancelar
                        </button>
                        <button type="submit" class="btn-guardar">
                            {modoEdicion ? "Actualizar" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}

    {#if notificacion.mostrar}
        <div class={`notificacion ${notificacion.tipo}`}>
            {notificacion.mensaje}
        </div>
    {/if}
</div>

<style>
    @import "../../styles/admin/GestionComun.css";
    @import "../../styles/admin/gestion/GestionVariantes.css";
</style>
