<script>
    import { routerState } from '../stores/router.svelte.js';
    import { authState } from '../stores/auth.svelte.js';

    // Highlight current page dynamically
    let path = $derived(routerState.currentPath);
    let isAuthenticated = $derived(authState.isAuthenticated);
    let user = $derived(authState.user);

    function navigate(e, href) {
        e.preventDefault();
        routerState.navigate(href);
    }

    function handleLogout() {
        authState.logout();
        routerState.navigate('/login');
    }
</script>

<nav class="navbar">
    <div class="container nav-content">
        <a href="/" class="logo" onclick={(e) => navigate(e, '/')}>PW2 Store</a>
        
        <ul class="nav-links">
            <li>
                <a href="/productos" 
                   class="nav-link {path.startsWith('/productos') ? 'active' : ''}" 
                   onclick={(e) => navigate(e, '/productos')}>
                   Productos
                </a>
            </li>
            {#if isAuthenticated}
                <li>
                    <a href="/perfil" 
                       class="nav-link {path === '/perfil' ? 'active' : ''}" 
                       onclick={(e) => navigate(e, '/perfil')}>
                       Perfil ({user?.nombre || 'Usuario'})
                    </a>
                </li>
                <li>
                    <button class="btn btn-logout" onclick={handleLogout}>Salir</button>
                </li>
            {:else}
                <li>
                    <a href="/login" 
                       class="nav-link {path === '/login' ? 'active' : ''}" 
                       onclick={(e) => navigate(e, '/login')}>
                       Iniciar sesión
                    </a>
                </li>
            {/if}
        </ul>
    </div>
</nav>

<style>
    .navbar {
        background-color: var(--card-bg);
        border-bottom: 1px solid var(--border-color);
        padding: 1rem 0;
        position: sticky;
        top: 0;
        z-index: 50;
    }
    .nav-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .logo {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--primary-color);
    }
    .nav-links {
        display: flex;
        gap: 1.5rem;
        align-items: center;
    }
    .nav-link {
        font-weight: 500;
        color: var(--text-muted);
        transition: color 0.2s;
    }
    .nav-link:hover {
        color: var(--text-color);
    }
    .nav-link.active {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 0.25rem;
    }
    .btn-logout {
        background: transparent;
        color: var(--danger-color);
        border: 1px solid var(--danger-color);
        padding: 0.25rem 0.75rem;
    }
    .btn-logout:hover {
        background-color: var(--danger-color);
        color: white;
    }
</style>
