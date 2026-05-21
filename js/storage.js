
// Default data for the table
const defaultPartnersData = [
    { partner: 'Ellipal', floatPercent: '3%', minAmount: '60', coins: 'Все, кроме btc/eth', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'SwapZone', floatPercent: '3%', minAmount: '110', coins: '', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'Swapspace', floatPercent: '3%', minAmount: '110', coins: '', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'stealthex.io', floatPercent: '3%', minAmount: '80', coins: 'Только для TAO', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'nimiq.com', floatPercent: '5%', minAmount: '30', coins: 'Все, кроме btc/eth', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'CoinKong.netlify.app', floatPercent: '5%', minAmount: '30', coins: 'Все, кроме btc/eth', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'zypto.com', floatPercent: '5%', minAmount: '30', coins: 'Все, кроме btc/eth', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'pepecoin.org', floatPercent: '5%', minAmount: '30', coins: 'Все, включая btc/eth', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'tr.energy', floatPercent: '5%', minAmount: '30', coins: 'Все, кроме btc/eth', details: 'Возврат на исходный адрес', autoRefund: 'AML' },
    { partner: 'Handcash', floatPercent: '5%', minAmount: '30', coins: 'Все, включая btc/eth', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'step.app', floatPercent: '5%', minAmount: '30', coins: 'Все, кроме btc/eth', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'dopamine', floatPercent: '5%', minAmount: '30', coins: 'Все, кроме btc/eth', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'bag-exchange', floatPercent: '5%', minAmount: '30', coins: 'Все, кроме btc/eth', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'xrpaynet.com', floatPercent: '5%', minAmount: '30', coins: 'Все, кроме btc/eth', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'OnchainLabs Wallet', floatPercent: '5%', minAmount: '30', coins: 'Все, кроме btc/eth', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'Rotate', floatPercent: '5%', minAmount: '50', coins: 'Все, кроме btc/eth', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'Unitywallet', floatPercent: '5%', minAmount: '110', coins: '', details: 'Возврат на Refund address.', autoRefund: 'AML' },
    { partner: 'Edge', floatPercent: '5%', minAmount: '50', coins: 'Все, кроме btc/eth', details: 'Возврат на Refund address', autoRefund: 'Any "Error"' },
    { partner: 'Invity.io & Trezor', floatPercent: '5%', minAmount: '110', coins: '', details: 'Возврат на Refund address', autoRefund: 'AML' },
    { partner: 'Trustee Wallet', floatPercent: '5%', minAmount: '110', coins: '', details: 'Возврат на исходный адрес', autoRefund: 'AML' },
    { partner: 'digital shield (ds.pro)', floatPercent: '5%', minAmount: '110', coins: '', details: 'Возврат на Initial/Refund address', autoRefund: 'AML' },
    { partner: 'nightly.app', floatPercent: '5%', minAmount: '30', coins: 'Все, кроме btc/eth', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'kabila.app', floatPercent: '5%', minAmount: '30', coins: 'Все, кроме btc/eth', details: '<span class="icon-placeholder"></span>', autoRefund: 'No' },
    { partner: 'Houdini Swap', floatPercent: '5%', minAmount: '110', coins: '', details: 'главное условия по работе XMR до 350 XMR - 10 confirmations.<br>больше 350 XMR - 150 confirmations', autoRefund: 'No' },
    { partner: 'RocketX', floatPercent: '5%', minAmount: '110', coins: '', details: 'Запрашивать адрес для рефанда', autoRefund: 'No' },
    { partner: 'Cake wallet', floatPercent: '5%', minAmount: '110', coins: '', details: 'Возврат на refund-адрес.', autoRefund: 'AML' }
];

// Load and restore table data from localStorage
function loadTableData() {
    const savedData = localStorage.getItem('partnersTableData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            window.partnersTable.innerHTML = '';
            data.forEach(row => {
                const tr = createTableRow(row);
                window.partnersTable.appendChild(tr);
            });
            attachTableListeners();
        } catch (e) {
            console.error('Error loading table data:', e);
            attachTableListeners();
        }
    } else {
        // If no saved data, load from default array instead of hardcoded HTML
        window.partnersTable.innerHTML = '';
        defaultPartnersData.forEach(data => {
            const tr = createTableRow(data);
            window.partnersTable.appendChild(tr);
        });
        attachTableListeners();
    }
    
    // Re-apply search filter if any
    const searchInput = document.getElementById('partnerSearch');
    if (searchInput && searchInput.value) {
        filterPartnersTable(searchInput.value);
    }
}

