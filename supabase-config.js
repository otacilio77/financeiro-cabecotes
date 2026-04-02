// CONFIGURAÇÃO DO SUPABASE
// Este arquivo contém todas as configurações para integrar com Supabase

// 1. Crie sua conta no Supabase: https://supabase.com
// 2. Crie um novo projeto
// 3. Copie as chaves abaixo

const supabaseConfig = {
    url: 'https://dvlozhmtiiygunbyhjg.supabase.co', // URL do seu projeto Supabase
    anonKey: 'sb_publishable_4tuVlcJKTuiOBlbuJERB8w_hkymckoW', // Chave pública do projeto
    headers: {
        'apikey': 'sb_publishable_4tuVlcJKTuiOBlbuJERB8w_hkymckoW',
        'Content-Type': 'application/json'
    }
};

// TABELA QUE PRECISAMOS CRIAR NO SUPABASE:
/*
-- Crie esta tabela no painel SQL do Supabase:

CREATE TABLE finance_records (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'revenue' ou 'expense'
    revenue DECIMAL(10,2) DEFAULT 0,
    meta_ads DECIMAL(10,2) DEFAULT 0,
    google_ads DECIMAL(10,2) DEFAULT 0,
    other_expenses DECIMAL(10,2) DEFAULT 0,
    accountant_percent DECIMAL(5,2) DEFAULT 30,
    date DATE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    total_expenses DECIMAL(10,2) GENERATED ALWAYS AS (meta_ads + google_ads + other_expenses) STORED,
    net_value DECIMAL(10,2) GENERATED ALWAYS AS (revenue - (meta_ads + google_ads + other_expenses)) STORED,
    accountant_payment DECIMAL(10,2) GENERATED ALWAYS AS (revenue * 0.30) STORED,
    partner_payment DECIMAL(10,2) GENERATED ALWAYS AS ((revenue - (revenue * 0.30)) * 0.35) STORED,
    owner_profit DECIMAL(10,2) GENERATED ALWAYS AS ((revenue - (revenue * 0.30)) * 0.65) STORED,
    profit_loss DECIMAL(10,2) GENERATED ALWAYS AS (revenue - (meta_ads + google_ads + other_expenses)) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índice para performance
CREATE INDEX idx_user_date ON finance_records(user_id, date DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE finance_records ENABLE ROW LEVEL SECURITY;

-- Política para que usuários só vejam seus próprios dados
CREATE POLICY "Users can only access their own records" ON finance_records
    FOR ALL USING (auth.uid()::text = user_id);

-- Inserir função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_finance_records_updated_at 
    BEFORE UPDATE ON finance_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
*/

// Classe para gerenciar o Supabase
class SupabaseManager {
    constructor() {
        this.config = supabaseConfig;
        this.baseURL = this.config.url;
        this.headers = this.config.headers;
    }

    // Método genérico para fazer requisições
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/rest/v1/${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro Supabase:', error);
            throw error;
        }
    }

    // Buscar todos os registros do usuário
    async getRecords(userId) {
        return await this.request(`finance_records?user_id=eq.${userId}&order=created_at.desc`);
    }

    // Inserir novo registro
    async insertRecord(record) {
        return await this.request('finance_records', {
            method: 'POST',
            body: JSON.stringify(record)
        });
    }

    // Atualizar registro
    async updateRecord(id, record) {
        return await this.request(`finance_records?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(record)
        });
    }

    // Deletar registro
    async deleteRecord(id) {
        return await this.request(`finance_records?id=eq.${id}`, {
            method: 'DELETE'
        });
    }

    // Buscar registros por período
    async getRecordsByPeriod(userId, startDate, endDate) {
        return await this.request(`finance_records?user_id=eq.${userId}&date=gte.${startDate}&date=lte.${endDate}&order=created_at.desc`);
    }
}

// Exportar para uso global
window.supabaseManager = new SupabaseManager();
