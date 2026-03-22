<script>
    import { authState } from "../stores/auth.svelte.js";
    import { routerState } from "../stores/router.svelte.js";
    import { authService } from "../services/auth.js";
    import "../styles/common/Auth.css";

    let formData = $state({
        nombre: "",
        email: "",
        telefono: "",
        password: "",
        confirmPassword: "",
    });

    let error = $state("");
    let cargando = $state(false);
    let mostrarPassword = $state(false);
    let mostrarConfirmPassword = $state(false);

    let isAuthenticated = $derived(authState.isAuthenticated);

    // Redirect to products if already logged in
    $effect(() => {
        if (isAuthenticated) {
            routerState.navigate("/productos");
        }
    });

    function validatePassword(password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return hasUpperCase && hasLowerCase && hasNumber;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        error = "";

        if (formData.password !== formData.confirmPassword) {
            error = "Las contraseñas no coinciden";
            return;
        }

        if (!validatePassword(formData.password)) {
            error = "La contraseña debe tener mayúsculas, minúsculas y números";
            return;
        }

        cargando = true;

        try {
            const { confirmPassword, ...dataToSend } = formData;
            await authService.register(dataToSend);
            routerState.navigate("/productos");
        } catch (err) {
            error = err.message || "Error al registrarse";
        } finally {
            cargando = false;
        }
    }

    function togglePassword() {
        mostrarPassword = !mostrarPassword;
    }
    function toggleConfirmPassword() {
        mostrarConfirmPassword = !mostrarConfirmPassword;
    }

    function navigate(e, path) {
        e.preventDefault();
        routerState.navigate(path);
    }
</script>

<div class="auth-page">
    <!-- Botón Volver al inicio flotante -->
    <button class="floating-back-btn" onclick={(e) => navigate(e, "/")}>
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver al Inicio
    </button>

    <div class="auth-background">
        <div class="particles">
            {#each Array(20) as _, i}
                <div
                    class="particle"
                    style="--delay: {i * 0.5}s; --x: {Math.random() *
                        100}%; --y: {Math.random() * 100}%; --duration: {10 +
                        Math.random() * 20}s"
                ></div>
            {/each}
        </div>
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
    </div>

    <div
        class="auth-container"
        style="padding-top: 40px; padding-bottom: 40px;"
    >
        <div class="auth-card">
            <div class="auth-header">
                <div class="logo-wrapper">
                    <img
                        src="https://regma.es/wp-content/uploads/2024/09/240503-regma-logotipo-rgb-logo-con-tagline-e1721651920696.png"
                        alt="REGMA"
                        class="auth-logo"
                    />
                    <div class="logo-glow"></div>
                </div>
                <h1 class="auth-title">
                    <span class="title-word">Únete</span>
                    <span class="title-word">a</span>
                    <span class="title-word">REGMA</span>
                </h1>
                <p class="auth-subtitle fade-in">
                    Crea tu cuenta y disfruta de nuestros helados artesanales
                </p>
            </div>

            {#if error}
                <div class="auth-error pulse-error">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{error}</span>
                </div>
            {/if}

            <form class="auth-form" onsubmit={handleSubmit}>
                <div class="form-group float-label">
                    <div class="input-wrapper">
                        <svg
                            class="input-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                            />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <input
                            id="nombre"
                            type="text"
                            bind:value={formData.nombre}
                            required
                            disabled={cargando}
                            placeholder=" "
                            autocomplete="name"
                        />
                        <label for="nombre">Nombre Completo</label>
                        <div class="input-border"></div>
                    </div>
                </div>

                <div class="form-group float-label">
                    <div class="input-wrapper">
                        <svg
                            class="input-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path
                                d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
                            />
                        </svg>
                        <input
                            id="email"
                            type="email"
                            bind:value={formData.email}
                            required
                            disabled={cargando}
                            placeholder=" "
                            autocomplete="email"
                        />
                        <label for="email">Correo Electrónico</label>
                        <div class="input-border"></div>
                    </div>
                </div>

                <div class="form-group float-label">
                    <div class="input-wrapper">
                        <svg
                            class="input-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                            />
                        </svg>
                        <input
                            id="telefono"
                            type="tel"
                            bind:value={formData.telefono}
                            disabled={cargando}
                            placeholder=" "
                            autocomplete="tel"
                        />
                        <label for="telefono">Teléfono (opcional)</label>
                        <div class="input-border"></div>
                    </div>
                </div>

                <div class="form-group float-label">
                    <div class="input-wrapper">
                        <svg
                            class="input-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <rect
                                x="3"
                                y="11"
                                width="18"
                                height="11"
                                rx="2"
                                ry="2"
                            />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input
                            id="password"
                            type={mostrarPassword ? "text" : "password"}
                            bind:value={formData.password}
                            required
                            disabled={cargando}
                            placeholder=" "
                            autocomplete="new-password"
                            minlength="6"
                        />
                        <label for="password">Contraseña</label>
                        <button
                            type="button"
                            class="password-toggle"
                            onclick={togglePassword}
                            disabled={cargando}
                            tabindex="-1"
                        >
                            {#if mostrarPassword}
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                    />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            {:else}
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                                    />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            {/if}
                        </button>
                        <div class="input-border"></div>
                    </div>
                </div>

                <div class="form-group float-label">
                    <div class="input-wrapper">
                        <svg
                            class="input-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                            />
                        </svg>
                        <input
                            id="confirmPassword"
                            type={mostrarConfirmPassword ? "text" : "password"}
                            bind:value={formData.confirmPassword}
                            required
                            disabled={cargando}
                            placeholder=" "
                            autocomplete="new-password"
                            minlength="6"
                        />
                        <label for="confirmPassword">Confirmar Contraseña</label
                        >
                        <button
                            type="button"
                            class="password-toggle"
                            onclick={toggleConfirmPassword}
                            disabled={cargando}
                            tabindex="-1"
                        >
                            {#if mostrarConfirmPassword}
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                    />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            {:else}
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                                    />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            {/if}
                        </button>
                        <div class="input-border"></div>
                    </div>
                </div>

                <button
                    type="submit"
                    class="btn-primary btn-magnetic"
                    disabled={cargando}
                >
                    {#if cargando}
                        <div class="btn-spinner"></div>
                        <span>Creando cuenta...</span>
                    {:else}
                        <span class="btn-text">Crear Cuenta</span>
                        <svg
                            class="btn-arrow"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                        <div class="btn-shine"></div>
                    {/if}
                </button>
            </form>

            <div class="auth-footer" style="margin-top: 24px;">
                <p
                    class="fade-in-up"
                    style="display: flex; flex-direction: column; gap: 10px; align-items: center; border-top: 2px solid #f0f0f0; padding-top: 16px;"
                >
                    <span>
                        ¿Ya tienes cuenta?
                        <button
                            type="button"
                            class="link-button link-animated"
                            onclick={(e) => navigate(e, "/login")}
                            disabled={cargando}
                            style="border: none; background: transparent; color: var(--regma-orange); font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;"
                        >
                            Inicia sesión aquí
                        </button>
                    </span>
                </p>
                <div class="auth-info fade-in-up" style="margin-top: 15px;">
                    <p
                        style="text-align: center; color: #999; font-size: 13px;"
                    >
                        © 2026 REGMA - El sabor de lo natural
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
