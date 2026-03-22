<script>
    import { authState } from "../stores/auth.svelte.js";
    import { routerState } from "../stores/router.svelte.js";
    import {
        User,
        Package,
        LogOut,
        MapPin,
        Key,
        Save,
        Phone,
        Mail,
        Shield,
        AlertTriangle,
        CheckCircle,
    } from "lucide-svelte";
    import "../styles/cliente/PerfilCliente.css";

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    let user = $derived(authState.user);
    let isAuthenticated = $derived(authState.isAuthenticated);
    let path = $derived(routerState.currentPath);

    // Profile Data Form State
    let formData = $state({
        nombre: "",
        email: "",
        telefono: "",
        password: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    let loading = $state(false);
    let message = $state({ type: "", text: "" });

    // Sync user data to form
    $effect(() => {
        if (user) {
            formData.nombre = user.nombre || "";
            formData.email = user.email || "";
            formData.telefono = user.telefono || "";
        }
    });

    $effect(() => {
        if (!isAuthenticated) {
            routerState.navigate("/login");
        }
    });

    function handleLogout() {
        authState.logout();
        routerState.navigate("/login");
    }

    function navigate(e, href) {
        e.preventDefault();
        routerState.navigate(href);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        message = { type: "", text: "" };

        if (
            formData.newPassword &&
            formData.newPassword !== formData.confirmNewPassword
        ) {
            message = {
                type: "error",
                text: "Las contraseñas nuevas no coinciden",
            };
            return;
        }
        if (formData.newPassword && !formData.password) {
            message = {
                type: "error",
                text: "Debes ingresar tu contraseña actual para cambiarla",
            };
            return;
        }

        loading = true;
        try {
            const token = localStorage.getItem("jwt");
            const res = await fetch(`${API_URL}/api/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    email: formData.email,
                    telefono: formData.telefono,
                    ...(formData.newPassword
                        ? {
                              password: formData.password,
                              newPassword: formData.newPassword,
                          }
                        : {}),
                }),
            });

            const data = await res.json();
            if (data.success) {
                message = {
                    type: "success",
                    text: "Perfil actualizado correctamente",
                };
                if (data.data.token) {
                    localStorage.setItem("jwt", data.data.token);
                }
            } else {
                message = {
                    type: "error",
                    text: data.message || "Error al actualizar perfil",
                };
            }
        } catch (error) {
            console.error(error);
            message = { type: "error", text: "Error de conexión" };
        } finally {
            loading = false;
        }
    }
</script>

<div class="perfil-page">
    <header class="profile-hero">
        <div class="hero-content">
            <h1 class="hero-title">Mi Perfil</h1>
            <p class="hero-subtitle">
                Gestiona tu información personal y revisa tu historial de
                pedidos
            </p>
        </div>
    </header>

    <div class="perfil-container">
        <!-- Sidebar -->
        <aside class="perfil-sidebar">
            <div class="perfil-user-card">
                <div class="user-avatar-large">
                    {#if user?.avatar}
                        <img src={user.avatar} alt="Avatar" />
                    {:else}
                        <User size={40} />
                    {/if}
                </div>
                <h3>{user?.nombre}</h3>
                <div
                    style="display: flex; flex-direction: column; align-items: center; gap: 5px;"
                >
                    <span class="user-role-badge">{user?.rol}</span>
                    {#if user?.tipoTrabajador}
                        <span
                            class="user-role-badge"
                            style="background: #fef3c7; color: #b45309; font-size: 0.75rem;"
                        >
                            {user.tipoTrabajador.toUpperCase()}
                        </span>
                    {/if}
                    {#if user?.ubicacionAsignada?.referencia}
                        <span
                            style="font-size: 0.8rem; color: #666; margin-top: 5px; display: flex; align-items: center; gap: 4px;"
                        >
                            <MapPin size={14} />
                            {user.ubicacionAsignada.referencia.nombre ||
                                user.ubicacionAsignada.referencia}
                        </span>
                    {/if}
                </div>
            </div>

            <nav class="perfil-nav">
                {#if user?.rol === "admin" || user?.rol === "gestor-tienda"}
                    <button
                        class="nav-item"
                        onclick={(e) => navigate(e, "/admin")}
                        style="color: #e67e22; font-weight: 600;"
                    >
                        <User size={20} /> Panel Admin
                    </button>
                {/if}

                <a
                    href="/perfil/datos"
                    class="nav-item {path === '/perfil' ||
                    path === '/perfil/datos'
                        ? 'active'
                        : ''}"
                    onclick={(e) => navigate(e, "/perfil/datos")}
                >
                    <User size={20} /> Mis Datos
                </a>

                <a
                    href="/perfil/pedidos"
                    class="nav-item {path === '/perfil/pedidos'
                        ? 'active'
                        : ''}"
                    onclick={(e) => navigate(e, "/perfil/pedidos")}
                >
                    <Package size={20} /> Mis Pedidos
                </a>

                <div class="nav-divider"></div>
                <button class="nav-item logout" onclick={handleLogout}>
                    <LogOut size={20} /> Cerrar Sesión
                </button>
            </nav>
        </aside>

        <!-- Content Area -->
        <main class="perfil-content">
            {#if path === "/perfil" || path === "/perfil/datos"}
                <div class="perfil-form-section">
                    <div class="section-header">
                        <h2>Configuración de Cuenta</h2>
                        <p>Gestiona tus datos personales y seguridad</p>
                    </div>

                    {#if message.text}
                        <div class="alert-message {message.type}">
                            {#if message.type === "error"}
                                <AlertTriangle size={20} />
                            {:else}
                                <CheckCircle size={20} />
                            {/if}
                            {message.text}
                        </div>
                    {/if}

                    <form onsubmit={handleSubmit} class="form-grid">
                        <div class="form-group">
                            <label for="nombre">Nombre Completo</label>
                            <div class="input-with-icon">
                                <User size={18} />
                                <input
                                    type="text"
                                    name="nombre"
                                    bind:value={formData.nombre}
                                    id="nombre"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="email">Correo Electrónico</label>
                            <div class="input-with-icon">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    bind:value={formData.email}
                                    id="email"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="telefono">Teléfono</label>
                            <div class="input-with-icon">
                                <Phone size={18} />
                                <input
                                    type="tel"
                                    name="telefono"
                                    bind:value={formData.telefono}
                                    placeholder="+34..."
                                    id="telefono"
                                />
                            </div>
                        </div>

                        <div class="form-divider">
                            <h3>Seguridad</h3>
                        </div>

                        <div class="form-group">
                            <label for="password"
                                >Contraseña Actual (Para cambios)</label
                            >
                            <div class="input-with-icon">
                                <Key size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    bind:value={formData.password}
                                    placeholder="••••••••"
                                    id="password"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="newPassword">Nueva Contraseña</label>
                            <div class="input-with-icon">
                                <Shield size={18} />
                                <input
                                    type="password"
                                    name="newPassword"
                                    bind:value={formData.newPassword}
                                    placeholder="Nueva contraseña"
                                    id="newPassword"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="confirmNewPassword"
                                >Confirmar Nueva Contraseña</label
                            >
                            <div class="input-with-icon">
                                <Shield size={18} />
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    bind:value={formData.confirmNewPassword}
                                    placeholder="Repite la nueva contraseña"
                                    id="confirmNewPassword"
                                />
                            </div>
                        </div>

                        <div class="form-actions">
                            <button
                                type="submit"
                                class="btn-save"
                                disabled={loading}
                            >
                                {#if loading}
                                    Guardando...
                                {:else}
                                    <Save size={20} /> Guardar Cambios
                                {/if}
                            </button>
                        </div>
                    </form>
                </div>
            {:else if path === "/perfil/pedidos"}
                <div>
                    <h2>Mis Pedidos</h2>
                    <p>
                        Aquí se mostrará el historial de pedidos próximamente.
                    </p>
                </div>
            {/if}
        </main>
    </div>
</div>
