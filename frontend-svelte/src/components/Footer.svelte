<script>
    import { routerState } from "../stores/router.svelte.js";

    function navigate(e, href) {
        if (e) e.preventDefault();
        routerState.navigate(href);
    }
</script>

<div class="footer-wrapper">
    <!-- Wave Separator -->
    <div class="custom-shape-divider-top">
        <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
        >
            <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                class="shape-fill"
            ></path>
        </svg>
    </div>

    <footer class="footer-masterpiece">
        <div class="footer-content-grid">
            <!-- Brand Section -->
            <div class="footer-brand-section">
                <img
                    src="https://regma.es/wp-content/uploads/2024/09/240503-regma-logotipo-rgb-logo-con-tagline-e1721651920696.png"
                    alt="Regma"
                    class="footer-logo-official"
                />
                <p class="footer-mission">
                    El sabor de lo natural. Ingredientes seleccionados, recetas
                    únicas, calidad y tradición desde 1933.
                </p>
            </div>

            <!-- Menu Sections -->
            <div class="footer-menus">
                <div class="menu-col">
                    <h6 class="menu-title">MENÚ</h6>
                    <ul class="menu-list">
                        <li>
                            <a
                                href="/productos?categoria=Helados"
                                onclick={(e) =>
                                    navigate(e, "/productos?categoria=Helados")}
                                >Helados y Dulces</a
                            >
                        </li>
                        <li>
                            <a
                                href="/tiendas"
                                onclick={(e) => navigate(e, "/tiendas")}
                                >Trabaja con nosotros</a
                            >
                        </li>
                        <li>
                            <a
                                href="/profesionales"
                                onclick={(e) => navigate(e, "/profesionales")}
                                >Regma para profesionales</a
                            >
                        </li>
                        <li>
                            <a
                                href="/tiendas"
                                onclick={(e) => navigate(e, "/tiendas")}
                                >Localizador de tiendas</a
                            >
                        </li>
                        <li>
                            <a
                                href="/contacto"
                                onclick={(e) => navigate(e, "/contacto")}
                                >Contacto</a
                            >
                        </li>
                    </ul>
                </div>

                <div class="menu-col">
                    <h6 class="menu-title">PRODUCTO</h6>
                    <ul class="menu-list">
                        <li>
                            <a
                                href="/productos?categoria=Helados"
                                onclick={(e) =>
                                    navigate(e, "/productos?categoria=Helados")}
                                >Helados Regma</a
                            >
                        </li>
                        <li>
                            <a
                                href="/productos?categoria=Salados"
                                onclick={(e) =>
                                    navigate(e, "/productos?categoria=Salados")}
                                >Nuestros Salados</a
                            >
                        </li>
                        <li>
                            <a
                                href="/productos?categoria=Dulces"
                                onclick={(e) =>
                                    navigate(e, "/productos?categoria=Dulces")}
                                >Dulces Regma</a
                            >
                        </li>
                    </ul>
                </div>

                <div class="menu-col">
                    <h6 class="menu-title">LEGAL</h6>
                    <ul class="menu-list">
                        <li>Política de privacidad</li>
                        <li>Política de Cookies</li>
                        <li>Aviso legal</li>
                        <li>Canal interno</li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>

    <!-- Orange Bottom Bar -->
    <div class="footer-bottom-bar">
        <div class="bottom-bar-content">
            <span class="copyright-text"
                >© 2026 Regma - Tradición y Sabor desde 1933.</span
            >
            <div class="bottom-socials">
                <a href="/" aria-label="Facebook">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><path
                            d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                        ></path></svg
                    >
                </a>
                <a href="/" aria-label="Instagram">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><rect x="2" y="2" width="20" height="20" rx="5" ry="5"
                        ></rect><path
                            d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                        ></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"
                        ></line></svg
                    >
                </a>
                <a href="/" aria-label="Email">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><path
                            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        ></path><polyline points="22,6 12,13 2,6"
                        ></polyline></svg
                    >
                </a>
            </div>
        </div>
    </div>
</div>
