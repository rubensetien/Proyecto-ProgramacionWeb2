<script>
    import { onMount, onDestroy } from "svelte";
    import { routerState } from "../stores/router.svelte.js";
    import { authState } from "../stores/auth.svelte.js";
    import "../styles/public/LandingPageAdvanced.css";

    // The backend URL is retrieved similarly to React's import.meta.env
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    let scrollY = $state(0);
    let isAuthenticated = $derived(authState.isAuthenticated);

    function handleScroll() {
        scrollY = window.scrollY;
    }

    onMount(() => {
        window.addEventListener("scroll", handleScroll);
        // Note: Initial scroll trigger might be needed
    });

    onDestroy(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("scroll", handleScroll);
        }
    });

    function scrollToContent() {
        const nextSection = document.querySelector(".natural-section");
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
        }
    }

    function navigate(e, path) {
        e.preventDefault();
        routerState.navigate(path);
    }

    function handleMouseMove(e) {
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } =
            currentTarget.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;
        const xPct = x / width - 0.5;
        const yPct = y / height - 0.5;

        currentTarget.style.setProperty("--mouse-x", xPct);
        currentTarget.style.setProperty("--mouse-y", yPct);
    }

    function handleMouseLeave(e) {
        e.currentTarget.style.setProperty("--mouse-x", 0);
        e.currentTarget.style.setProperty("--mouse-y", 0);
    }
</script>

<div class="landing-advanced">
    <!-- --- 1. HERO CINEMATOGRÁFICO --- -->
    <section class="hero-video-container">
        <video class="hero-video-bg" autoplay loop muted playsinline>
            <source
                src="{API_URL}/uploads/PreparacionCucurucho.mp4"
                type="video/mp4"
            />
            Tu navegador no soporta video HTML5.
        </video>
        <div class="hero-overlay-gradient"></div>

        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="hero-content-advanced"
            style="transform: translateY({scrollY * 0.3}px); opacity: {1 -
                scrollY / 700}; perspective: 1000px;"
            onmousemove={handleMouseMove}
            onmouseleave={handleMouseLeave}
        >
            <img
                src="https://regma.es/wp-content/uploads/2024/09/240503-regma-logotipo-rgb-logo-con-tagline-e1721651920696.png"
                alt="REGMA"
                class="hero-logo-dynamic"
            />
            <p class="hero-subtitle-advanced">Pasión Helada desde 1933</p>
        </div>

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="scroll-indicator" onclick={scrollToContent}>
            <div class="mouse">
                <div class="wheel"></div>
            </div>
            <div class="arrow-scroll">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </section>

    <!-- --- 2. 100% NATURAL (Clean & Bold) --- -->
    <section class="natural-section">
        <div class="natural-content fade-up" class:visible={scrollY > 100}>
            <h2 class="natural-title">100% NATURAL</h2>
            <p class="natural-desc">
                Sin aditivos. Sin conservantes.<br />
                Solo leche fresca de Cantabria, fruta de temporada y pasión.
            </p>
        </div>
    </section>

    <!-- --- 3. SCROLL HORIZONTAL DE PRODUCTOS (Vibrant) --- -->
    <section class="horizontal-section">
        <div style="padding: 0 5vw 40px 5vw; text-align: center;">
            <span class="section-tag">Nuestras Creaciones</span>
            <h2 class="section-heading-fresh">Sabores que Enamoran</h2>
        </div>

        <div class="horizontal-track">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="product-card-3d"
                onclick={(e) => navigate(e, "/productos")}
            >
                <img
                    class="card-img-bg"
                    src="{API_URL}/uploads/landing/categoria-helados.jpg"
                    alt="Helados"
                />
                <div class="card-content-bottom">
                    <h3 class="card-title-lg">Helados</h3>
                    <p class="card-desc">Cremosos y auténticos</p>
                    <button class="btn-card-action">Ver Catálogo</button>
                </div>
            </div>

            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="product-card-3d"
                onclick={(e) => navigate(e, "/productos")}
            >
                <img
                    class="card-img-bg"
                    src="{API_URL}/uploads/landing/categoria-dulces.png"
                    alt="Dulces"
                />
                <div class="card-content-bottom">
                    <h3 class="card-title-lg">Repostería</h3>
                    <p class="card-desc">Dulces momentos</p>
                    <button class="btn-card-action">Ver Catálogo</button>
                </div>
            </div>
        </div>
    </section>

    <!-- --- 4. MAPA INTERACTIVO TEASER --- -->
    <section class="map-teaser-section">
        <img
            src="{API_URL}/uploads/landing/hero-principal.jpg"
            alt="Mapa Fondo"
            class="map-bg-image"
        />
        <div class="map-content-center">
            <h2 style="font-size: 3rem; margin-bottom: 20px;">
                Estamos Cerca de Ti
            </h2>
            <p style="margin-bottom: 40px; font-size: 1.2rem; color: #333;">
                Descubre nuestras ubicaciones en el norte de España.
            </p>
        </div>
    </section>
</div>
