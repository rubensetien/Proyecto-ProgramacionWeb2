<script>
    let {
        currentPage = 1,
        totalPages = 1,
        onPageChange,
        totalItems = 0,
        itemsPerPage = 10,
        onItemsPerPageChange,
        loading = false,
    } = $props();

    let safeCurrentPage = $derived(Number(currentPage) || 1);
    let safeItemsPerPage = $derived(Number(itemsPerPage) || 10);
    let safeTotalItems = $derived(Number(totalItems) || 0);
    let safeTotalPages = $derived(Number(totalPages) || 1);

    let getPageNumbers = $derived(() => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = 1; i <= safeTotalPages; i++) {
            if (
                i === 1 ||
                i === safeTotalPages ||
                (i >= safeCurrentPage - delta && i <= safeCurrentPage + delta)
            ) {
                range.push(i);
            }
        }

        let l;
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push("...");
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    });
</script>

{#if safeTotalItems > 0}
    <div class="pagination-container">
        <div class="pagination-info">
            <span class="info-text">
                Mostrando <strong
                    >{Math.min(
                        (safeCurrentPage - 1) * safeItemsPerPage + 1,
                        safeTotalItems,
                    )}</strong
                >
                -
                <strong
                    >{Math.min(
                        safeCurrentPage * safeItemsPerPage,
                        safeTotalItems,
                    )}</strong
                >
                de <strong>{safeTotalItems}</strong> resultados
            </span>

            {#if onItemsPerPageChange}
                <div class="items-per-page-selector">
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <label>Mostrar</label>
                    <select
                        value={safeItemsPerPage}
                        onchange={(e) =>
                            onItemsPerPageChange(Number(e.currentTarget.value))}
                        disabled={loading}
                    >
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            {/if}
        </div>

        <div class="pagination-controls">
            <button
                class="page-btn prev"
                onclick={() => onPageChange?.(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1 || loading}
                title="Anterior"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>

            <div class="page-numbers">
                {#each getPageNumbers() as page, index}
                    {#if page === "..."}
                        <span class="dots">...</span>
                    {:else}
                        <button
                            class={`page-number ${safeCurrentPage === page ? "active" : ""}`}
                            onclick={() => onPageChange?.(page)}
                            disabled={loading}
                        >
                            {page}
                        </button>
                    {/if}
                {/each}
            </div>

            <button
                class="page-btn next"
                onclick={() => onPageChange?.(safeCurrentPage + 1)}
                disabled={safeCurrentPage === safeTotalPages || loading}
                title="Siguiente"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    </div>
{/if}

<style>
    @import "../../styles/common/Pagination.css";
</style>
