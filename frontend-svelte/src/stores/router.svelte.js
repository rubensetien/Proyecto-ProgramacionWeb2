export const routerState = $state({
    currentPath: window.location.pathname,

    init() {
        window.addEventListener('popstate', () => {
            this.currentPath = window.location.pathname;
        });
    },

    navigate(path) {
        if (this.currentPath === path) return;
        window.history.pushState({}, '', path);
        this.currentPath = path;
    }
});
