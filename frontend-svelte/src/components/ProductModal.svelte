<script>
    let { producto, onclose } = $props();
</script>

<div class="modal-backdrop">
    <div class="modal-content card">
        <div class="modal-header">
            <h2>{producto?.nombre}</h2>
            <button class="btn-close" onclick={onclose}>&times;</button>
        </div>
        <div class="modal-body">
            <p><strong>Precio:</strong> {producto?.precio} €</p>
            <p>
                <strong>Estado:</strong>
                {producto?.activo ? "Activo" : "Inactivo"}
            </p>
            {#if producto?.descripcion}
                <p><strong>Descripción:</strong> {producto.descripcion}</p>
            {/if}
            {#if producto?.categoria}
                <p>
                    <strong>Categoría:</strong>
                    {producto.categoria?.nombre || producto.categoria}
                </p>
            {/if}
        </div>
        <div class="modal-footer">
            <button class="btn" onclick={onclose}>Cerrar</button>
        </div>
    </div>
</div>

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }
    .modal-content {
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
    }
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 0.5rem;
    }
    .btn-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        line-height: 1;
    }
    .modal-body p {
        margin-bottom: 0.5rem;
    }
    .modal-footer {
        margin-top: 1.5rem;
        text-align: right;
    }
</style>
