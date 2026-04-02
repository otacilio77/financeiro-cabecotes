const supabaseConfig = {
    url: 'https://dvlozhmtiiygunbyhjig.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2bG96aG10aWl5Z3VuYnloamlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDk5NzIsImV4cCI6MjA5MDcyNTk3Mn0.flosG4sMZHfTre23mW1G3SFBa4jWucbmsEyKwb-vcpg',
    headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2bG96aG10aWl5Z3VuYnloamlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDk5NzIsImV4cCI6MjA5MDcyNTk3Mn0.flosG4sMZHfTre23mW1G3SFBa4jWucbmsEyKwb-vcpg',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2bG96aG10aWl5Z3VuYnloamlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDk5NzIsImV4cCI6MjA5MDcyNTk3Mn0.flosG4sMZHfTre23mW1G3SFBa4jWucbmsEyKwb-vcpg',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
};

class SupabaseManager {
    constructor() {
        this.config = supabaseConfig;
        this.baseURL = this.config.url;
        this.headers = this.config.headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/rest/v1/${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
            }
            const text = await response.text();
            return text ? JSON.parse(text) : [];
        } catch (error) {
            console.error('Erro Supabase:', error);
            throw error;
        }
    }

    async getRecords(userId) {
        return await this.request(`finance_records?user_id=eq.${userId}&order=created_at.desc`);
    }

    async insertRecord(record) {
        return await this.request('finance_records', {
            method: 'POST',
            body: JSON.stringify(record)
        });
    }

    async updateRecord(id, record) {
        return await this.request(`finance_records?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(record)
        });
    }

    async deleteRecord(id) {
        return await this.request(`finance_records?id=eq.${id}`, {
            method: 'DELETE'
        });
    }

    async getRecordsByPeriod(userId, startDate, endDate) {
        return await this.request(`finance_records?user_id=eq.${userId}&date=gte.${startDate}&date=lte.${endDate}&order=created_at.desc`);
    }
}

window.supabaseManager = new SupabaseManager();
