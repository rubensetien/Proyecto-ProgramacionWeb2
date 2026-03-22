<script>
    let {
        tipo, // 'producto', 'variante', 'categoria'
        imagenActual,
        onImagenCargada,
        nombre, // Nombre del producto/sabor para el archivo
    } = $props();

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    let previsualizacion = $state(imagenActual || null);
    let cargando = $state(false);
    let error = $state(null);

    async function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith("image/")) {
            error = "Solo se permiten imágenes";
            return;
        }

        // Validar tamaño (5MB máximo)
        if (file.size > 5 * 1024 * 1024) {
            error = "La imagen no puede superar 5MB";
            return;
        }

        error = null;

        // Mostrar previsualización
        const reader = new FileReader();
        reader.onloadend = () => {
            previsualizacion = reader.result;
        };
        reader.readAsDataURL(file);

        // Subir imagen
        await subirImagen(file);
    }

    async function subirImagen(file) {
        cargando = true;
        error = null;

        try {
            const formData = new FormData();
            formData.append("imagen", file);
            formData.append("nombre", nombre || "archivo");

            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/upload/${tipo}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                onImagenCargada?.(data.data.url);
            } else {
                error = data.message || "Error al subir la imagen";
            }
        } catch (err) {
            console.error("Error subiendo imagen:", err);
            error = "Error al subir la imagen";
        } finally {
            cargando = false;
        }
    }

    function eliminarImagen() {
        previsualizacion = null;
        onImagenCargada?.(null);
    }
</script>

<div class="image-uploader">
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label class="image-uploader-label">Imagen</label>

    <div class="image-uploader-container">
        {#if previsualizacion}
            <div class="image-preview">
                <img src={previsualizacion} alt="Previsualización" />
                <button
                    type="button"
                    class="btn-eliminar-imagen"
                    onclick={eliminarImagen}
                    disabled={cargando}
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
        {:else}
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <label class="upload-area">
                <input
                    type="file"
                    accept="image/*"
                    onchange={handleFileChange}
                    disabled={cargando}
                    style="display: none;"
                />
                <div class="upload-icon">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                        ></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                </div>
                <p class="upload-text">
                    {cargando
                        ? "Subiendo..."
                        : "Haz clic o arrastra una imagen"}
                </p>
                <p class="upload-hint">PNG, JPG, WEBP (máx. 5MB)</p>
            </label>
        {/if}
    </div>

    {#if error}
        <p class="upload-error">{error}</p>
    {/if}
</div>
