# Controle Financeiro - Cabeçotes

Uma aplicação web interativa para controle financeiro de negócios, desenvolvida com HTML, CSS e JavaScript puro.

## ✨ Novidades

### 🚀 **Sistema Reprojetado**
- **Separação Clara**: Entradas vs Gastos
- **Gastos**: Meta Ads, Google Ads e outros gastos (todos os dias)
- **Entradas Ocasionais**: KL e Pagamento Adiantado
- **Pagamentos Automáticos**: Laranja 🍊 (30%) e Sócio 👨 (35%) só quando há receita

## Funcionalidades

### 📊 **Tipos de Movimentação**

#### 💰 **Entrada (Receita)**
- **KL**: Receitas principais do negócio
- **Pagamento Adiantado**: Adiantamentos de clientes
- **Cálculo Automático**:
  - Todas as despesas acumuladas até a data
  - Pagamento da Laranja 🍊 (30% sobre a receita)
  - Pagamento ao Sócio 👨 (35% do valor restante)
  - Seu lucro final

#### 💸 **Gasto**
- **Meta Ads**: Gastos com Facebook/Instagram
- **Google Ads**: Gastos com Google
- **Outros Gastos**: Despesas variáveis do dia a dia
- **Registro Simplificado**: Um campo de valor + categoria
- **100% seus**: Gastos não divididos com ninguém

### 🎯 **Lógica de Pagamentos**
```
Quando há RECEITA:
├── Laranja 🍊 = 30% da receita bruta
├── Restante = Receita - 30% do Laranja
├── Sócio 👨 = 35% do RESTANTE
└── Eu = 65% do RESTANTE

Exemplo prático:
Receita de R$ 990:
├── Laranja 🍊: R$ 297 (30% de R$ 990)
├── Restante: R$ 693 (R$ 990 - R$ 297)
│   ├── Sócio 👨: R$ 242,55 (35% de R$ 693)
│   └── Eu: R$ 450,45 (65% de R$ 693)
└── Gastos: 100% meus
```

### 📅 **Filtros de Período**
- **Total**: Visualização completa de todos os registros
- **Mensal**: Filtragem por mês específico
- **Semanal**: Filtragem por semana específica

### 💾 **Resumo Financeiro**
- **Total Receitas**: Soma de todas as entradas
- **Total Gastos**: Soma de todos os gastos diários
- **Saldo Líquido**: Receitas - Gastos
- **Laranja 🍊**: 30% sobre a receita bruta
- **Sócio 👨**: 35% sobre o valor restante (após Laranja)
- **Seu Lucro Final**: 65% sobre o valor restante (após Laranja)

### 💾 **Armazenamento**
- Dados salvos localmente no navegador
- Histórico completo de movimentações
- Resumos por período selecionado

### 🎨 **Interface Intuitiva**
- Design moderno e responsivo
- Formulário dinâmico e prático
- Feedback visual para lucro/prejuízo
- Notificações de sucesso/erro

## Como Usar

1. **Gastos**: Todos os dias registre um valor e selecione a categoria (Meta Ads, Google Ads ou Outros)
2. **Entradas**: Quando receber (KL ou adiantado), registre a receita
3. **Cálculos Automáticos**: Sistema calcula pagamentos e lucros automaticamente
4. **Acompanhamento**: Use filtros para analisar períodos específicos

## 📋 Categorias Disponíveis

### Entradas:
- **KL**: Receita principal do negócio
- **Pagamento Adiantado**: Adiantamentos de clientes

### Gastos:
- **Meta Ads**: Gastos com Facebook/Instagram
- **Google Ads**: Gastos com Google
- **Outros Gastos**: Outras despesas não categorizadas

## 🔄 Fluxo de Trabalho Diário

### Manhã/Dia:
1. Registrar gasto do dia (valor + categoria)
2. Sistema acumula todos os gastos

### Quando Receber:
1. Registrar entrada (KL ou adiantado)
2. Sistema calcula automaticamente:
   - Laranja 🍊: 30% da receita bruta
   - Restante: Receita - pagamento do Laranja
   - Sócio 👨: 35% do restante
   - Você: 65% do restante
   - Gastos: 100% seus

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização com Bootstrap 5 e CSS customizado
- **JavaScript ES6+**: Lógica da aplicação
- **LocalStorage**: Armazenamento de dados
- **Bootstrap Icons**: Ícones da interface

## Características Técnicas

- **Responsivo**: Funciona em desktop e mobile
- **Offline**: Funciona sem conexão com a internet
- **Seguro**: Dados armazenados localmente
- **Performance**: Carregamento rápido e eficiente
- **Data Automática**: Reconhecimento automático da data atual

## Instalação Local

1. Clone ou baixe os arquivos do projeto
2. Abra a pasta no servidor local:
   ```bash
   # Usando Python
   python -m http.server 3000
   
   # Ou usando Node.js
   npx serve .
   ```
3. Acesse `http://localhost:3000` no navegador

## 🎯 Exemplo Prático

### Semana Típica:
- **Segunda**: Gasto R$ 50 (Meta Ads)
- **Terça**: Gasto R$ 80 (Google Ads)
- **Quarta**: Gasto R$ 45 (Outros)
- **Quinta**: **Receita KL** de R$ 990
  - **Laranja 🍊**: R$ 297 (30% de R$ 990)
  - **Restante**: R$ 693 (R$ 990 - R$ 297)
  - **Sócio 👨**: R$ 242,55 (35% de R$ 693)
  - **Você**: R$ 450,45 (65% de R$ 693)
  - **Total Gastos**: R$ 175 (100% seus)
  - **Seu saldo final**: R$ 275,45 (R$ 450,45 - R$ 175)

## Personalização

O sistema pode ser facilmente personalizado:
- Alterar percentuais no arquivo `script.js`
- Modificar categorias no HTML
- Ajustar campos de formulário
- Adicionar novos tipos de movimentação

## Suporte

Para dúvidas ou sugestões, verifique a documentação ou entre em contato.
