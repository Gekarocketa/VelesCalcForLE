// --- Default Network Fees Data ---
const DEFAULT_NETWORK_FEES = [
    { coin: "BTC", network: "Native", binance: 0.000015, kucoin: 0.00009, bybit: 0.00015, mexc: 0.000015, huobi: 0.000016 },
    { coin: "ETH", network: "Native", binance: 0.00015, kucoin: 0.0015, bybit: 0.0003, mexc: 0.00002, huobi: 0.0002 },
    { coin: "XMR", network: "Native", binance: null, kucoin: 0.002, bybit: null, mexc: null, huobi: null },
    { coin: "USDT", network: "ERC20", binance: 0.5, kucoin: 5.5, bybit: 0.8, mexc: 0.31, huobi: 2.003767 },
    { coin: "USDT", network: "TRC20", binance: 1, kucoin: 1.5, bybit: 1, mexc: 1, huobi: 2 },
    { coin: "USDT", network: "BEP20", binance: 0.3, kucoin: 1, bybit: 0.2, mexc: 0.01, huobi: 1.5 },
    { coin: "USDT", network: "SOL", binance: 0.3, kucoin: 1.5, bybit: 0.5, mexc: 0.23, huobi: 0.8596 },
    { coin: "USDT", network: "TON", binance: null, kucoin: 0.5, bybit: 0.15, mexc: 0.023, huobi: 0.8 },
    { coin: "USDT", network: "POL/Polygon", binance: 0.07, kucoin: null, bybit: 0.1, mexc: 0.0069, huobi: 0.01 },
    { coin: "USDC", network: "BASE", binance: 0.5, kucoin: 0.5, bybit: 0.5, mexc: 0.1, huobi: 2.6 },
    { coin: "AR", network: "Native", binance: 0.00002, kucoin: 0.25, bybit: 0.03, mexc: 0.1, huobi: 0.025 },
    { coin: "LTC", network: "Native", binance: 0.0001, kucoin: 0.006, bybit: null, mexc: null, huobi: null },
    { coin: "SOL", network: "Native", binance: 0.001, kucoin: 0.008, bybit: 0.001, mexc: 0.000374, huobi: 0.003 },
    { coin: "BNB", network: "BEP20", binance: 0.00001, kucoin: 0.000953, bybit: null, mexc: 0.00001, huobi: null },
    { coin: "XLM", network: "Native", binance: 0.005, kucoin: 2.21, bybit: 0.02, mexc: 0.1, huobi: 0.02 },
    { coin: "TAO", network: "Native", binance: 0.0003, kucoin: 0.0027, bybit: null, mexc: 0.005, huobi: null },
    { coin: "TON", network: "Native", binance: 0.03, kucoin: 0.19, bybit: null, mexc: 0.01, huobi: null },
    { coin: "TRX", network: "Native", binance: 1.5, kucoin: 1, bybit: 1, mexc: 1, huobi: 1 },
    { coin: "DASH", network: "Native", binance: 0.0002, kucoin: 0.03, bybit: null, mexc: 0.002, huobi: 0.05 },
    { coin: "FIRO", network: "Native", binance: null, kucoin: null, bybit: null, mexc: 0.1, huobi: null },
    { coin: "ZANO", network: "Native", binance: null, kucoin: null, bybit: null, mexc: 0.1, huobi: null }
];

window.NETWORK_FEES = [];

const EXCHANGES = ['binance', 'kucoin', 'bybit', 'mexc', 'huobi'];

// --- Initialize and Load ---
function initFeesManager() {
    loadFeesData();
    renderFeesTable();
    attachFeesListeners();
}

function loadFeesData() {
    const saved = localStorage.getItem('calcNetworkFees');
    if (saved) {
        try {
            window.NETWORK_FEES = JSON.parse(saved);
            if (window.NETWORK_FEES.length === 0) {
                window.NETWORK_FEES = JSON.parse(JSON.stringify(DEFAULT_NETWORK_FEES));
                saveFeesData();
            }
        } catch (e) {
            console.error('Error parsing calcNetworkFees', e);
            window.NETWORK_FEES = JSON.parse(JSON.stringify(DEFAULT_NETWORK_FEES));
        }
    } else {
        window.NETWORK_FEES = JSON.parse(JSON.stringify(DEFAULT_NETWORK_FEES));
        saveFeesData();
    }
}

function saveFeesData() {
    localStorage.setItem('calcNetworkFees', JSON.stringify(window.NETWORK_FEES));
}

