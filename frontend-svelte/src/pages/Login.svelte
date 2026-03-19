<script>
    import { authState } from "../stores/auth.svelte.js";
    import { routerState } from "../stores/router.svelte.js";
    import { authService } from "../services/auth.js";
    import "../styles/common/Auth.css";

    let email = $state("");
    let password = $state("");
    let error = $state("");
    let cargando = $state(false);
    let mostrarPassword = $state(false);

    let isAuthenticated = $derived(authState.isAuthenticated);

    // Redirect to products if already logged in
    $effect(() => {
        if (isAuthenticated) {
            routerState.navigate("/productos");
        }
    });

    async function handleSubmit(e) {
        e.preventDefault();
        error = "";
        cargando = true;

        try {
            await authService.login(email, password);
            routerState.navigate("/productos");
        } catch (err) {
            error = err.message || "Credenciales inválidas";
        } finally {
            cargando = false;
        }
    }

    function togglePassword() {
        mostrarPassword = !mostrarPassword;
    }

    function navigate(e, path) {
        e.preventDefault();
        routerState.navigate(path);
    }
</script>

<div class="auth-page">
    <!-- Partículas flotantes de fondo -->
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

    <!-- Contenedor principal -->
    <div class="auth-container">
        <div class="auth-card">
            <!-- Logo con efecto shine -->
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
                    <span class="title-word">Bienvenido</span>
                    <span class="title-word">de</span>
                    <span class="title-word">nuevo</span>
                </h1>
                <p class="auth-subtitle fade-in">
                    Inicia sesión para disfrutar de nuestros productos
                    artesanales
                </p>
            </div>

            <!-- Error con animación -->
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

            <!-- Formulario -->
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
                            <rect x="2" y="4" width="20" height="16" rx="2"
                            ></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
                            ></path>
                        </svg>
                        <input
                            id="email"
                            type="email"
                            bind:value={email}
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
                            <rect
                                x="3"
                                y="11"
                                width="18"
                                height="11"
                                rx="2"
                                ry="2"
                            ></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input
                            id="password"
                            type={mostrarPassword ? "text" : "password"}
                            bind:value={password}
                            required
                            disabled={cargando}
                            placeholder=" "
                            autocomplete="current-password"
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
                                    ></path>
                                    <circle cx="12" cy="12" r="3"></circle>
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
                                    ></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
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
                        <span>Iniciando sesión...</span>
                    {:else}
                        <span class="btn-text">Iniciar Sesión</span>
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

            <div class="auth-info fade-in-up">
                <p>© 2026 REGMA - El sabor de lo natural</p>
            </div>
        </div>
    </div>
</div>
