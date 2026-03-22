<script>
    import Pagination from "../../components/admin/Pagination.svelte";

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    let formatos = $state([]);
    let loading = $state(true);
    let mostrarModal = $state(false);
    let modoEdicion = $state(false);
    let formatoEditando = $state(null);
    let notificacion = $state({ mostrar: false, tipo: "", mensaje: "" });

    // Pagination State
    let page = $state(1);
    let limit = $state(3);
    let total = $state(0);
    let totalPages = $state(1);

    let formulario = $state({
        nombre: "",
        tipo: "volumen",
        capacidad: "",
        unidad: "L",
        precioBase: "",
        tipoEnvase: "tarrina-plastico",
        reciclable: true,
        tipoVenta: "envasado",
        seVendeOnline: true,
        seVendeEnPuntoVenta: true,
        descripcion: "",
        activo: true,
        orden: 1,
    });

    const tiposFormato = [
        { value: "volumen", label: "Volumen", icon: "📦" },
        { value: "peso", label: "Peso", icon: "⚖️" },
        { value: "unidad", label: "Unidad", icon: "🔢" },
        { value: "porcion", label: "Porción", icon: "🍽️" },
    ];

    const unidades = {
        volumen: ["L", "ml"],
        peso: ["kg", "g"],
        unidad: ["unidades"],
        porcion: ["porciones"],
    };

    const tiposEnvase = [
        "tarrina-plastico",
        "garrafa",
        "carton",
        "vidrio",
        "comestible",
        "papel",
        "otro",
    ];

    $effect(() => {
        cargarFormatos(page, limit);
    });

    async function cargarFormatos(currentPage, currentLimit) {
        try {
            loading = true;
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/formatos?page=${currentPage}&limit=${currentLimit}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const dataResponse = await response.json();

            if (dataResponse.success !== false) {
                formatos = dataResponse.data || [];
                total = dataResponse.total || 0;
                totalPages = dataResponse.pages || 1;
            }
        } catch (error) {
            console.error("Error cargando formatos:", error);
            mostrarNotificacion("error", "Error al cargar formatos");
        } finally {
            loading = false;
        }
    }

    function mostrarNotificacion(tipo, mensaje) {
        notificacion = { mostrar: true, tipo, mensaje };
        setTimeout(
            () => (notificacion = { mostrar: false, tipo: "", mensaje: "" }),
            3000,
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            const datos = {
                ...formulario,
                capacidad: parseFloat(formulario.capacidad),
                precioBase: parseFloat(formulario.precioBase),
                orden: parseInt(formulario.orden),
            };

            if (!formulario.nombre.trim()) {
                mostrarNotificacion("error", "❌ El nombre es obligatorio");
                return;
            }

            const url = modoEdicion
                ? `${API_URL}/api/formatos/${formatoEditando._id}`
                : `${API_URL}/api/formatos`;

            const method = modoEdicion ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(datos),
            });

            const data = await response.json();

            if (response.ok && data.success !== false) {
                mostrarNotificacion(
                    "success",
                    modoEdicion
                        ? "✅ Formato actualizado"
                        : "✅ Formato creado",
                );
            } else {
                throw new Error(data.message || "Error al guardar");
            }

            await cargarFormatos(page, limit);
            cerrarModal();
        } catch (error) {
            console.error("Error guardando formato:", error);
            mostrarNotificacion(
                "error",
                error.message || "❌ Error al guardar",
            );
        }
    }

    function handleEditar(formato) {
        modoEdicion = true;
        formatoEditando = formato;
        formulario = {
            nombre: formato.nombre,
            tipo: formato.tipo,
            capacidad: formato.capacidad,
            unidad: formato.unidad,
            precioBase: formato.precioBase,
            tipoEnvase: formato.tipoEnvase || "tarrina-plastico",
            reciclable: formato.reciclable ?? true,
            tipoVenta: formato.tipoVenta || "envasado",
            seVendeOnline: formato.seVendeOnline ?? true,
            seVendeEnPuntoVenta: formato.seVendeEnPuntoVenta ?? true,
            descripcion: formato.descripcion || "",
            activo: formato.activo,
            orden: formato.orden || 1,
        };
        mostrarModal = true;
    }

    async function handleEliminar(id) {
        if (!window.confirm("¿Eliminar este formato?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/formatos/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                mostrarNotificacion("success", "✅ Formato eliminado");
                await cargarFormatos(page, limit);
            } else {
                mostrarNotificacion("error", "❌ Error al eliminar");
            }
        } catch (error) {
            console.error("Error eliminando formato:", error);
            mostrarNotificacion("error", "❌ Error al eliminar");
        }
    }

    function abrirModalNuevo() {
        modoEdicion = false;
        formatoEditando = null;
        formulario = {
            nombre: "",
            tipo: "volumen",
            capacidad: "",
            unidad: "L",
            precioBase: "",
            tipoEnvase: "tarrina-plastico",
            reciclable: true,
            tipoVenta: "envasado",
            seVendeOnline: true,
            seVendeEnPuntoVenta: true,
            descripcion: "",
            activo: true,
            orden: total + 1,
        };
        mostrarModal = true;
    }

    function cerrarModal() {
        mostrarModal = false;
        modoEdicion = false;
        formatoEditando = null;
    }

    function setPage(p) {
        page = p;
    }
    function setLimit(l) {
        limit = l;
        page = 1;
    }
</script>

