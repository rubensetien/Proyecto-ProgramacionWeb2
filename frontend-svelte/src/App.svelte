<script>
    import { onMount } from "svelte";
    import { routerState } from "./stores/router.svelte.js";
    import { authState } from "./stores/auth.svelte.js";
    import Navigation from "./components/Navigation.svelte";
    import Login from "./pages/Login.svelte";
    import Productos from "./pages/Productos.svelte";
    import Perfil from "./pages/Perfil.svelte";
    import LandingPage from "./pages/LandingPage.svelte";
    import AdminDashboard from "./pages/AdminDashboard.svelte";
    import Registro from "./pages/Registro.svelte";
    import Footer from "./components/Footer.svelte";

    let path = $derived(routerState.currentPath);

    onMount(() => {
        // Initialize stores
        authState.init();
        routerState.init();
    });
</script>

{#if path !== "/login" && path !== "/registro" && !path.startsWith("/admin")}
    <Navigation transparent={path === "/" || path.startsWith("/perfil")} />
{/if}

<main>
    {#if path === "/"}
        <LandingPage />
    {:else if path === "/productos"}
        <Productos />
    {:else if path === "/login"}
        <Login />
    {:else if path === "/registro"}
        <Registro />
    {:else if path.startsWith("/perfil")}
        <Perfil />
    {:else if path.startsWith("/admin")}
        <AdminDashboard />
    {:else}
        <div class="container" style="margin-top: 2rem;">
            <h1>404 - No Encontrado</h1>
            <p>La ruta no existe.</p>
        </div>
    {/if}
</main>

{#if path !== "/login" && path !== "/registro" && !path.startsWith("/admin")}
    <Footer />
{/if}
