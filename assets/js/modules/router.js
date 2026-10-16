export class Router {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.routes = {};
        
        // Listen to hash changes for standalone routing
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    addRoute(path, renderFunction, postRenderHook = null) {
        this.routes[path] = { renderFunction, postRenderHook };
    }

    async navigate(path) {
        window.location.hash = path;
        // The hashchange event will trigger handleRoute
    }

    async handleRoute() {
        let path = window.location.hash.substring(1);
        if (!path || path === '') path = 'overview';
        
        const route = this.routes[path] || this.routes['overview'];
        
        if (this.container) {
            this.container.style.opacity = '0';
            this.container.style.transform = 'translateY(10px)';
            
            setTimeout(async () => {
                try {
                    // This supports both synchronous rendering and async module views
                    const html = await route.renderFunction();
                    this.safeRender(html);
                } catch (error) {
                    console.error("View rendering error:", error);
                    this.safeRender("<div class='error-msg'>Failed to load view.</div>");
                }
                
                this.container.style.transition = 'all 0.35s ease';
                this.container.style.opacity = '1';
                this.container.style.transform = 'translateY(0)';
                
                if (route.postRenderHook) route.postRenderHook();
            }, 100);
        }
    }

    safeRender(htmlString) {
        // Here we could implement generic DOM nodes parsing to avoid innerHTML completely.
        // For backwards compatibility with the existing templates, we use innerHTML 
        // but note that interpolating user data within those views should heavily use escapeHTML().
        this.container.innerHTML = htmlString;
    }
}
