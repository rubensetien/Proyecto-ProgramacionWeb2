<script>
    import { productosService } from "../services/productos.js";
    import { authState } from "../stores/auth.svelte.js";
    import { routerState } from "../stores/router.svelte.js";
    import "../styles/cliente/ProductosListModern.css";

    // The backend URL is retrieved similarly to React's import.meta.env
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    let productos = $state([]);
    let loading = $state(true);
    let error = $state(null);
    let busqueda = $state("");
    let selectedCategoria = $state("Todas");
    let categorias = $state([]);
    let selectedVariations = $state({});

    let isAuthenticated = $derived(authState.isAuthenticated);

    // Filter & Group Logic via $derived.by
    let productosAgrupados = $derived.by(() => {
        if (!productos.length) return [];

        let resultado = productos;
        if (selectedCategoria !== "Todas") {
            resultado = resultado.filter((p) => {
                const catNombre = p.categoria?.nombre || p.categoria;
                return catNombre === selectedCategoria;
            });
        }
        if (busqueda) {
            resultado = resultado.filter((p) => {
                const nombreCompleto = p.nombre + (p.variante?.nombre || "");
                return (
                    nombreCompleto
                        .toLowerCase()
                        .includes(busqueda.toLowerCase()) ||
                    (p.descripcion &&
                        p.descripcion
                            .toLowerCase()
                            .includes(busqueda.toLowerCase()))
                );
            });
        }

        const grupos = {};
        resultado.forEach((prod) => {
            let groupKey;
            if (prod.variante) {
                groupKey = `${prod.categoria?._id || "cat"}_${prod.variante._id}`;
            } else {
                groupKey = prod.nombre;
            }

            if (!grupos[groupKey]) {
                grupos[groupKey] = {
                    id: groupKey,
                    nombrePrincipal: prod.variante
                        ? prod.variante.nombre
                        : prod.nombre,
                    descripcion: prod.descripcion,
                    imagen:
                        prod.imagenPrincipal ||
                        prod.imagen ||
                        prod.variante?.imagen,
                    categoria: prod.categoria,
                    variante: prod.variante,
                    productos: [],
                };
            }
            grupos[groupKey].productos.push(prod);
        });

        const lista = Object.values(grupos).map((grupo) => {
            // Compute a default format ID based on lowest price securely inside derived
            const sortedProds = [...grupo.productos].sort(
                (a, b) => (a.precioFinal || 0) - (b.precioFinal || 0),
            );
            grupo.defaultId = sortedProds[0]._id;
            return grupo;
        });

        return lista;
    });

    $effect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productosService.getAll();
                const activos = (response.data || []).filter((p) => p.activo);
                productos = activos;

                const catsData = activos
                    .map((p) => p.categoria?.nombre || p.categoria)
                    .filter(Boolean);
                categorias = Array.from(
                    new Set(["Todas", "Helados", "Dulces", ...catsData]),
                );
            } catch (err) {
                error = "No se pudieron cargar los productos: " + err.message;
            } finally {
                loading = false;
            }
        };
        fetchProducts();
    });

    function getImageUrl(path) {
        if (!path) return "https://placehold.co/300x300?text=Regma";
        if (path.startsWith("http")) return path;
        return `${API_URL}${path}`;
    }

    function handleFormatChange(groupId, productId) {
        selectedVariations[groupId] = productId;
    }

    function handleAddToCart() {
        if (!isAuthenticated) {
            alert("Debes estar registrado para comprar");
            routerState.navigate("/login");
            return;
        }
        alert("Añadido al pedido con éxito");
    }

    let mouseX = $state(0);
    let mouseY = $state(0);

    function handleMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
</script>

<svelte:window onmousemove={handleMouseMove} />

<div
    class="interactive-bg-wrapper"
    style="--mouse-x: {mouseX}px; --mouse-y: {mouseY}px;"
