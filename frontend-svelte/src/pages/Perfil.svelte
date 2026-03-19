<script>
    import { authState } from "../stores/auth.svelte.js";
    import { routerState } from "../stores/router.svelte.js";

    let user = $derived(authState.user);
    let isAuthenticated = $derived(authState.isAuthenticated);

    // Protect route
    $effect(() => {
        if (!isAuthenticated) {
            routerState.navigate("/login");
        }
    });

    function handleLogout() {
        authState.logout();
        routerState.navigate("/login");
    }
</script>

<div class="container section">
    <div class="card profile-card">
        <h1>Mi Perfil</h1>

        {#if user}
            <div class="user-info">
                <p><strong>Nombre:</strong> {user.nombre}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rol:</strong> {user.rol}</p>
            </div>

            <button class="btn btn-danger btn-block" onclick={handleLogout}>
                Cerrar Sesión
            </button>
        {:else}
            <p>Cargando datos del usuario...</p>
        {/if}
    </div>
</div>

<style>
    .section {
        margin-top: 4rem;
        display: flex;
        justify-content: center;
    }
    .profile-card {
        width: 100%;
        max-width: 500px;
    }
    .profile-card h1 {
        margin-bottom: 1.5rem;
        color: var(--primary-color);
        text-align: center;
    }
    .user-info {
        margin-bottom: 2rem;
        padding: 1rem;
        background-color: var(--bg-color);
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
    }
    .user-info p {
        margin-bottom: 0.5rem;
        font-size: 1.125rem;
    }
    .btn-block {
        width: 100%;
    }
</style>