<div class="gestion-container">
    <!-- Header -->
    <div class="gestion-header">
        <div class="header-info">
            <span class="count-badge">{total}</span>
            <span class="count-text">formatos totales</span>
        </div>
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
            Nuevo Formato
        </button>
    </div>

    {#if loading && !formatos.length}
        <div class="gestion-loading">
            <div class="spinner"></div>
            <p>Cargando formatos...</p>
        </div>
    {:else}
        <!-- Grid de Formatos -->
        <div class="formatos-grid">
            {#each formatos as formato (formato._id)}
                <div class="formato-card">
                    <div class="formato-icon">
                        {tiposFormato.find((t) => t.value === formato.tipo)
                            ?.icon || "📦"}
                    </div>
                    <div class="formato-content">
                        <h3>{formato.nombre}</h3>
                        <div class="formato-detalles">
                            <div class="detalle-item">
                                <span class="detalle-label">Capacidad:</span>
                                <span class="detalle-valor"
                                    >{formato.capacidad} {formato.unidad}</span
                                >
                            </div>
                            <div class="detalle-item">
                                <span class="detalle-label">Tipo:</span>
                                <span class="detalle-valor">{formato.tipo}</span
                                >
                            </div>
                            <div class="detalle-item">
                                <span class="detalle-label">Envase:</span>
                                <span class="detalle-valor"
                                    >{formato.tipoEnvase}</span
                                >
                            </div>
                            <div class="detalle-item">
                                <span class="detalle-label">Precio Base:</span>
                                <span class="detalle-valor precio"
                                    >€{formato.precioBase?.toFixed(2)}</span
                                >
                            </div>
                        </div>
                        <div class="formato-tags">
                            {#if formato.reciclable}<span class="tag reciclable"
                                    >♻️ Reciclable</span
                                >{/if}
                            {#if formato.seVendeOnline}<span class="tag online"
                                    >🌐 Online</span
                                >{/if}
                            {#if formato.seVendeEnPuntoVenta}<span
                                    class="tag tienda">🏪 Tienda</span
                                >{/if}
                        </div>
                        <div class="formato-estado">
                            <span
                                class={`estado-badge ${formato.activo ? "activo" : "inactivo"}`}
                            >
                                {formato.activo ? "Activo" : "Inactivo"}
                            </span>
                        </div>
                    </div>
                    <div class="formato-acciones">
                        <button
                            class="btn-accion editar"
                            onclick={() => handleEditar(formato)}
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
                            onclick={() => handleEliminar(formato._id)}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path
                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                ></path>
                            </svg>
                        </button>
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

    <!-- Modal -->
    {#if mostrarModal}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="modal-overlay" onclick={cerrarModal}>
            <div class="modal-content" onclick={(e) => e.stopPropagation()}>
                <div class="modal-header">
                    <h2>{modoEdicion ? "Editar Formato" : "Nuevo Formato"}</h2>
                    <button class="btn-cerrar" onclick={cerrarModal}>×</button>
                </div>

                <form class="modal-body" onsubmit={handleSubmit}>
                    <div class="form-group">
                        <label>Nombre *</label>
                        <input
                            type="text"
                            bind:value={formulario.nombre}
                            placeholder="Ej: Tarrina 0.5L"
                            required
                        />
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Tipo *</label>
                            <select
                                bind:value={formulario.tipo}
                                onchange={(e) => {
                                    formulario.tipo = e.target.value;
                                    formulario.unidad =
                                        unidades[formulario.tipo][0];
                                }}
                                required
                            >
                                {#each tiposFormato as tipo}
                                    <option value={tipo.value}>
                                        {tipo.icon}
                                        {tipo.label}
                                    </option>
                                {/each}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Capacidad *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                bind:value={formulario.capacidad}
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label>Unidad *</label>
                            <select bind:value={formulario.unidad} required>
                                {#each unidades[formulario.tipo] || [] as unidad}
                                    <option value={unidad}>{unidad}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Precio Base (€) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                bind:value={formulario.precioBase}
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label>Tipo de Envase</label>
                            <select bind:value={formulario.tipoEnvase}>
                                {#each tiposEnvase as envase}
                                    <option value={envase}>
                                        {envase.replace("-", " ")}
                                    </option>
                                {/each}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Orden</label>
                            <input
                                type="number"
                                min="1"
                                bind:value={formulario.orden}
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea
                            bind:value={formulario.descripcion}
                            placeholder="Descripción del formato..."
                            rows="2"
                        ></textarea>
                    </div>

                    <div class="form-group-checks">
                        <label class="checkbox-label">
                            <input
                                type="checkbox"
                                bind:checked={formulario.reciclable}
                            />
                            <span>♻️ Reciclable</span>
                        </label>

                        <label class="checkbox-label">
                            <input
                                type="checkbox"
                                bind:checked={formulario.seVendeOnline}
                            />
                            <span>🌐 Venta Online</span>
                        </label>

                        <label class="checkbox-label">
                            <input
                                type="checkbox"
                                bind:checked={formulario.seVendeEnPuntoVenta}
                            />
                            <span>🏪 Venta en Tienda</span>
                        </label>

                        <label class="checkbox-label">
                            <input
                                type="checkbox"
                                bind:checked={formulario.activo}
                            />
                            <span>Formato Activo</span>
                        </label>
                    </div>

                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn-cancelar"
                            onclick={cerrarModal}
                        >
                            Cancelar
                        </button>
                        <button type="submit" class="btn-guardar">
                            {modoEdicion ? "Actualizar" : "Crear"} Formato
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <!-- Notificación -->
    {#if notificacion.mostrar}
        <div class={`notificacion ${notificacion.tipo}`}>
            {notificacion.mensaje}
        </div>
    {/if}
</div>

<style>
    @import "../../styles/admin/GestionComun.css";
</style>