// Save table data to localStorage
function saveTableData() {
    const rows = Array.from(window.partnersTable.querySelectorAll('tr'));
    const data = rows.map(row => {
        const cells = row.querySelectorAll('td');
        // Skip the delete column (7th column, index 6)
        const detailsCell = cells[4];
        let details = detailsCell.textContent.trim();
        // If details is empty or just whitespace, use icon placeholder
        if (!details || details === '') {
            details = '<span class="icon-placeholder"></span>';
        }

        return {
            partner: cells[0].textContent.trim(),
            floatPercent: cells[1].querySelector('.badge')?.textContent.trim() || '',
            minAmount: cells[2].textContent.trim(),
            coins: cells[3].textContent.trim(),
            details: details,
            autoRefund: cells[5].querySelector('.badge')?.textContent.trim() || ''
        };
    });
    localStorage.setItem('partnersTableData', JSON.stringify(data));
}

// Create a new table row
function createTableRow(data = {}) {
    const tr = document.createElement('tr');
    const floatValue = parseFloat(data.floatPercent?.replace('%', '') || '0');
    let floatBadgeClass = 'badge-float-green';
    if (floatValue > 3 && floatValue < 5) {
        floatBadgeClass = 'badge-float-orange';
    } else if (floatValue >= 5) {
        floatBadgeClass = 'badge-float-red';
    }

    // Determine AutoRefund badge class based on text
    const autoRefundText = (data.autoRefund || 'No').trim().toLowerCase();
    let autoRefundBadgeClass = 'badge-autorefund-no'; // default
    if (autoRefundText === 'no' || autoRefundText === 'not') {
        autoRefundBadgeClass = 'badge-autorefund-no';
    } else if (autoRefundText === 'aml' || autoRefundText === 'амл') {
        autoRefundBadgeClass = 'badge-autorefund-aml';
    } else {
        autoRefundBadgeClass = 'badge-autorefund-error';
    }

    const detailsContent = data.details && data.details !== '<span class="icon-placeholder"></span>'
        ? data.details
        : '<span class="icon-placeholder"></span>';

    tr.innerHTML = `
    <td class="text-left" contenteditable="true">${data.partner || ''}</td>
    <td class="text-center">
        <span class="badge ${floatBadgeClass}" contenteditable="true">${data.floatPercent || '0%'}</span>
    </td>
    <td class="text-center" contenteditable="true">${data.minAmount || ''}</td>
    <td class="text-left" contenteditable="true">${data.coins || ''}</td>
    <td class="text-center" contenteditable="true">${detailsContent}</td>
    <td class="text-center">
        <span class="badge ${autoRefundBadgeClass}" contenteditable="true">${data.autoRefund || 'No'}</span>
    </td>
    <td class="text-center"><button class="delete-row-btn" onclick="deleteTableRow(this)">×</button></td>
`;
    return tr;
}

// Delete a table row
function deleteTableRow(button) {
    const row = button.closest('tr');
    if (row && confirm('Are you sure you want to delete this row?')) {
        row.remove();
        saveTableData();
    }
}

// Add new row to table
function addTableRow() {
    const newRow = createTableRow();
    window.partnersTable.appendChild(newRow);
    attachRowListeners(newRow);
    saveTableData();
}

// Reset table to defaults
function resetTableToDefaults() {
    if (confirm('Reset table to defaults? This will erase custom changes.')) {
        window.partnersTable.innerHTML = '';
        defaultPartnersData.forEach(data => {
            const tr = createTableRow(data);
            window.partnersTable.appendChild(tr);
        });
        attachTableListeners();
        saveTableData();
    }
}

// Update badge color based on Float % value
function updateFloatBadge(badgeElement) {
    const text = badgeElement.textContent.trim();
    const value = parseFloat(text.replace('%', ''));

    if (isNaN(value)) return;

    // Remove all badge classes
    badgeElement.classList.remove('badge-float-green', 'badge-float-orange', 'badge-float-red');

    // Add appropriate class
    if (value <= 3) {
        badgeElement.classList.add('badge-float-green');
    } else if (value > 3 && value < 5) {
        badgeElement.classList.add('badge-float-orange');
    } else if (value >= 5) {
        badgeElement.classList.add('badge-float-red');
    }
}

