export class HttpClient {
    private static baseUrl = 'http://localhost:3000/api';

    static async get(endpoint: string) {
        const response = await fetch(`${this.baseUrl}${endpoint}`);
        return this.handleResponse(response);
    }

    static async post(endpoint: string, data: any) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return this.handleResponse(response);
    }

    static async put(endpoint: string, data: any) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return this.handleResponse(response);
    }

    static async delete(endpoint: string) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE'
        });
        return this.handleResponse(response);
    }

    private static async handleResponse(response: Response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(error.message || `HTTP Error ${response.status}`);
        }
        // Return null for 204 No Content, otherwise json
        if (response.status === 204) return null;
        return response.json();
    }
}
