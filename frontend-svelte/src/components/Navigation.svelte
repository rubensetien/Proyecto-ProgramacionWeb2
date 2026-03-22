<script>
    import { onMount, onDestroy } from "svelte";
    import {
        LogOut,
        User,
        LayoutDashboard,
        ShoppingCart,
        ChevronDown,
    } from "lucide-svelte";
    import { routerState } from "../stores/router.svelte.js";
    import { authState } from "../stores/auth.svelte.js";
    import "../styles/common/Navbar.css";

    let { transparent = false } = $props();

    let scrolled = $state(false);
    let menuAbierto = $state(false);
    let showProfMenu = $state(false);

    let path = $derived(routerState.currentPath);
    let isAuthenticated = $derived(authState.isAuthenticated);
    let user = $derived(authState.user);

    // Placeholder for cart total until Carrito store is ported
    let cantidadTotal = $state(0);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    function handleScroll() {
        scrolled = window.scrollY > 50;
    }

    onMount(() => {
        window.addEventListener("scroll", handleScroll);
        handleScroll();
    });

    onDestroy(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("scroll", handleScroll);
        }
    });

    function getInitials(name) {
        return name ? name.substring(0, 2).toUpperCase() : "U";
    }

    function navigate(e, href) {
        e.preventDefault();
        routerState.navigate(href);
        menuAbierto = false;
        showProfMenu = false;
    }

    function handleLogout() {
        authState.logout();
        routerState.navigate("/login");
        menuAbierto = false;
    }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<nav
    class="navbar-container {transparent
        ? scrolled
            ? 'scrolled'
            : ''
        : 'solid-mode'} {path.startsWith('/profesionales') ? 'navbar-b2b' : ''}"
    onmouseleave={() => (showProfMenu = false)}
>
    <div class="navbar-content">
        <!-- LOGO -->
        <a
            href="/"
            class="nav-logo-container"
            onclick={(e) => navigate(e, "/")}
        >
            <img
                src="https://regma.es/wp-content/uploads/2024/09/240503-regma-logotipo-rgb-logo-con-tagline-e1721651920696.png"
                alt="Regma"
                class="nav-logo-img"
            />
        </a>

        <!-- CENTER LINKS -->
        <div class="nav-links">
            <a
                href="/"
                class="nav-link {path === '/' ? 'active' : ''}"
                onclick={(e) => navigate(e, "/")}>Inicio</a
            >

            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="nav-item-dropdown"
                onmouseenter={() => (showProfMenu = true)}
            >
                <a
                    href="/profesionales"
                    class="nav-link {path === '/profesionales' ? 'active' : ''}"
                    style="display: flex; align-items: center; gap: 5px;"
                    onclick={(e) => navigate(e, "/profesionales")}
                >
                    Regma para Profesionales <ChevronDown size={14} />
                </a>
            </div>

            <a
                href="/historia"
                class="nav-link {path === '/historia' ? 'active' : ''}"
                onclick={(e) => navigate(e, "/historia")}>Sobre Regma</a
            >
            <a
                href="/tiendas"
                class="nav-link {path === '/tiendas' ? 'active' : ''}"
                onclick={(e) => navigate(e, "/tiendas")}>Tiendas</a
            >
            <a
                href="/productos"
                class="btn-nav-catalog {path === '/productos'
                    ? 'active-catalog'
                    : ''}"
                onclick={(e) => navigate(e, "/productos")}>Catálogo</a
            >
        </div>

        <!-- RIGHT ACTIONS (AUTH & CART) -->
        <div class="nav-actions">
            <!-- CART ICON -->
            <a
                href="/carrito"
                class="nav-cart-container"
                title="Ver mi carrito"
                onclick={(e) => navigate(e, "/carrito")}
            >
                <ShoppingCart size={24} />
                {#if cantidadTotal > 0}
                    <span class="nav-cart-badge">{cantidadTotal}</span>
                {/if}
            </a>

            {#if !isAuthenticated}
                <a
                    href="/login"
                    class="btn-nav-login"
                    style="cursor: pointer;"
                    onclick={(e) => navigate(e, "/login")}>Entrar</a
                >
            {:else}
                <div class="user-avatar-container">
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                        class="user-avatar"
                        onclick={() => (menuAbierto = !menuAbierto)}
                        title="Mi Cuenta"
                    >
                        {getInitials(user?.nombre)}
                    </div>

                    <!-- DROPDOWN MENU -->
                    {#if menuAbierto}
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div
                            class="nav-dropdown-menu"
                            onmouseleave={() => (menuAbierto = false)}
                        >
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <div
                                class="nav-dropdown-item"
                                onclick={(e) =>
                                    navigate(
                                        e,
                                        user?.rol === "publico"
                                            ? "/perfil"
                                            : "/admin",
                                    )}
                            >
                                <LayoutDashboard size={18} />
                                {user?.rol === "publico"
                                    ? "Mi Perfil"
                                    : "Dashboard"}
                            </div>

                            {#if user?.rol === "admin" || user?.rol === "trabajador"}
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <div
                                    class="nav-dropdown-item"
                                    onclick={(e) => navigate(e, "/perfil")}
                                >
                                    <User size={18} />
                                    Mi Cuenta
                                </div>
                            {/if}

                            <div class="nav-dropdown-divider"></div>

                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <div
                                class="nav-dropdown-item logout"
                                onclick={handleLogout}
                            >
                                <LogOut size={18} />
                                Cerrar Sesión
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>

    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="nav-mega-overlay {showProfMenu ? 'active' : ''}"
        onmouseenter={() => (showProfMenu = true)}
    >
        <div class="nav-mega-grid">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div
                class="nav-mega-col"
                onclick={(e) => navigate(e, "/profesionales/hosteleria")}
            >
                <video autoplay loop muted playsinline>
                    <source
                        src="{API_URL}/uploads/PreparacionCucurucho.mp4"
                        type="video/mp4"
                    />
                </video>
                <div class="nav-mega-content">
                    <h3>
                        Helados artesanales para<br />hostelería y restauración
                    </h3>
                    <p>El mejor postre para tus clientes.</p>
                </div>
            </div>

            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div
                class="nav-mega-col"
                onclick={(e) => navigate(e, "/profesionales/retail")}
            >
                <video autoplay loop muted playsinline>
                    <source
                        src="{API_URL}/uploads/helados_para_supermercados.mp4"
                        type="video/mp4"
                    />
                </video>
                <div class="nav-mega-content">
                    <h3>Helados para<br />supermercados</h3>
                    <p>Los 14 sabores de helados ya disponibles.</p>
                </div>
            </div>

            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div
                class="nav-mega-col"
                onclick={(e) => navigate(e, "/profesionales/corner")}
            >
                <video autoplay loop muted playsinline>
                    <source
                        src="{API_URL}/uploads/preparacionHelado.mp4"
                        type="video/mp4"
                    />
                </video>
                <div class="nav-mega-content">
                    <h3>Córner Regma</h3>
                    <p>Un córner refrigerado para tu negocio.</p>
                </div>
            </div>

            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div
                class="nav-mega-col"
                onclick={(e) => navigate(e, "/profesionales/eventos")}
            >
                <video autoplay loop muted playsinline>
                    <source
                        src="{API_URL}/uploads/videoParejaDandoseHelado.mp4"
                        type="video/mp4"
                    />
                </video>
                <div class="nav-mega-content">
                    <h3>Helados para eventos</h3>
                    <p>Catering y helados para tus invitados.</p>
                </div>
            </div>
        </div>
    </div>
</nav>