// Update badge color based on AutoRefund text value
function updateAutoRefundBadge(badgeElement) {
    const text = badgeElement.textContent.trim().toLowerCase();

    // Remove all AutoRefund badge classes
    badgeElement.classList.remove('badge-autorefund-no', 'badge-autorefund-aml', 'badge-autorefund-error');

    // Check for "No" or "Not" variations (case-insensitive)
    if (text === 'no' || text === 'not') {
        badgeElement.classList.add('badge-autorefund-no');
    }
    // Check for "AML" in English or Russian Cyrillic (case-insensitive)
    else if (text === 'aml' || text === 'амл') {
        badgeElement.classList.add('badge-autorefund-aml');
    }
    // Any other text gets error style
    else {
        badgeElement.classList.add('badge-autorefund-error');
    }
}

// Attach listeners to a row
function attachRowListeners(row) {
    // Float % badge (2nd column)
    const floatBadge = row.querySelector('td:nth-child(2) .badge');
    if (floatBadge) {
        floatBadge.addEventListener('input', function () {
            updateFloatBadge(this);
        });
        floatBadge.addEventListener('blur', function () {
            updateFloatBadge(this);
            saveTableData();
        });
    }

    // AutoRefund badge (6th column)
    const autoRefundBadge = row.querySelector('td:nth-child(6) .badge');
    if (autoRefundBadge) {
        autoRefundBadge.addEventListener('input', function () {
            updateAutoRefundBadge(this);
        });
        autoRefundBadge.addEventListener('blur', function () {
            updateAutoRefundBadge(this);
            saveTableData();
        });
    }

    // Details cell (5th column) - smart icon placeholder handling
    const detailsCell = row.querySelector('td:nth-child(5)');
    if (detailsCell) {
        detailsCell.addEventListener('focus', function () {
            // On focus: if cell only contains icon-placeholder, clear it for clean editing
            const iconPlaceholder = this.querySelector('.icon-placeholder');
            if (iconPlaceholder) {
                // Check if the cell only has the icon placeholder (no other text)
                const textOnly = this.textContent.trim();
                if (!textOnly || textOnly === '') {
                    this.innerHTML = '';
                }
            }
        });

        detailsCell.addEventListener('blur', function () {
            // On blur: if cell is empty, restore icon-placeholder
            const text = this.textContent.trim();
            if (!text || text === '') {
                this.innerHTML = '<span class="icon-placeholder"></span>';
            }
            saveTableData();
        });
    }

    // Save on any cell edit
    const cells = row.querySelectorAll('td[contenteditable="true"]');
    cells.forEach(cell => {
        // Skip Details cell as it has its own handler
        if (cell !== detailsCell) {
            cell.addEventListener('blur', saveTableData);
        }
    });
}

// Attach listeners to all rows
function attachTableListeners() {
    const rows = window.partnersTable.querySelectorAll('tr');
    rows.forEach(row => attachRowListeners(row));
}

