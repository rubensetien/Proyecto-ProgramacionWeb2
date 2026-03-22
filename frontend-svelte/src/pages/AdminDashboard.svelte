<script>
    import { onMount } from "svelte";
    import { authState } from "../stores/auth.svelte.js";
    import { routerState } from "../stores/router.svelte.js";
    import GestionProductos from "./admin/GestionProductos.svelte";
    import "../styles/admin/AdminLayout.css";
    import "../styles/admin/DashboardAdmin.css";

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    let user = $derived(authState.user);
    let isAuthenticated = $derived(authState.isAuthenticated);
    let path = $derived(routerState.currentPath);

    // Stats
    let stats = $state({
        usuarios: { total: 0, trabajadores: 0, clientes: 0 },
        ubicaciones: { total: 0 },
        solicitudes: { pendientes: 0 },
        pedidos: { hoy: 0 },
        productos: { total: 0, activos: 0 },
    });
    let loading = $state(true);
    let pendingSolicitudes = $state(0);
    let pendingPedidos = $state(0);

    $effect(() => {
        if (
            !isAuthenticated ||
            (user?.rol !== "admin" && user?.rol !== "gestor-tienda")
        ) {
            routerState.navigate("/");
        }
    });

    onMount(async () => {
        await cargarEstadisticas();
    });

    async function cargarEstadisticas() {
        try {
            const token = localStorage.getItem("jwt");
            const res = await fetch(`${API_URL}/api/dashboard/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                stats = data.data || stats;
            }
        } catch (error) {
            console.error("Error cargando estadísticas:", error);
        } finally {
            loading = false;
        }
    }

    function handleLogout() {
        authState.logout();
        routerState.navigate("/login");
    }

    function navigate(e, href) {
        e.preventDefault();
        routerState.navigate(href);
    }
</script>

<div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" style="position: relative;">
        <div class="sidebar-header">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="logo-container"
                onclick={(e) => navigate(e, "/")}
                title="Ir al Landing"
            >
                <img
                    src="https://regma.es/wp-content/uploads/2024/09/240503-regma-logotipo-rgb-logo-con-tagline-e1721651920696.png"
                    alt="REGMA"
                    class="logo-oficial"
                />
            </div>

            <div class="admin-info">
                <div class="admin-avatar">
                    <span class="avatar-letter"
                        >{user?.nombre?.charAt(0).toUpperCase() || "A"}</span
                    >
                    <div class="status-indicator"></div>
                </div>
                <div class="admin-details">
                    <p class="admin-nombre">
                        {user?.nombre || "Administrador"}
                    </p>
                    <span class="admin-badge">
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="12"
                            height="12"
                        >
                            <path
                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            />
                        </svg>
                        ADMIN
                    </span>
                </div>
            </div>
        </div>

        <nav class="sidebar-nav">
            <button
                class="admin-nav-item {path === '/admin' ? 'active' : ''}"
                onclick={(e) => navigate(e, "/admin")}
            >
                <span class="nav-icon">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                    </svg>
                </span>
                <span class="nav-text">Dashboard</span>
            </button>

            <!-- Stubs for future panels -->
            <button
                class="admin-nav-item {path === '/admin/productos'
                    ? 'active'
                    : ''}"
                onclick={(e) => navigate(e, "/admin/productos")}
            >
                <span class="nav-icon">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                        />
                    </svg>
                </span>
                <span class="nav-text">Gestión Productos</span>
            </button>

            <button
                class="admin-nav-item {path === '/admin/tiendas'
                    ? 'active'
                    : ''}"
                onclick={(e) => navigate(e, "/admin/tiendas")}
            >
                <span class="nav-icon">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            d="M3 21h18v-8a2 2 0 0 0-2-2h-3v-7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v7H4a2 2 0 0 0-2 2v8z"
                        />
                    </svg>
                </span>
                <span class="nav-text">Gestión Tiendas</span>
            </button>
        </nav>

        <div class="sidebar-footer">
            <button class="btn-logout" onclick={handleLogout}>
                <span class="logout-icon">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </span>
                <span>Cerrar Sesión</span>
            </button>
        </div>
    </aside>

    <!-- Main Content Area -->
    <main class="admin-content" style="margin-left: 0;">
        {#if path === "/admin"}
            <!-- Dashboard Content -->
            {#if loading}
                <div class="dashboard-loading">
                    <div class="spinner"></div>
                    <p>Cargando dashboard...</p>
                </div>
            {:else}
                <div class="dashboard-admin">
                    <div class="dashboard-header">
                        <h1>
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                width="32"
                                height="32"
                                style="margin-right: 10px;"
                            >
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                            </svg>
                            Dashboard
                        </h1>
                        <p class="dashboard-subtitle">
                            Panel de control y estadísticas de REGMA
                        </p>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card usuarios">
                            <div class="stat-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                                    />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <div class="stat-content">
                                <p class="stat-label">Usuarios</p>
                                <p class="stat-value">
                                    {stats.usuarios?.total || 0}
                                </p>
                                <p class="stat-detail">
                                    {stats.usuarios?.trabajadores || 0} personal,
                                    {stats.usuarios?.clientes || 0} clientes
                                </p>
                            </div>
                        </div>

                        <div class="stat-card ubicaciones">
                            <div class="stat-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8z"
                                    />
                                    <path
                                        d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
                                    />
                                    <path d="M12 2v4" />
                                </svg>
                            </div>
                            <div class="stat-content">
                                <p class="stat-label">Tiendas Activas</p>
                                <p class="stat-value">
                                    {stats.ubicaciones?.total || 0}
                                </p>
                                <p class="stat-detail">Operativas</p>
                            </div>
                        </div>

                        <div
                            class="stat-card solicitudes {stats.solicitudes
                                ?.pendientes > 0
                                ? 'alert'
                                : ''}"
                        >
                            <div class="stat-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="18"
                                        rx="2"
                                        ry="2"
                                    />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                            <div class="stat-content">
                                <p class="stat-label">Solicitudes</p>
                                <p class="stat-value">
                                    {stats.solicitudes?.pendientes || 0}
                                </p>
                                <p class="stat-detail">
                                    Pendientes de revisión
                                </p>
                            </div>
                        </div>

                        <div class="stat-card pedidos">
                            <div class="stat-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path
                                        d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                                    />
                                </svg>
                            </div>
                            <div class="stat-content">
                                <p class="stat-label">Pedidos Hoy</p>
                                <p class="stat-value">
                                    {stats.pedidos?.hoy || 0}
                                </p>
                                <p class="stat-detail">Recibidos</p>
                            </div>
                        </div>

                        <div class="stat-card productos">
                            <div class="stat-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                                    />
                                </svg>
                            </div>
                            <div class="stat-content">
                                <p class="stat-label">Productos</p>
                                <p class="stat-value">
                                    {stats.productos?.total || 0}
                                </p>
                                <p class="stat-detail">
                                    {stats.productos?.activos || 0} activos
                                </p>
                            </div>
                        </div>

                        <div class="stat-card sistema">
                            <div class="stat-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <div class="stat-content">
                                <p class="stat-label">Sistema</p>
                                <p class="stat-value">100%</p>
                                <p class="stat-detail">Operativo</p>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        {:else if path === "/admin/productos"}
            <GestionProductos />
        {:else}
            <div class="content-header">
                <h1>Sección en Construcción</h1>
                <p class="content-subtitle">
                    Las vistas anidadas del panel de control ({path}) se
                    migrarán próximamente.
                </p>
            </div>
        {/if}
    </main>
</div>
