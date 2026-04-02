class FinanceController {
    constructor() {
        this.records = this.loadRecords();
        this.currentPeriod = 'total';
        this.selectedPeriod = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.updateHistory();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('financeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Transaction type change
        document.getElementById('transactionType').addEventListener('change', (e) => {
            this.handleTransactionTypeChange(e.target.value);
        });

        // Period filter buttons
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handlePeriodFilter(e.target.dataset.period);
            });
        });

        // Period selector
        document.getElementById('periodSelect').addEventListener('change', (e) => {
            this.selectedPeriod = e.target.value;
            this.updateHistory();
        });

        // Real-time calculations for revenue
        document.getElementById('revenue')?.addEventListener('input', () => {
            this.calculateRealTime();
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    handleTransactionTypeChange(type) {
        // Hide all fields first
        document.getElementById('revenueFields').style.display = 'none';
        document.getElementById('expenseFields').style.display = 'none';
        document.getElementById('commonFields').style.display = 'none';
        
        // Clear previous values
        this.clearFormFields();
        
        if (type === 'revenue') {
            document.getElementById('revenueFields').style.display = 'block';
            document.getElementById('commonFields').style.display = 'block';
            this.populateRevenueCategories();
        } else if (type === 'expense') {
            document.getElementById('expenseFields').style.display = 'block';
            document.getElementById('commonFields').style.display = 'block';
            this.populateExpenseCategories();
        }
    }

    clearFormFields() {
        document.getElementById('revenue').value = '';
        document.getElementById('expenseAmount').value = '';
        document.getElementById('description').value = '';
        document.getElementById('revenueCategory').value = '';
        document.getElementById('expenseCategory').value = '';
    }

    populateRevenueCategories() {
        // Categories are now hardcoded in HTML
    }

    populateExpenseCategories() {
        // Categories are now hardcoded in HTML
    }

    handleFormSubmit() {
        const formData = this.getFormData();
        
        if (!this.validateForm(formData)) {
            return;
        }

        const calculations = this.performCalculations(formData);
        const record = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type: formData.type,
            category: formData.category,
            ...formData,
            ...calculations
        };

        this.saveRecord(record);
        this.updateHistory();
        this.resetForm();
        this.showSuccessMessage();
    }

    getFormData() {
        const transactionType = document.getElementById('transactionType').value;
        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value || '';
        
        if (transactionType === 'revenue') {
            return {
                type: 'revenue',
                revenue: parseFloat(document.getElementById('revenue').value) || 0,
                metaAds: 0,
                googleAds: 0,
                otherExpenses: 0,
                accountantPercent: 30, // 30% fixed
                date,
                description,
                category: document.getElementById('revenueCategory').value || ''
            };
        } else if (transactionType === 'expense') {
            const expenseAmount = parseFloat(document.getElementById('expenseAmount').value) || 0;
            const expenseCategory = document.getElementById('expenseCategory').value;
            
            return {
                type: 'expense',
                revenue: 0,
                metaAds: expenseCategory === 'meta' ? expenseAmount : 0,
                googleAds: expenseCategory === 'google' ? expenseAmount : 0,
                otherExpenses: expenseCategory === 'outros' ? expenseAmount : 0,
                accountantPercent: 30,
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
            const totalExpenses = data.metaAds + data.googleAds + data.otherExpenses;
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

    performCalculations(data) {
        if (data.type === 'expense') {
            // For expenses, just calculate total
            const totalExpenses = data.metaAds + data.googleAds + data.otherExpenses;
            return {
                totalExpenses,
                netValue: -totalExpenses,
                accountantPayment: 0,
                partnerPayment: 0,
                ownerProfit: -totalExpenses,
                profitLoss: -totalExpenses
            };
        }
        
        // For revenue, the division is:
        // Laranja gets 30% of gross revenue
        // Socio gets 35% of what's left after Laranja
        // Owner gets 65% of what's left after Laranja
        // Expenses are 100% owner's responsibility
        
        const accountantPayment = data.revenue * 0.30; // 30% of gross revenue
        const remainingAfterAccountant = data.revenue - accountantPayment;
        const partnerPayment = remainingAfterAccountant * 0.35; // 35% of remaining
        const ownerProfit = remainingAfterAccountant * 0.65; // 65% of remaining
        
        // For accounting purposes, we still track expenses
        const periodExpenses = this.getExpensesForDate(data.date);
        const totalExpenses = periodExpenses;
        const netValue = data.revenue - totalExpenses;
        
        // Profit/loss is revenue minus all expenses
        const profitLoss = netValue;

        return {
            totalExpenses,
            netValue,
            accountantPayment,
            partnerPayment,
            ownerProfit,
            profitLoss
        };
    }

    getExpensesForDate(date) {
        // Get all expenses up to and including the given date
        return this.records
            .filter(record => record.type === 'expense' && record.date <= date)
            .reduce((total, record) => total + (record.metaAds + record.googleAds + record.otherExpenses), 0);
    }

    calculateRealTime() {
        // Real-time calculations removed for simplicity
        // Results are now shown directly in the history
    }

    
    getProfitClass(value) {
        if (value > 0) return 'profit';
        if (value < 0) return 'loss';
        return 'neutral';
    }

    handlePeriodFilter(period) {
        this.currentPeriod = period;
        
        // Update button states
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === period);
        });

        // Show/hide period selector
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

    getFilteredRecords() {
        if (this.currentPeriod === 'total') {
            return this.records;
        }

        if (!this.selectedPeriod) {
            return [];
        }

        return this.records.filter(record => {
            const recordDate = new Date(record.date);
            
            if (this.currentPeriod === 'monthly') {
                const [year, month] = this.selectedPeriod.split('-');
                return recordDate.getFullYear() === parseInt(year) && 
                       recordDate.getMonth() + 1 === parseInt(month);
            } else if (this.currentPeriod === 'weekly') {
                // Simplified week filtering
                const recordWeek = this.getWeekNumber(recordDate);
                const selectedWeek = this.getWeekNumber(new Date(this.selectedPeriod.replace('W', '-01')));
                return recordWeek === selectedWeek;
            }
            
            return false;
        });
    }

    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    updateHistory() {
        const filteredRecords = this.getFilteredRecords();
        
        this.updatePeriodSummary(filteredRecords);
        this.updateFinancialSummary(filteredRecords);
        this.displayHistoryItems(filteredRecords);
    }

    updateFinancialSummary(records) {
        const revenues = records.filter(r => r.type === 'revenue');
        const expenses = records.filter(r => r.type === 'expense');
        
        const totalRevenue = revenues.reduce((sum, r) => sum + r.revenue, 0);
        const totalExpenses = expenses.reduce((sum, r) => sum + (r.metaAds + r.googleAds + r.otherExpenses), 0);
        
        // Correct division: 30% Laranja, then 35/65 split of remaining
        const accountantPayment = totalRevenue * 0.30;
        const remainingAfterAccountant = totalRevenue - accountantPayment;
        const partnerPayment = remainingAfterAccountant * 0.35;
        const yourProfit = remainingAfterAccountant * 0.65;
        
        // Update UI
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

        const totals = records.reduce((acc, record) => {
            acc.totalRevenue += record.revenue || 0;
            acc.totalExpenses += (record.metaAds || 0) + (record.googleAds || 0) + (record.otherExpenses || 0);
            acc.profitLoss += record.profitLoss || 0;
            return acc;
        }, { totalRevenue: 0, totalExpenses: 0, profitLoss: 0 });

        const daysCount = this.getUniqueDaysCount(records);
        const dailyAverage = daysCount > 0 ? totals.profitLoss / daysCount : 0;

        // Update the financial summary (which is now part of period summary)
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

        // Sort by date (newest first)
        const sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

        historyItems.innerHTML = sortedRecords.map(record => {
            const typeIcon = record.type === 'revenue' ? '💰' : '💸';
            const typeLabel = record.type === 'revenue' ? 'Entrada' : 'Gasto';
            const categoryLabel = record.category ? ` | ${record.category}` : '';
            
            return `
            <div class="history-item">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h6 class="mb-1 history-date">
                            ${typeIcon} ${typeLabel} - ${new Date(record.date).toLocaleDateString('pt-BR')}
                            ${record.description ? ` | ${record.description}` : ''}
                            ${categoryLabel}
                        </h6>
                        <div class="text-muted small history-description">
                            ${record.type === 'revenue' 
                                ? `Receita: ${this.formatCurrency(record.revenue)}` 
                                : `Gasto: ${this.formatCurrency(record.metaAds + record.googleAds + record.otherExpenses)} (${record.category === 'meta' ? 'Meta Ads' : record.category === 'google' ? 'Google Ads' : 'Outros Gastos'})`
                            }
                        </div>
                    </div>
                    <div class="col-md-3 text-end">
                        <div class="fw-bold ${this.getProfitClass(record.profitLoss)}">
                            ${this.formatCurrency(record.profitLoss)}
                        </div>
                        ${record.type === 'revenue' 
                            ? `<div class="small text-muted">Seu lucro: ${this.formatCurrency(record.ownerProfit)}</div>`
                            : ''
                        }
                    </div>
                    <div class="col-md-1 text-end">
                        <button class="btn btn-sm btn-outline-danger" onclick="financeController.deleteRecord(${record.id})" title="Apagar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        }).join('');
    }

    saveRecord(record) {
        this.records.push(record);
        this.saveRecords();
    }

    loadRecords() {
        const stored = localStorage.getItem('financeRecords');
        return stored ? JSON.parse(stored) : [];
    }

    saveRecords() {
        localStorage.setItem('financeRecords', JSON.stringify(this.records));
    }

    resetForm() {
        document.getElementById('financeForm').reset();
        this.setDefaultDate();
        
        // Hide all dynamic fields
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

    deleteRecord(recordId) {
        if (confirm('Tem certeza que deseja apagar esta movimentação?')) {
            this.records = this.records.filter(record => record.id !== recordId);
            this.saveRecords();
            this.updateHistory();
            this.showSuccessMessage('Movimentação apagada com sucesso!');
        }
    }

    showSuccessMessage(message = 'Movimentação registrada com sucesso!') {
        // Create a simple success notification
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        alert.style.zIndex = '9999';
        alert.innerHTML = `
            <i class="bi bi-check-circle"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    showError(message) {
        // Create a simple error notification
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        alert.style.zIndex = '9999';
        alert.innerHTML = `
            <i class="bi bi-exclamation-triangle"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.financeController = new FinanceController();
});
