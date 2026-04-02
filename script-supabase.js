// VERSÃO COM SUPABASE - Substitua o script.js original por este arquivo

class FinanceController {
    constructor() {
        this.records = [];
        this.currentPeriod = 'total';
        this.selectedPeriod = null;
        this.userId = sessionStorage.getItem('username') || 'guest';
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setDefaultDate();
        await this.loadRecords();
        this.updateHistory();
    }

    setupEventListeners() {
        document.getElementById('financeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        document.getElementById('transactionType').addEventListener('change', (e) => {
            this.handleTransactionTypeChange(e.target.value);
        });

        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handlePeriodFilter(e.target.dataset.period);
            });
        });

        document.getElementById('periodSelect').addEventListener('change', (e) => {
            this.selectedPeriod = e.target.value;
            this.updateHistory();
        });

        document.getElementById('revenue')?.addEventListener('input', () => {
            this.calculateRealTime();
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    handleTransactionTypeChange(type) {
        document.getElementById('revenueFields').style.display = 'none';
        document.getElementById('expenseFields').style.display = 'none';
        document.getElementById('commonFields').style.display = 'none';
        
        this.clearFormFields();
        
        if (type === 'revenue') {
            document.getElementById('revenueFields').style.display = 'block';
            document.getElementById('commonFields').style.display = 'block';
        } else if (type === 'expense') {
            document.getElementById('expenseFields').style.display = 'block';
            document.getElementById('commonFields').style.display = 'block';
        }
    }

    clearFormFields() {
        document.getElementById('revenue').value = '';
        document.getElementById('expenseAmount').value = '';
        document.getElementById('description').value = '';
        document.getElementById('revenueCategory').value = '';
        document.getElementById('expenseCategory').value = '';
    }

    async handleFormSubmit() {
        const formData = this.getFormData();
        
        if (!this.validateForm(formData)) {
            return;
        }

        try {
            await this.saveRecord(formData);
            this.updateHistory();
            this.resetForm();
            this.showSuccessMessage();
        } catch (error) {
            this.showError('Erro ao salvar registro. Tente novamente.');
        }
    }

    getFormData() {
        const transactionType = document.getElementById('transactionType').value;
        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value || '';
        
        if (transactionType === 'revenue') {
            return {
                user_id: this.userId,
                type: 'revenue',
                revenue: parseFloat(document.getElementById('revenue').value) || 0,
                meta_ads: 0,
                google_ads: 0,
                other_expenses: 0,
                accountant_percent: 30,
                date,
                description,
                category: document.getElementById('revenueCategory').value || ''
            };
        } else if (transactionType === 'expense') {
            const expenseAmount = parseFloat(document.getElementById('expenseAmount').value) || 0;
            const expenseCategory = document.getElementById('expenseCategory').value;
            
            return {
                user_id: this.userId,
                type: 'expense',
                revenue: 0,
                meta_ads: expenseCategory === 'meta' ? expenseAmount : 0,
                google_ads: expenseCategory === 'google' ? expenseAmount : 0,
                other_expenses: expenseCategory === 'outros' ? expenseAmount : 0,
                accountant_percent: 30,
                date,
                description,
                category: expenseCategory || ''
            };
        }
        
        return null;
    }

    validateForm(data) {
        if (!data) {
            this.showError('Selecione o tipo de movimentação.');
            return false;
        }
        
        if (data.type === 'revenue') {
            if (data.revenue <= 0) {
                this.showError('O valor da receita deve ser maior que zero.');
                return false;
            }
            if (!data.category) {
                this.showError('Selecione a categoria da entrada.');
                return false;
            }
        }
        
        if (data.type === 'expense') {
            const totalExpenses = data.meta_ads + data.google_ads + data.other_expenses;
            if (totalExpenses <= 0) {
                this.showError('O valor do gasto deve ser maior que zero.');
                return false;
            }
            if (!data.category) {
                this.showError('Selecione a categoria do gasto.');
                return false;
            }
        }
        
        if (!data.date) {
            this.showError('A data é obrigatória.');
            return false;
        }
        
        return true;
    }

    calculateRealTime() {
        // Real-time calculations removed for simplicity
    }

    getProfitClass(value) {
        if (value > 0) return 'profit';
        if (value < 0) return 'loss';
        return 'neutral';
    }

    handlePeriodFilter(period) {
        this.currentPeriod = period;
        
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === period);
        });

        const periodSelector = document.getElementById('periodSelector');
        const periodSelect = document.getElementById('periodSelect');
        
        if (period === 'total') {
            periodSelector.style.display = 'none';
            this.selectedPeriod = null;
        } else {
            periodSelector.style.display = 'block';
            this.populatePeriodSelect(period);
            if (periodSelect.options.length > 1) {
                this.selectedPeriod = periodSelect.options[1].value;
                periodSelect.value = this.selectedPeriod;
            }
        }

        this.updateHistory();
    }

    populatePeriodSelect(periodType) {
        const select = document.getElementById('periodSelect');
        select.innerHTML = '<option value="">Selecione...</option>';

        const periods = this.getPeriods(periodType);
        periods.forEach(period => {
            const option = document.createElement('option');
            option.value = period.value;
            option.textContent = period.label;
            select.appendChild(option);
        });
    }

    getPeriods(type) {
        const periods = [];
        const now = new Date();

        if (type === 'monthly') {
            for (let i = 0; i < 12; i++) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                periods.push({ value, label });
            }
        } else if (type === 'weekly') {
            for (let i = 0; i < 12; i++) {
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - (now.getDay() + 7 * i));
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                
                const value = `${weekStart.getFullYear()}-W${Math.ceil((weekStart.getDate() + new Date(weekStart.getFullYear(), weekStart.getMonth(), 1).getDay()) / 7)}`;
                const label = `${weekStart.toLocaleDateString('pt-BR')} - ${weekEnd.toLocaleDateString('pt-BR')}`;
                periods.push({ value, label });
            }
        }

        return periods;
    }

    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    async updateHistory() {
        const filteredRecords = this.getFilteredRecords();
        this.updatePeriodSummary(filteredRecords);
        this.updateFinancialSummary(filteredRecords);
        this.displayHistoryItems(filteredRecords);
    }

    updateFinancialSummary(records) {
        const revenues = records.filter(r => r.type === 'revenue');
        const expenses = records.filter(r => r.type === 'expense');
        
        const totalRevenue = revenues.reduce((sum, r) => sum + parseFloat(r.revenue || 0), 0);
        const totalExpenses = expenses.reduce((sum, r) => sum + (parseFloat(r.meta_ads || 0) + parseFloat(r.google_ads || 0) + parseFloat(r.other_expenses || 0)), 0);
        
        const accountantPayment = totalRevenue * 0.30;
        const remainingAfterAccountant = totalRevenue - accountantPayment;
        const partnerPayment = remainingAfterAccountant * 0.35;
        const yourProfit = remainingAfterAccountant * 0.65;
        
        document.getElementById('totalRevenueSummary').textContent = this.formatCurrency(totalRevenue);
        document.getElementById('totalExpensesSummary').textContent = this.formatCurrency(totalExpenses);
        document.getElementById('accountantToPay').textContent = this.formatCurrency(accountantPayment);
        document.getElementById('partnerToPay').textContent = this.formatCurrency(partnerPayment);
        
        const yourProfitElement = document.getElementById('yourProfit');
        yourProfitElement.textContent = this.formatCurrency(yourProfit);
        yourProfitElement.className = 'metric-value ' + this.getProfitClass(yourProfit);
    }

    updatePeriodSummary(records) {
        const summaryDiv = document.getElementById('periodSummary');
        
        if (records.length === 0) {
            summaryDiv.style.display = 'none';
            return;
        }

        summaryDiv.style.display = 'block';
        this.updateFinancialSummary(records);
    }

    getUniqueDaysCount(records) {
        const uniqueDates = new Set(records.map(record => record.date));
        return uniqueDates.size;
    }

    displayHistoryItems(records) {
        const historyItems = document.getElementById('historyItems');
        
        if (records.length === 0) {
            historyItems.innerHTML = '<p class="text-muted">Nenhuma movimentação encontrada para este período.</p>';
            return;
        }

        const sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

        historyItems.innerHTML = sortedRecords.map(record => {
            const typeIcon = record.type === 'revenue' ? '💰' : '💸';
            const typeLabel = record.type === 'revenue' ? 'Entrada' : 'Gasto';
            const categoryLabel = record.category ? ` | ${record.category}` : '';
            
            const totalExp = parseFloat(record.meta_ads || 0) + parseFloat(record.google_ads || 0) + parseFloat(record.other_expenses || 0);
            const revenue = parseFloat(record.revenue || 0);
            const accountantPayment = revenue * 0.30;
            const remaining = revenue - accountantPayment;
            const ownerProfit = remaining * 0.65;
            const profitLoss = record.type === 'revenue' ? revenue : -totalExp;
            
            return `
            <div class="history-item">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h6 class="mb-1 history-date">
                            ${typeIcon} ${typeLabel} - ${new Date(record.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                            ${record.description ? ` | ${record.description}` : ''}
                            ${categoryLabel}
                        </h6>
                        <div class="text-muted small history-description">
                            ${record.type === 'revenue' 
                                ? `Receita: ${this.formatCurrency(revenue)}` 
                                : `Gasto: ${this.formatCurrency(totalExp)} (${record.category === 'meta' ? 'Meta Ads' : record.category === 'google' ? 'Google Ads' : 'Outros Gastos'})`
                            }
                        </div>
                    </div>
                    <div class="col-md-3 text-end">
                        <div class="fw-bold ${this.getProfitClass(profitLoss)}">
                            ${this.formatCurrency(profitLoss)}
                        </div>
                        ${record.type === 'revenue' 
                            ? `<div class="small text-muted">Seu lucro: ${this.formatCurrency(ownerProfit)}</div>`
                            : ''
                        }
                    </div>
                    <div class="col-md-1 text-end">
                        <button class="btn btn-sm btn-outline-danger" onclick="window.financeController.deleteRecord(${record.id})" title="Apagar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        }).join('');
    }

    async saveRecord(formData) {
        // Envia apenas os campos que o banco aceita (sem campos calculados)
        const cleanRecord = {
            user_id: formData.user_id,
            type: formData.type,
            revenue: formData.revenue || 0,
            meta_ads: formData.meta_ads || 0,
            google_ads: formData.google_ads || 0,
            other_expenses: formData.other_expenses || 0,
            accountant_percent: formData.accountant_percent || 30,
            date: formData.date,
            description: formData.description || '',
            category: formData.category || ''
        };

        try {
            const result = await window.supabaseManager.insertRecord(cleanRecord);
            const savedId = Array.isArray(result) && result[0] ? result[0].id : Date.now();
            this.records.unshift({ ...cleanRecord, id: savedId });
        } catch (error) {
            console.error('Erro ao salvar:', error);
            throw error;
        }
    }

    async loadRecords() {
        try {
            this.records = await window.supabaseManager.getRecords(this.userId);
        } catch (error) {
            console.error('Erro ao carregar:', error);
            this.records = [];
        }
    }

    async deleteRecord(recordId) {
        if (confirm('Tem certeza que deseja apagar esta movimentação?')) {
            try {
                await window.supabaseManager.deleteRecord(recordId);
                this.records = this.records.filter(record => record.id !== recordId);
                this.updateHistory();
                this.showSuccessMessage('Movimentação apagada com sucesso!');
            } catch (error) {
                console.error('Erro ao deletar:', error);
                this.showError('Erro ao apagar movimentação. Tente novamente.');
            }
        }
    }

    resetForm() {
        document.getElementById('financeForm').reset();
        this.setDefaultDate();
        document.getElementById('revenueFields').style.display = 'none';
        document.getElementById('expenseFields').style.display = 'none';
        document.getElementById('commonFields').style.display = 'none';
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    showSuccessMessage(message = 'Movimentação registrada com sucesso!') {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        alert.style.zIndex = '9999';
        alert.innerHTML = `
            <i class="bi bi-check-circle"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }

    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        alert.style.zIndex = '9999';
        alert.innerHTML = `
            <i class="bi bi-exclamation-triangle"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 5000);
    }

    getFilteredRecords() {
        if (this.currentPeriod === 'total') {
            return this.records;
        }

        if (!this.selectedPeriod) {
            return [];
        }

        return this.records.filter(record => {
            const recordDate = new Date(record.date + 'T12:00:00');
            
            if (this.currentPeriod === 'monthly') {
                const [year, month] = this.selectedPeriod.split('-');
                return recordDate.getFullYear() === parseInt(year) && 
                       recordDate.getMonth() + 1 === parseInt(month);
            } else if (this.currentPeriod === 'weekly') {
                const recordWeek = this.getWeekNumber(recordDate);
                const selectedWeek = this.getWeekNumber(new Date(this.selectedPeriod.replace('W', '-01')));
                return recordWeek === selectedWeek;
            }
            
            return false;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.financeController = new FinanceController();
});
