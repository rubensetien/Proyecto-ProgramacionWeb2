<script>
    let { producto, onclick } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="card product-card" {onclick}>
    <div class="product-info">
        <h3>{producto?.nombre}</h3>
        <p class="price">{producto?.precio} €</p>
        <span
            class="badge {producto?.activo ? 'badge-active' : 'badge-inactive'}"
        >
            {producto?.activo ? "Activo" : "Inactivo"}
        </span>
    </div>
</div>

<style>
    .product-card {
        cursor: pointer;
        transition:
            transform 0.2s,
            box-shadow 0.2s;
    }
    .product-card:hover {
        transform: translateY(-2px);
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .product-info h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.125rem;
    }
    .price {
        font-weight: 600;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
    }
    .badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 500;
    }
    .badge-active {
        background-color: #dcfce7;
        color: #166534;
    }
    .badge-inactive {
        background-color: #fee2e2;
        color: #991b1b;
    }
</style>
