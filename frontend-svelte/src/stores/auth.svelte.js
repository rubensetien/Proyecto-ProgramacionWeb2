const isBrowser = typeof window !== 'undefined';

export const authState = $state({
    user: null,
    token: null,
    isAuthenticated: false,

    init() {
        if (!isBrowser) return;
        const storedToken = localStorage.getItem('jwt');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                this.token = storedToken;
                this.user = JSON.parse(storedUser);
                this.isAuthenticated = true;
            } catch (error) {
                this.logout();
            }
        }
    },

    login(token, user) {
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
        if (isBrowser) {
            localStorage.setItem('jwt', token);
            localStorage.setItem('user', JSON.stringify(user));
        }
    },

    logout() {
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        if (isBrowser) {
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');
        }
    }
});