// --- Render ---
function renderFeesTable(filterQuery = '') {
    const tbody = document.getElementById('feesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const query = filterQuery.toLowerCase().trim();

    window.NETWORK_FEES.forEach((feeObj, index) => {
        const searchStr = `${feeObj.coin} ${feeObj.network}`.toLowerCase();
        if (query && !searchStr.includes(query)) return;

        // Since we map with a filter, `index` is the loop index which MIGHT NOT match `window.NETWORK_FEES`.
        // We need to use the actual index of the item in the original array.
        const originalIndex = window.NETWORK_FEES.indexOf(feeObj);

        const tr = document.createElement('tr');
        tr.dataset.index = originalIndex;

        // Find minimum value
        let minVal = Infinity;
        let minExchanges = [];
        EXCHANGES.forEach(ex => {
            const val = feeObj[ex];
            if (val !== null && val !== undefined && !isNaN(val)) {
                if (val < minVal) {
                    minVal = val;
                    minExchanges = [ex];
                } else if (val === minVal) {
                    minExchanges.push(ex);
                }
            }
        });

        // Coin/Network Column
        const coinNetworkStr = `${feeObj.coin} ${feeObj.network ? `(${feeObj.network})` : ''}`.trim();
        tr.innerHTML = `<td class="text-left col-coin" contenteditable="true" spellcheck="false" 
                            onblur="updateFeeValue(${originalIndex}, 'coin_network', this)">${coinNetworkStr}</td>`;

        // Fees Columns
        EXCHANGES.forEach(ex => {
            const val = feeObj[ex];
            const isMin = val !== null && val === minVal && minVal !== Infinity;
            const cellClass = `text-center col-${ex} ${isMin ? 'lowest-fee' : ''}`;
            const displayVal = (val !== null && val !== undefined && !isNaN(val)) ? val : '-';

            const btnHtml = (val !== null && val !== undefined && !isNaN(val)) ? `<button class="add-to-calc-btn" onclick="addFeeToCalc(${val})" title="Add to Calculator">+</button>` : '<div style="width:20px"></div>';

            tr.innerHTML += `
                <td class="${cellClass}">
                    <div class="fee-cell-content">
                        <span class="fee-number fee-value" contenteditable="true" spellcheck="false" 
                              onblur="updateFeeValue(${originalIndex}, '${ex}', this)">${displayVal}</span>
                        ${btnHtml}
                    </div>
                </td>
            `;
        });

        // Action Column (Delete)
        tr.innerHTML += `<td class="text-center"><button class="delete-row-btn" onclick="deleteFeeRow(${originalIndex})">&times;</button></td>`;

        tbody.appendChild(tr);
    });
}

function attachFeesListeners() {
    const searchInput = document.getElementById('feeSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderFeesTable(e.target.value);
        });
    }
}

function updateFeeValue(index, field, element) {
    const valStr = element.textContent.trim();
    const cleanVal = valStr === '-' || valStr === '' ? null : parseFloat(valStr.replace(',', '.'));

    if (field === 'coin_network') {
        const match = valStr.match(/^(.*?)\s*(?:\((.*?)\))?$/);
        if (match) {
            window.NETWORK_FEES[index].coin = match[1].trim();
            window.NETWORK_FEES[index].network = match[2] ? match[2].trim() : "";
        }
    } else {
        window.NETWORK_FEES[index][field] = isNaN(cleanVal) ? null : cleanVal;
    }

    saveFeesData();
    // Re-render to update the green highlight, preserving search
    const searchInput = document.getElementById('feeSearch');
    renderFeesTable(searchInput ? searchInput.value : '');
}

function handleFeeCellBlur() {
    // This is now handled by inline updateFeeValue for most cells
    // but we can use it for the coin/network cell specifically if needed
}

// --- Actions ---
function addFeeToCalc(value) {
    if (typeof playSound === 'function') playSound('click');

    const disp = window.display || document.getElementById('display');
    if (!disp) return;

    const text = disp.value.trim();
    if (text === '' || text === '0') {
        disp.value = value.toString();
    } else {
        // if trailing operator, don't add +, just append number
        if (/[+\-*/%Δ]$/.test(text)) {
            disp.value = text + " " + value.toString();
        } else {
            disp.value = text + " + " + value.toString();
        }
    }

    disp.focus();
    const len = disp.value.length;
    disp.setSelectionRange(len, len);

    if (typeof adjustFontSize === 'function') adjustFontSize();
}

function deleteFeeRow(index) {
    if (confirm('Are you sure you want to delete this fee row?')) {
        window.NETWORK_FEES.splice(index, 1);
        saveFeesData();
        const searchInput = document.getElementById('feeSearch');
        renderFeesTable(searchInput ? searchInput.value : '');
    }
}

function addNewFeeRow() {
    window.NETWORK_FEES.push({ coin: "NEW", network: "", binance: null, kucoin: null, bybit: null, mexc: null, huobi: null });
    saveFeesData();

    const searchInput = document.getElementById('feeSearch');
    if (searchInput) searchInput.value = ''; // clear search to show new row

    renderFeesTable();

    // Scroll to bottom
    const helpContent = document.querySelector('#help-tab-fees .help-content-scrollable');
    if (helpContent) {
        helpContent.scrollTop = helpContent.scrollHeight;
    }
}

function resetFeesToDefaults() {
    if (confirm('Are you sure you want to reset all withdrawal fees to their default values? Custom entries will be lost.')) {
        window.NETWORK_FEES = JSON.parse(JSON.stringify(DEFAULT_NETWORK_FEES));
        saveFeesData();

        const searchInput = document.getElementById('feeSearch');
        if (searchInput) searchInput.value = ''; // clear search to show defaults

        renderFeesTable();
        if (typeof playSound === 'function') playSound('ui');
    }
}

// Automatically init when script loads (or can be tied to window.onload in main.js)
window.addEventListener('DOMContentLoaded', () => {
    // Delay initialization slightly to ensure globals exist
    setTimeout(initFeesManager, 100);
});
