# 🚀 Guia Completo: Integrar com Supabase

## 📋 O que você precisa fazer:

### 1️⃣ Criar Conta no Supabase
1. Acesse: https://supabase.com
2. Clique em "Sign Up" 
3. Use email/GitHub para criar conta
4. Verifique seu email

### 2️⃣ Criar Projeto
1. Dashboard → "New Project"
2. Nome do projeto: `financeiro-cabecotes`
3. Senha do banco: Crie uma senha forte
4. Região: Escolha a mais próxima (Brasil/São Paulo)
5. Aguarde 1-2 minutos

### 3️⃣ Configurar Tabela no Supabase
1. No seu projeto, vá em "SQL Editor"
2. Copie e cole este código:

```sql
-- Criar tabela finance_records
CREATE TABLE finance_records (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
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

-- Criar política para que usuários só vejam seus próprios dados
CREATE POLICY "Users can only access their own records" ON finance_records
    FOR ALL USING (auth.uid()::text = user_id);

-- Função para atualizar timestamp
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
```

3. Clique em "RUN" para executar

### 4️⃣ Configurar Autenticação (Simplificado)
1. Vá em "Authentication" → "Settings"
2. Em "Site URL", coloque: `https://SEU-USERNAME.netlify.app`
3. Desabilite "Enable email confirmations" (para facilitar testes)

### 5️⃣ Pegar Chaves do Supabase
1. Vá em "Project Settings" → "API"
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 6️⃣ Configurar Arquivos Locais
1. Abra `supabase-config.js`
2. Substitua as linhas:

```javascript
const supabaseConfig = {
    url: 'SUA_URL_AQUI', // Cole a URL do seu projeto
    anonKey: 'SUA_CHAVE_ANONIMA_AQUI', // Cole a chave pública
    headers: {
        'apikey': 'SUA_CHAVE_ANONIMA_AQUI', // Cole a chave pública novamente
        'Content-Type': 'application/json'
    }
};
```

### 7️⃣ Atualizar HTML para usar Supabase
1. Abra `index.html`
2. Substitua a linha do script:

```html
<!-- Antes -->
<script src="script.js"></script>

<!-- Depois -->
<script src="supabase-config.js"></script>
<script src="script-supabase.js"></script>
```

### 8️⃣ Testar Localmente
1. Abra `login.html` no navegador
2. Faça login com: `Bagalau7` / `Qwe84225054`
3. Adicione algumas movimentações
4. Verifique no painel Supabase se os dados apareceram

---

## 🌐 Como Hospedar no Netlify

### 1️⃣ Preparar Arquivos
1. Crie pasta `financeiro-cabecotes`
2. Copie todos os arquivos para esta pasta:
   - `index.html`
   - `login.html`
   - `supabase-config.js`
   - `script-supabase.js`
   - `README.md` (opcional)

### 2️⃣ Subir para GitHub
1. Crie repositório: `financeiro-cabecotes`
2. Faça upload dos arquivos
3. Commit com mensagem: "Initial commit"

### 3️⃣ Conectar Netlify
1. Acesse: https://netlify.com
2. "Sign up" → "Continue with GitHub"
3. Autorize acesso ao seu GitHub
4. "Add new site" → "Import an existing project"
5. Selecione o repositório `financeiro-cabecotes`
6. Configure:
   - Build command: Deixe em branco
   - Publish directory: Deixe em branco (raiz)
7. "Create site"

### 4️⃣ Configurar Domínio
1. Após o deploy, vá em "Site settings"
2. "Domain management" → "Add custom domain"
3. Coloque seu domínio (opcional)
4. Ou use o domínio gratuito: `nome-aleatorio.netlify.app`

---

## 🔧 Configuração Final

### 1️⃣ Atualizar URL no Supabase
1. No Supabase: "Authentication" → "Settings"
2. Em "Site URL", coloque: `https://SEU-SITIO.netlify.app`
3. Salve as alterações

### 2️⃣ Testar Online
1. Acesse seu site no Netlify
2. Faça login
3. Adicione movimentações
4. Verifique se tudo funciona

---

## 📱 Acessar de Qualquer Dispositivo

### ✅ O que vai funcionar:
- **Celular**: Acesso via navegador
- **Tablet**: Acesso via navegador  
- **Computador**: Acesso via navegador
- **Dados sincronizados**: Todos os dispositivos veem os mesmos dados

### 🔄 Como funciona:
1. Todos os dados ficam no Supabase (nuvem)
2. Login identifica seu usuário
3. Cada usuário só vê seus próprios dados
4. Adicionar/editar/apagar atualiza em tempo real

---

## 🚨 Solução de Problemas

### ❌ "Erro ao salvar registro"
- Verifique se as chaves do Supabase estão corretas
- Confirme se a tabela foi criada
- Verifique o console do navegador (F12)

### ❌ "Login não funciona"
- Verifique se o Supabase URL está correto
- Confirme se a autenticação está habilitada

### ❌ "Dados não aparecem"
- Verifique se o user_id está sendo salvo corretamente
- Confirme se as políticas RLS estão configuradas

---

## 🎯 Dicas Importantes

### 💡 Backup dos Dados
- Supabase tem backup automático
- Você também pode exportar dados manualmente

### 🔐 Segurança
- Nunca compartilhe suas chaves do Supabase
- Use senhas fortes
- Mantenha o login privado

### 📈 Performance
- A configuração atual suporta milhares de registros
- Para mais dados, considere otimizar as consultas

---

## 🎉 Pronto! 

Agora seu sistema financeiro funciona na nuvem! 🌟

Você pode:
- Acessar de qualquer dispositivo
- Ter seus dados sincronizados  
- Compartilhar o link com outras pessoas (cada um com seu login)
- Usar offline (com cache do navegador)

Parabéns! 🏆💰
