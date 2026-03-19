<script>
    import { productosService } from "../services/productos.js";
    import ProductCard from "../components/ProductCard.svelte";
    import ProductModal from "../components/ProductModal.svelte";

    let productos = $state([]);
    let loading = $state(true);
    let error = $state(null);
    let searchTerm = $state("");
    let selectedProduct = $state(null);

    // Derived state for filtered products using runes
    let filteredProductos = $derived(
        productos.filter((p) =>
            p.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );

    // Effect to fetch products
    $effect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productosService.getAll();
                productos = response.data || [];
            } catch (err) {
                error = "No se pudieron cargar los productos: " + err.message;
            } finally {
                loading = false;
            }
        };
        fetchProducts();
    });

    function openModal(producto) {
        selectedProduct = producto;
    }

    function closeModal() {
        selectedProduct = null;
    }
</script>

<div class="container section">
    <div class="header-actions">
        <h1>Catálogo de Productos</h1>
        <div class="search-box">
            <input
                type="text"
                class="form-input"
                placeholder="Buscar productos..."
                bind:value={searchTerm}
            />
        </div>
    </div>

    {#if error}
        <div class="alert alert-error">{error}</div>
    {/if}

    {#if loading}
        <div class="loading">Cargando productos...</div>
    {:else if filteredProductos.length === 0}
        <div class="empty-state">No se encontraron productos.</div>
    {:else}
        <div class="products-grid">
            {#each filteredProductos as producto (producto._id)}
                <ProductCard {producto} onclick={() => openModal(producto)} />
            {/each}
        </div>
    {/if}

    {#if selectedProduct}
        <ProductModal producto={selectedProduct} onclose={closeModal} />
    {/if}
</div>

<style>
    .section {
        margin-top: 2rem;
        margin-bottom: 4rem;
    }
    .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
    }
    .search-box {
        min-width: 250px;
    }
    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
    }
    .loading,
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--text-muted);
        font-size: 1.125rem;
    }
    .alert {
        padding: 1rem;
        border-radius: 0.375rem;
        margin-bottom: 2rem;
    }
    .alert-error {
        background-color: var(--danger-color);
        color: white;
    }
</style>