function exportConfig() {
    const config = {
        settings: {
            isPotatoMode: window.isPotatoMode,
            isProFeaturesEnabled: window.isProFeaturesEnabled,
            isMacButtons: window.isMacButtons,
            isAutoCopyEnabled: window.isAutoCopyEnabled,
            isBtcLocked: window.isBtcLocked,
            isSoundEnabled: window.isSoundEnabled
        },
        partnersTableData: JSON.parse(localStorage.getItem('partnersTableData') || '[]'),
        networkFees: JSON.parse(localStorage.getItem('calcNetworkFees') || '[]'),
        history: window.historyData
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator_config_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importConfig(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result.trim();

        // 1. Try JSON (Full Config)
        if (content.startsWith('{')) {
            try {
                const config = JSON.parse(content);
                if (confirm('Restore full configuration? This will overwrite current settings and data.')) {
                    // Restore Settings
                    if (config.settings) {
                        localStorage.setItem('calcPotatoMode', JSON.stringify(config.settings.isPotatoMode));
                        localStorage.setItem('calcProFeatures', JSON.stringify(config.settings.isProFeaturesEnabled));
                        localStorage.setItem('calcMacButtons', JSON.stringify(config.settings.isMacButtons));
                        localStorage.setItem('calcAutoCopy', JSON.stringify(config.settings.isAutoCopyEnabled));
                        localStorage.setItem('calcBtcLock', JSON.stringify(config.settings.isBtcLocked));
                        localStorage.setItem('calcSoundEnabled', JSON.stringify(config.settings.isSoundEnabled));
                    }
                    // Restore Data
                    if (config.partnersTableData) {
                        localStorage.setItem('partnersTableData', JSON.stringify(config.partnersTableData));
                    }
                    if (config.history) {
                        localStorage.setItem('cryptoCalcHistory', JSON.stringify(config.history));
                    }
                    if (config.networkFees) {
                        localStorage.setItem('calcNetworkFees', JSON.stringify(config.networkFees));
                    }
                    alert('Configuration restored! Reloading...');
                    location.reload();
                }
            } catch (err) {
                alert('Invalid JSON Config file.');
                console.error(err);
            }
        }
        // 2. Try Text/TSV (Partners Import)
        else {
            if (confirm('Import text as Partners List?\n\nOK: REPLACE existing table\nCancel: APPEND to existing table')) {
                // OK: Replace existing data
                processTextImport(content, true);
            } else {
                // Cancel: Append to existing data
                processTextImport(content, false);
            }
        }
    };
    reader.readAsText(file);
    input.value = ''; // Reset
}

function processTextImport(text, replace = false) {
    const lines = text.split(/\r?\n/);
    const newRows = [];
    let importCount = 0;

    lines.forEach(line => {
        if (!line.trim()) return;
        const cols = line.split('\t');
        if (cols.length < 1) return;

        // Map Columns: 
        // 0: Partner, 1: Float%, 2: Min, 3: Coins, 4: Details, 5: AutoRefund
        // Strip quotes if necessary (e.g., CSV/Excel artifacts)
        const clean = (s) => s ? s.trim().replace(/^"|"$/g, '') : '';

        const rowData = {
            partner: clean(cols[0]),
            floatPercent: clean(cols[1]), // Logic will auto-color this later
            minAmount: clean(cols[2]),
            coins: clean(cols[3]),
            details: clean(cols[4]),
            autoRefund: clean(cols[5]) // Logic will auto-color this later
        };
        newRows.push(rowData);
        importCount++;
    });

    if (importCount === 0) {
        alert('No valid data found.');
        return;
    }

    // Update DataModel
    let finalData = [];
    if (replace) {
        finalData = newRows;
    } else {
        const currentData = JSON.parse(localStorage.getItem('partnersTableData') || '[]');
        finalData = [...currentData, ...newRows];
    }

    localStorage.setItem('partnersTableData', JSON.stringify(finalData));
    localStorage.setItem('partnersTableData', JSON.stringify(finalData));
    loadTableData(); // Re-renders the table with new data and attaches listeners.
    // createTableRow automatically handles parsing string percentages for badge styling.

    alert(`Imported ${importCount} partners.`);
}

// Table Sorting Logic
let currentSortColumn = null;
let currentSortDirection = 1;

function sortPartnersTable(column) {
    saveTableData();
    let data = JSON.parse(localStorage.getItem('partnersTableData') || '[]');

    if (currentSortColumn === column) {
        currentSortDirection *= -1;
    } else {
        currentSortColumn = column;
        currentSortDirection = 1;
    }

    data.sort((a, b) => {
        let valA, valB;
        if (column === 'floatPercent') {
            valA = parseFloat((a.floatPercent || '0').replace('%', '')) || 0;
            valB = parseFloat((b.floatPercent || '0').replace('%', '')) || 0;
        } else if (column === 'autoRefund') {
            valA = (a.autoRefund || '').toLowerCase();
            valB = (b.autoRefund || '').toLowerCase();
        }

        if (valA < valB) return -1 * currentSortDirection;
        if (valA > valB) return 1 * currentSortDirection;
        return 0;
    });

    localStorage.setItem('partnersTableData', JSON.stringify(data));
    loadTableData();
    updateSortIcons();
    if (typeof playSound === 'function') playSound('ui');
}

function updateSortIcons() {
    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.textContent = '↕';
        icon.classList.remove('active');
    });

    if (currentSortColumn) {
        const icon = document.getElementById(`sortIcon-${currentSortColumn}`);
        if (icon) {
            icon.textContent = currentSortDirection === 1 ? '↓' : '↑';
            icon.classList.add('active');
        }
    }
}

// Search / Filter Logic
function filterPartnersTable(query) {
    query = query.toLowerCase();
    const rows = window.partnersTable.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            const partnerName = cells[0].textContent.toLowerCase();
            const coinsInfo = cells[3].textContent.toLowerCase();
            const detailsInfo = cells[4].textContent.toLowerCase();
            
            if (partnerName.includes(query) || coinsInfo.includes(query) || detailsInfo.includes(query)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}
