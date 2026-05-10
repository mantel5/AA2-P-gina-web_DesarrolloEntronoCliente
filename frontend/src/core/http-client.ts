export class HttpClient {
    private static baseUrl = 'http://localhost:3000/api';

    // Reads the JWT stored by authStore and returns the Authorization header
    private static getAuthHeaders(): Record<string, string> {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    static async get(endpoint: string) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: { ...this.getAuthHeaders() }
        });
        return this.handleResponse(response);
    }

    static async post(endpoint: string, data: any) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
            body: JSON.stringify(data)
        });
        return this.handleResponse(response);
    }

    static async put(endpoint: string, data: any) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
            body: JSON.stringify(data)
        });
        return this.handleResponse(response);
    }

    static async delete(endpoint: string) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: { ...this.getAuthHeaders() }
        });
        return this.handleResponse(response);
    }

    private static async handleResponse(response: Response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(error.message || `HTTP Error ${response.status}`);
        }
        // Return null for 204 No Content, otherwise parse JSON
        if (response.status === 204) return null;
        return response.json();
    }
}

