# 🚀 PASSO A PASSO - Supabase + Netlify

## 1️⃣ Criar Supabase (5 minutos)
```
1. Acesse: https://supabase.com
2. Crie conta (email/GitHub)
3. "New Project" → Nome: `financeiro-cabecotes`
4. Espere 2 minutos
5. "SQL Editor" → Cole o código do README-SUPABASE.md
6. "RUN"
```

## 2️⃣ Configurar Chaves (2 minutos)
```
1. "Project Settings" → "API"
2. Copie URL e chave pública
3. Abra `supabase-config.js`
4. Substitua SUA_URL_AQUI e SUA_CHAVE_ANONIMA_AQUI
```

## 3️⃣ Atualizar HTML (1 minuto)
```
1. Abra `index.html`
2. Substitua:
   <script src="script.js"></script>
   POR:
   <script src="supabase-config.js"></script>
   <script src="script-supabase.js"></script>
```

## 4️⃣ Testar Local (2 minutos)
```
1. Abra `login.html`
2. Login: Bagalau7 / Qwe84225054
3. Adicione uma movimentação
4. Verifique no Supabase se apareceu
```

## 5️⃣ Subir para Netlify (5 minutos)
```
1. Crie pasta: `financeiro-cabecotes`
2. Copie todos os arquivos para ela
3. Crie repositório GitHub com esse nome
4. Acesse: https://netlify.com
5. "Continue with GitHub"
6. "Add new site" → Selecione repositório
7. "Create site"
```

## 6️⃣ Configurar URL Final (2 minutos)
```
1. Copie URL do Netlify (ex: nome-legal.netlify.app)
2. No Supabase: "Authentication" → "Settings"
3. Cole a URL em "Site URL"
4. Salve
```

## ✅ RESULTADO FINAL
- Site online: `https://seu-site.netlify.app`
- Acessível de qualquer dispositivo
- Dados sincronizados na nuvem
- Login seguro para cada usuário

## 🎯 TESTE FINAL
1. Acesse seu site Netlify
2. Faça login
3. Adicione movimentação
4. Abra em outro dispositivo/celular
5. Faça login mesmo usuário
6. Dados devem estar sincronizados!

🏆 PARABÉNS! Seu sistema está na nuvem!