>
    <!-- Glowing orb following the cursor -->
    <div class="glow-orb"></div>

    <div
        class="catalogo-modern-container"
        style="position: relative; z-index: 1;"
    >
        <!-- HERO VIDEO -->
        <header class="catalog-hero">
            <video
                class="hero-video-bg"
                autoplay
                muted
                loop
                playsinline
                poster="{API_URL}/uploads/landing/hero-principal.jpg"
            >
                <source
                    src="{API_URL}/uploads/videoBola.mp4"
                    type="video/mp4"
                />
            </video>
            <div class="hero-overlay-content">
                <h1 class="hero-title-cat">CATÁLOGO 2026</h1>
                <p class="hero-subtitle-cat">
                    Colección de Sabores & Tradición
                </p>
            </div>
        </header>

        <!-- FLOATING FILTER BAR -->
        <div class="filter-sticky-bar">
            <div class="categories-pills">
                {#each categorias as cat}
                    <button
                        class="cat-btn {selectedCategoria === cat
                            ? 'active'
                            : ''}"
                        onclick={() => (selectedCategoria = cat)}
                    >
                        {cat}
                    </button>
                {/each}
            </div>
            <div class="search-mini">
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#999"
                    stroke-width="2"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    placeholder="Buscar..."
                    bind:value={busqueda}
                />
            </div>
        </div>

        <main class="grid-layout-modern">
            {#if loading}
                <div
                    style="grid-column: 1 / -1; text-align: center; padding: 50px;"
                >
                    Cargando catálogo...
                </div>
            {:else if error}
                <div
                    style="grid-column: 1 / -1; text-align: center; padding: 50px; color: red;"
                >
                    {error}
                </div>
            {:else if productosAgrupados.length === 0}
                <div
                    style="grid-column: 1 / -1; text-align: center; padding: 50px;"
                >
                    No se encontraron productos.
                </div>
            {:else}
                {#each productosAgrupados as grupo (grupo.id)}
                    {@const activeId =
                        selectedVariations[grupo.id] || grupo.defaultId}
                    {@const activeProd =
                        grupo.productos.find((p) => p._id === activeId) ||
                        grupo.productos[0]}
                    <div class="prod-card-modern">
                        <div class="card-img-wrapper">
                            <img
                                src={getImageUrl(
                                    activeProd.variante?.imagen ||
                                        activeProd.imagenPrincipal ||
                                        activeProd.imagen,
                                )}
                                alt={activeProd.nombre}
                                class="prod-img-main"
                            />
                        </div>
                        <div class="card-info">
                            <span class="prod-cat-tag"
                                >{activeProd.categoria?.nombre ||
                                    activeProd.categoria}</span
                            >
                            <h3 class="prod-name">{grupo.nombrePrincipal}</h3>
                            <p class="prod-desc">
                                {activeProd.descripcion
                                    ? activeProd.descripcion.substring(0, 60) +
                                      "..."
                                    : "Delicioso producto Regma"}
                            </p>

                            {#if grupo.productos.length > 1}
                                <div class="format-chips">
                                    {#each grupo.productos as p}
                                        <button
                                            class="chip {p._id ===
                                            activeProd._id
                                                ? 'active'
                                                : ''}"
                                            onclick={() =>
                                                handleFormatChange(
                                                    grupo.id,
                                                    p._id,
                                                )}
                                        >
                                            {p.formato?.capacidad
                                                ? [
                                                      "unidades",
                                                      "unidad",
                                                  ].includes(
                                                      p.formato.unidad?.toLowerCase(),
                                                  )
                                                    ? p.formato.nombre
                                                    : `${p.formato.capacidad} ${p.formato.unidad}`
                                                : p.nombre
                                                      .replace(
                                                          grupo.nombrePrincipal,
                                                          "",
                                                      )
                                                      .trim() || "Estándar"}
                                        </button>
                                    {/each}
                                </div>
                            {/if}

                            <div class="prod-controls">
                                <span class="price-modern"
                                    >{Number(
                                        activeProd.precioFinal || 0,
                                    ).toFixed(2)}€</span
                                >
                                <button
                                    class="btn-add-modern"
                                    onclick={() => handleAddToCart()}
                                >
                                    <span>Añadir</span>
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="3"
                                        ><path d="M12 5v14M5 12h14" /></svg
                                    >
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
        </main>
    </div>
</div>

<style>
    .interactive-bg-wrapper {
        position: relative;
        width: 100%;
        min-height: 100vh;
        background-color: var(--color-background, #fafafa);
        overflow-x: hidden;
    }

    .glow-orb {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 0;
        background: radial-gradient(
            circle 600px at var(--mouse-x, 50vw) var(--mouse-y, 50vh),
            rgba(255, 102, 0, 0.06),
            transparent 70%
        );
        transition: background 0.15s ease-out;
        will-change: background;
    }
</style>
