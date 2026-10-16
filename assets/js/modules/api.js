const API_BASE_URL = 'http://localhost:8000/api';

// Track if a token refresh is already in progress to prevent race conditions
let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Queue failed requests while a token refresh is in progress.
 * Once the new token is available, replay all queued requests.
 */
function subscribeTokenRefresh(callback) {
    refreshSubscribers.push(callback);
}

function onTokenRefreshed(newToken) {
    refreshSubscribers.forEach(cb => cb(newToken));
    refreshSubscribers = [];
}

/**
 * Attempt to refresh the JWT access token using the stored refresh token.
 * Returns the new access token on success, or null on failure.
 */
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            // If backend rotates refresh tokens, store the new one
            if (data.refresh) {
                localStorage.setItem('refresh_token', data.refresh);
            }
            return data.access;
        }
    } catch (err) {
        console.warn('Token refresh failed:', err);
    }

    return null;
}

/**
 * Global fetch wrapper that automatically handles:
 * - JWT Bearer token injection
 * - JSON content-type headers
 * - 401 → automatic token refresh → retry
 * - Demo fallback when backend is offline
 */
export async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('access_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        
        // Handle 401 Unauthorized — attempt token refresh before giving up
        if (response.status === 401 && endpoint !== '/auth/token/' && endpoint !== '/auth/token/refresh/') {
            
            if (!isRefreshing) {
                isRefreshing = true;
                const newToken = await refreshAccessToken();
                isRefreshing = false;

                if (newToken) {
                    onTokenRefreshed(newToken);
                    // Retry the original request with the new token
                    config.headers['Authorization'] = `Bearer ${newToken}`;
                    const retryResponse = await fetch(url, config);
                    const isJson = retryResponse.headers.get('content-type')?.includes('application/json');
                    const data = isJson ? await retryResponse.json() : await retryResponse.text();
                    return { ok: retryResponse.ok, status: retryResponse.status, data };
                } else {
                    // Refresh failed — clear auth state and redirect to login
                    clearAuthState();
                    return { error: 'Session expired. Please log in again.', status: 401 };
                }
            } else {
                // Another request is already refreshing — wait for it
                return new Promise(resolve => {
                    subscribeTokenRefresh(async (newToken) => {
                        config.headers['Authorization'] = `Bearer ${newToken}`;
                        const retryResponse = await fetch(url, config);
                        const isJson = retryResponse.headers.get('content-type')?.includes('application/json');
                        const data = isJson ? await retryResponse.json() : await retryResponse.text();
                        resolve({ ok: retryResponse.ok, status: retryResponse.status, data });
                    });
                });
            }
        }

        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await response.json() : await response.text();

        return {
            ok: response.ok,
            status: response.status,
            data
        };
    } catch (error) {
        console.warn('API Fetch Error (Backend might be down), attempting demo fallback:', error);
        
        // ================================================================
        // MOCK FALLBACK — Used for frontend-only demo when backend is down.
        // These mocks will be removed when full integration happens.
        // ================================================================

        if (endpoint === '/auth/token/') {
            let requestedRole = 'alumni';
            try {
                if (options.body) {
                    const payload = JSON.parse(options.body);
                    if (payload.email.includes('mentor')) requestedRole = 'mentor';
                    else if (payload.email.includes('coordinator')) requestedRole = 'coordinator';
                    else if (payload.email.includes('admin')) requestedRole = 'admin';
                }
            } catch(e) { /* ignore parse errors for demo */ }
            localStorage.setItem('demo_mock_role', requestedRole);
            return { ok: true, data: { access: 'mock_demo_jwt_token', refresh: 'mock_demo_refresh' } };
        }

        if (endpoint === '/users/me/') {
            const demoRole = localStorage.getItem('demo_mock_role') || 'alumni';
            return { 
                ok: true, 
                data: { 
                    role: demoRole, 
                    email: `demo@${demoRole}.com`, 
                    first_name: 'Demo',
                    last_name: demoRole.charAt(0).toUpperCase() + demoRole.slice(1),
                    status: 'approved'
                } 
            };
        }

        if (endpoint === '/users/') {
            return { ok: true, data: { id: 999, message: 'Mock Registration Success' } };
        }

        if (endpoint === '/users/change_password/') {
            return { ok: true, data: { detail: 'Password changed successfully (demo).' } };
        }

        return { ok: false, error: 'Backend Offline — Demo Fallback Not Configured for this Endpoint' };
    }
}

/**
 * Handle user login and JWT storage.
 */
export async function login(email, password) {
    const response = await apiFetch('/auth/token/', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    if (response.ok && response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        return await fetchUserInfo();
    }
    
    return response;
}

/**
 * Fetch and store the current user's profile information.
 */
export async function fetchUserInfo() {
    const response = await apiFetch('/users/me/');
    if (response.ok) {
        localStorage.setItem('user_info', JSON.stringify(response.data));
    }
    return response;
}

/**
 * Register a new user.
 */
export async function register(userData) {
    const body = {
        ...userData,
        role: userData.role || 'alumni'
    };
    
    const response = await apiFetch('/users/', {
        method: 'POST',
        body: JSON.stringify(body)
    });
    
    return response;
}

/**
 * Change the authenticated user's password.
 */
export async function changePassword(oldPassword, newPassword) {
    return await apiFetch('/users/change_password/', {
        method: 'POST',
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
    });
}

/**
 * Clear all authentication state and redirect to login.
 */
function clearAuthState() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('demo_mock_role');
    window.location.href = '/pages/auth/login.html';
}

/**
 * Log the user out — clears storage and redirects to homepage.
 */
export function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('demo_mock_role');
    window.location.href = '/index.html';
}

/**
 * Utility to get the cached user from localStorage.
 */
export function getCurrentUser() {
    const userStr = localStorage.getItem('user_info');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
}
