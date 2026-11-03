/* ===================================================================
   BILLY APP — CONTROLLER LOGIC
   Clean, Minimalistic, ColorOS 7 Inspired Invoicing & WhatsApp Engine
   =================================================================== */

(function () {
  'use strict';

  // -----------------------------------------------------------------
  // 1. DEFAULT DATA & STORAGE KEYS
  // -----------------------------------------------------------------
  const STORAGE_KEYS = {
    SETTINGS: 'billy_store_settings',
    INVOICES: 'billy_invoices_history',
    THEME: 'billy_theme_mode',
    LAST_INV_NUM: 'billy_last_inv_number'
  };

  const DEFAULT_SETTINGS = {
    name: 'Shree Krishna Cafe & Bakers',
    tagline: 'Fresh Bakery, Cakes & Pure Veg Cafe',
    phone: '+91 9515072693',
    address: 'Main Road, Patancheru, Hyderabad, Telangana',
    gstin: '36AAACM1234F1Z5',
    currency: '₹',
    upiId: 'shreekrishnacafe@upi',
    defaultNotes: 'Thank you for visiting Shree Krishna Cafe & Bakers! Have a delicious day.'
  };

  // State
  let storeSettings = Object.assign({}, DEFAULT_SETTINGS);
  let invoicesHistory = [];
  let currentInvoiceItems = [];
  let nextItemId = 1;

  // -----------------------------------------------------------------
  // 2. DOM ELEMENT REFERENCES
  // -----------------------------------------------------------------
  // Header
  const navStoreName = document.getElementById('navStoreName');
  const headerStatText = document.getElementById('headerStatText');
  const historyCountBadge = document.getElementById('historyCount');
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const btnSettings = document.getElementById('btnSettings');
  const btnHistory = document.getElementById('btnHistory');
  const btnNewInvoice = document.getElementById('btnNewInvoice');

  // Customer Form
  const invNumberInput = document.getElementById('invNumber');
  const custNameInput = document.getElementById('custName');
  const custPhoneInput = document.getElementById('custPhone');
  const custEmailInput = document.getElementById('custEmail');
  const custAddressInput = document.getElementById('custAddress');
  const invDateInput = document.getElementById('invDate');
  const invDueDateInput = document.getElementById('invDueDate');
  const toggleMoreCustDetailsBtn = document.getElementById('toggleMoreCustDetails');
  const toggleCustDetailsIcon = document.getElementById('toggleCustDetailsIcon');
  const moreCustFields = document.getElementById('moreCustFields');
  const paymentStatusRadios = document.querySelectorAll('input[name="paymentStatus"]');

  // Items & Calculations
  const itemsListContainer = document.getElementById('itemsList');
  const btnAddItemRow = document.getElementById('btnAddItemRow');
  const discountValInput = document.getElementById('discountVal');
  const discountTypeSelect = document.getElementById('discountType');
  const taxValInput = document.getElementById('taxVal');
  const taxTypeSelect = document.getElementById('taxType');
  const amountPaidInput = document.getElementById('amountPaid');
  const amountPaidRow = document.getElementById('amountPaidRow');
  const balanceDueDisplay = document.getElementById('balanceDueDisplay');
  const invNotesInput = document.getElementById('invNotes');

  const calcSubtotalElem = document.getElementById('calcSubtotal');
  const calcDiscountRow = document.getElementById('calcDiscountRow');
  const calcDiscountElem = document.getElementById('calcDiscount');
  const calcTaxRow = document.getElementById('calcTaxRow');
  const calcTaxElem = document.getElementById('calcTax');
  const calcGrandTotalElem = document.getElementById('calcGrandTotal');

  // Dock Actions
  const btnResetBill = document.getElementById('btnResetBill');
  const btnFillSample = document.getElementById('btnFillSample');
  const btnSaveInvoice = document.getElementById('btnSaveInvoice');
  const btnPrintInvoice = document.getElementById('btnPrintInvoice');
  const btnDirectWhatsApp = document.getElementById('btnDirectWhatsApp');
  const btnPreviewWaShare = document.getElementById('btnPreviewWaShare');
  const btnQuickCopyText = document.getElementById('btnQuickCopyText');

  // Preview Card Elements
  const previewStoreName = document.getElementById('previewStoreName');
  const previewStoreTagline = document.getElementById('previewStoreTagline');
  const previewStoreAddress = document.getElementById('previewStoreAddress');
  const previewStorePhone = document.getElementById('previewStorePhone');
  const previewStoreGst = document.getElementById('previewStoreGst');
  const previewStoreGstWrap = document.getElementById('previewStoreGstWrap');
  const previewCustName = document.getElementById('previewCustName');
  const previewCustPhone = document.getElementById('previewCustPhone');
  const previewCustAddress = document.getElementById('previewCustAddress');
  const previewInvNum = document.getElementById('previewInvNum');
  const previewInvDate = document.getElementById('previewInvDate');
  const previewDueDateWrap = document.getElementById('previewDueDateWrap');
  const previewDueDate = document.getElementById('previewDueDate');
  const receiptStamp = document.getElementById('receiptStamp');
  const previewItemsBody = document.getElementById('previewItemsBody');
  const previewSubtotal = document.getElementById('previewSubtotal');
  const previewDiscountRow = document.getElementById('previewDiscountRow');
  const previewDiscountLabel = document.getElementById('previewDiscountLabel');
  const previewDiscount = document.getElementById('previewDiscount');
  const previewTaxRow = document.getElementById('previewTaxRow');
  const previewTaxLabel = document.getElementById('previewTaxLabel');
  const previewTax = document.getElementById('previewTax');
  const previewGrandTotal = document.getElementById('previewGrandTotal');
  const previewPaidRow = document.getElementById('previewPaidRow');
  const previewPaid = document.getElementById('previewPaid');
  const previewDueRow = document.getElementById('previewDueRow');
  const previewDue = document.getElementById('previewDue');
  const previewNoteMsg = document.getElementById('previewNoteMsg');
  const previewBarcodeNum = document.getElementById('previewBarcodeNum');
  const receiptQrWrap = document.getElementById('receiptQrWrap');
  const receiptQrImage = document.getElementById('receiptQrImage');
  const receiptUpiId = document.getElementById('receiptUpiId');

  // Modals
  // WhatsApp Modal
  const modalWhatsApp = document.getElementById('modalWhatsApp');
  const btnCloseWaModal = document.getElementById('btnCloseWaModal');
  const waModalCustName = document.getElementById('waModalCustName');
  const waModalCustPhone = document.getElementById('waModalCustPhone');
  const waMessageText = document.getElementById('waMessageText');
  const waCustomNoteInput = document.getElementById('waCustomNote');
  const btnCopyWaText = document.getElementById('btnCopyWaText');
  const btnExecuteWhatsAppSend = document.getElementById('btnExecuteWhatsAppSend');

  // Settings Modal
  const modalSettings = document.getElementById('modalSettings');
  const btnCloseSettingsModal = document.getElementById('btnCloseSettingsModal');
  const btnCancelSettings = document.getElementById('btnCancelSettings');
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  const setStoreNameInput = document.getElementById('setStoreName');
  const setStoreTaglineInput = document.getElementById('setStoreTagline');
  const setStorePhoneInput = document.getElementById('setStorePhone');
  const setStoreGstInput = document.getElementById('setStoreGst');
  const setStoreAddressInput = document.getElementById('setStoreAddress');
  const setCurrencySelect = document.getElementById('setCurrency');
  const setUpiIdInput = document.getElementById('setUpiId');
  const setDefaultNotesInput = document.getElementById('setDefaultNotes');

  // History Modal
  const modalHistory = document.getElementById('modalHistory');
  const btnCloseHistoryModal = document.getElementById('btnCloseHistoryModal');
  const btnCloseHistory = document.getElementById('btnCloseHistory');
  const historySearchInput = document.getElementById('historySearchInput');
  const historyTableBody = document.getElementById('historyTableBody');
  const emptyHistoryState = document.getElementById('emptyHistoryState');
  const metricTotalBills = document.getElementById('metricTotalBills');
  const metricTotalRevenue = document.getElementById('metricTotalRevenue');
  const metricTotalPending = document.getElementById('metricTotalPending');
  const btnExportCsv = document.getElementById('btnExportCsv');
  const btnClearHistory = document.getElementById('btnClearHistory');

  // Toast
  const cosToast = document.getElementById('cosToast');
  const toastMessage = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');
  let toastTimer = null;

  // -----------------------------------------------------------------
  // 3. INITIALIZATION
  // -----------------------------------------------------------------
  function init() {
    loadSettings();
    loadHistory();
    loadTheme();
    setTodayDate();
    setupEventListeners();
    generateNextInvoiceNumber();

    // Start with 1 default blank row
    addItemRow('', 1, '');
    updateCalculationsAndPreview();
    updateHistoryStats();
  }

  // -----------------------------------------------------------------
  // 4. STORAGE & SETTINGS MANAGEMENT
  // -----------------------------------------------------------------
  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Mamtha Creations') {
          parsed.name = 'Shree Krishna Cafe & Bakers';
          parsed.tagline = 'Fresh Bakery, Cakes & Pure Veg Cafe';
          parsed.defaultNotes = 'Thank you for visiting Shree Krishna Cafe & Bakers! Have a delicious day.';
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
        }
        storeSettings = Object.assign({}, DEFAULT_SETTINGS, parsed);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
    applyStoreSettingsToUI();
  }

  function applyStoreSettingsToUI() {
    navStoreName.textContent = storeSettings.name || 'Quick Billing';
    previewStoreName.textContent = storeSettings.name;
    previewStoreTagline.textContent = storeSettings.tagline;
    previewStoreAddress.textContent = storeSettings.address;
    previewStorePhone.textContent = storeSettings.phone;

    if (storeSettings.gstin && storeSettings.gstin.trim() !== '') {
      previewStoreGstWrap.style.display = 'inline-flex';
      previewStoreGst.textContent = storeSettings.gstin;
    } else {
      previewStoreGstWrap.style.display = 'none';
    }

    if (storeSettings.upiId && storeSettings.upiId.trim() !== '') {
      receiptQrWrap.style.display = 'flex';
      receiptUpiId.textContent = storeSettings.upiId;
    } else {
      receiptQrWrap.style.display = 'none';
    }

    // Default note
    if (!invNotesInput.value || invNotesInput.value === DEFAULT_SETTINGS.defaultNotes) {
      invNotesInput.value = storeSettings.defaultNotes;
    }

    // Populate Settings modal inputs
    setStoreNameInput.value = storeSettings.name;
    setStoreTaglineInput.value = storeSettings.tagline;
    setStorePhoneInput.value = storeSettings.phone;
    setStoreGstInput.value = storeSettings.gstin || '';
    setStoreAddressInput.value = storeSettings.address;
    setCurrencySelect.value = storeSettings.currency || '₹';
    setUpiIdInput.value = storeSettings.upiId || '';
    setDefaultNotesInput.value = storeSettings.defaultNotes;

    updateCalculationsAndPreview();
  }

  function saveSettingsFromUI() {
    storeSettings.name = setStoreNameInput.value.trim() || DEFAULT_SETTINGS.name;
    storeSettings.tagline = setStoreTaglineInput.value.trim();
    storeSettings.phone = setStorePhoneInput.value.trim();
    storeSettings.gstin = setStoreGstInput.value.trim();
    storeSettings.address = setStoreAddressInput.value.trim();
    storeSettings.currency = setCurrencySelect.value;
    storeSettings.upiId = setUpiIdInput.value.trim();
    storeSettings.defaultNotes = setDefaultNotesInput.value.trim();

    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
    applyStoreSettingsToUI();
    closeModal(modalSettings);
    showToast('Store settings saved successfully!');
  }

  function loadHistory() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (saved) {
        invoicesHistory = JSON.parse(saved);
      }
    } catch (e) {
      invoicesHistory = [];
    }
  }

  function saveHistory() {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoicesHistory));
    updateHistoryStats();
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
  }

  function toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      themeIcon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
      showToast('Switched to ColorOS 7 Light Mode');
    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      themeIcon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
      showToast('Switched to ColorOS 7 Dark Mode');
    }
  }

  function setTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    invDateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  function generateNextInvoiceNumber() {
    let nextNum = 1;
    if (invoicesHistory.length > 0) {
      // Find highest number in history
      const nums = invoicesHistory.map(inv => {
        const match = (inv.invNumber || '').match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      });
      nextNum = Math.max(...nums, 0) + 1;
    } else {
      const storedLast = localStorage.getItem(STORAGE_KEYS.LAST_INV_NUM);
      if (storedLast) nextNum = parseInt(storedLast, 10) + 1;
    }
    const formatted = 'INV-' + String(nextNum).padStart(3, '0');
    invNumberInput.value = formatted;
  }

  // -----------------------------------------------------------------
  // 5. LINE ITEMS MANAGEMENT
  // -----------------------------------------------------------------
  function addItemRow(name = '', qty = 1, price = '') {
    const id = nextItemId++;
    const row = {
      id: id,
      name: name,
      qty: parseFloat(qty) || 1,
      price: price === '' ? '' : (parseFloat(price) || 0)
    };
    currentInvoiceItems.push(row);
    renderItemRowDOM(row);
  }

  function renderItemRowDOM(item) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'item-row';
    rowDiv.dataset.id = item.id;

    const curr = storeSettings.currency || '₹';
    const totalVal = (item.price === '' ? 0 : item.qty * item.price);

    rowDiv.innerHTML = `
      <div class="col-item-desc">
        <input type="text" class="item-name-input" placeholder="Item name / service" value="${escapeHtml(item.name)}">
      </div>
      <div class="col-item-qty">
        <input type="number" class="item-qty-input" placeholder="1" min="0.01" step="any" value="${item.qty}">
      </div>
      <div class="col-item-price">
        <input type="number" class="item-price-input" placeholder="0.00" min="0" step="any" value="${item.price}">
      </div>
      <div class="col-item-total row-total-val">
        ${curr}${totalVal.toFixed(2)}
      </div>
      <div class="col-item-action">
        <button type="button" class="btn-remove-row" title="Remove row">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    `;

    // Event listeners
    const nameInput = rowDiv.querySelector('.item-name-input');
    const qtyInput = rowDiv.querySelector('.item-qty-input');
    const priceInput = rowDiv.querySelector('.item-price-input');
    const removeBtn = rowDiv.querySelector('.btn-remove-row');
    const totalElem = rowDiv.querySelector('.row-total-val');

    function onRowChange() {
      item.name = nameInput.value;
      item.qty = parseFloat(qtyInput.value) || 0;
      item.price = priceInput.value === '' ? '' : (parseFloat(priceInput.value) || 0);
      const rowTot = item.price === '' ? 0 : item.qty * item.price;
      totalElem.textContent = `${storeSettings.currency || '₹'}${rowTot.toFixed(2)}`;
      updateCalculationsAndPreview();
    }

    nameInput.addEventListener('input', onRowChange);
    qtyInput.addEventListener('input', onRowChange);
    priceInput.addEventListener('input', onRowChange);

    // Keyboard shortcut: Press enter on price to add new row
    priceInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addItemRow('', 1, '');
        // focus new row's name
        setTimeout(() => {
          const allNames = itemsListContainer.querySelectorAll('.item-name-input');
          if (allNames.length > 0) {
            allNames[allNames.length - 1].focus();
          }
        }, 50);
      }
    });

    removeBtn.addEventListener('click', function () {
      if (currentInvoiceItems.length <= 1) {
        // Just clear the row
        item.name = '';
        item.qty = 1;
        item.price = '';
        nameInput.value = '';
        qtyInput.value = 1;
        priceInput.value = '';
        totalElem.textContent = `${storeSettings.currency || '₹'}0.00`;
        updateCalculationsAndPreview();
        return;
      }
      currentInvoiceItems = currentInvoiceItems.filter(i => i.id !== item.id);
      rowDiv.remove();
      updateCalculationsAndPreview();
    });

    itemsListContainer.appendChild(rowDiv);
  }

  function clearAllItems() {
    itemsListContainer.innerHTML = '';
    currentInvoiceItems = [];
    nextItemId = 1;
    addItemRow('', 1, '');
  }

  // -----------------------------------------------------------------
  // 6. CALCULATIONS & LIVE PREVIEW RENDERER
  // -----------------------------------------------------------------
  function getSelectedPaymentStatus() {
    let status = 'PAID';
    paymentStatusRadios.forEach(radio => {
      if (radio.checked) status = radio.value;
    });
    return status;
  }

  function calculateTotals() {
    let subtotal = 0;
    currentInvoiceItems.forEach(item => {
      const p = item.price === '' ? 0 : parseFloat(item.price) || 0;
      const q = parseFloat(item.qty) || 0;
      subtotal += (q * p);
    });

    // Discount
    const discVal = parseFloat(discountValInput.value) || 0;
    const discType = discountTypeSelect.value;
    let discountAmount = 0;
    if (discVal > 0) {
      if (discType === 'PERCENT') {
        discountAmount = (subtotal * discVal) / 100;
      } else {
        discountAmount = discVal;
      }
    }
    discountAmount = Math.min(subtotal, Math.max(0, discountAmount));

    // Tax
    const taxableBase = Math.max(0, subtotal - discountAmount);
    const taxVal = parseFloat(taxValInput.value) || 0;
    const taxType = taxTypeSelect.value;
    let taxAmount = 0;
    if (taxVal > 0) {
      if (taxType === 'PERCENT') {
        taxAmount = (taxableBase * taxVal) / 100;
      } else {
        taxAmount = taxVal;
      }
    }

    // Grand total
    const grandTotal = Math.max(0, taxableBase + taxAmount);

    // Paid / Due
    const status = getSelectedPaymentStatus();
    let amountPaid = grandTotal;

    if (status === 'UNPAID') {
      amountPaid = 0;
    } else if (status === 'PARTIAL') {
      amountPaid = parseFloat(amountPaidInput.value) || 0;
      if (amountPaid > grandTotal) amountPaid = grandTotal;
    } else {
      amountPaid = grandTotal;
    }

    const balanceDue = Math.max(0, grandTotal - amountPaid);

    return {
      subtotal,
      discountAmount,
      discVal,
      discType,
      taxAmount,
      taxVal,
      taxType,
      grandTotal,
      amountPaid,
      balanceDue,
      status
    };
  }

  function updateCalculationsAndPreview() {
    const curr = storeSettings.currency || '₹';
    const totals = calculateTotals();

    // Editor Totals update
    calcSubtotalElem.textContent = `${curr}${totals.subtotal.toFixed(2)}`;

    if (totals.discountAmount > 0) {
      calcDiscountRow.style.display = 'flex';
      calcDiscountElem.textContent = `- ${curr}${totals.discountAmount.toFixed(2)}`;
    } else {
      calcDiscountRow.style.display = 'none';
    }

    if (totals.taxAmount > 0) {
      calcTaxRow.style.display = 'flex';
      calcTaxElem.textContent = `+ ${curr}${totals.taxAmount.toFixed(2)}`;
    } else {
      calcTaxRow.style.display = 'none';
    }

    calcGrandTotalElem.textContent = `${curr}${totals.grandTotal.toFixed(2)}`;

    // Partial payment input show/hide
    if (totals.status === 'PARTIAL') {
      amountPaidRow.style.display = 'grid';
      balanceDueDisplay.textContent = `${curr}${totals.balanceDue.toFixed(2)}`;
    } else {
      amountPaidRow.style.display = 'none';
    }

    // ----------------- PREVIEW CARD UPDATE -----------------
    // Customer
    const cName = custNameInput.value.trim();
    previewCustName.textContent = cName || 'Walk-in Customer';

    const cPhone = custPhoneInput.value.trim();
    previewCustPhone.textContent = cPhone ? `+91 ${cPhone}` : '+91 ----------';

    const cAddress = custAddressInput.value.trim();
    if (cAddress) {
      previewCustAddress.style.display = 'block';
      previewCustAddress.textContent = cAddress;
    } else {
      previewCustAddress.style.display = 'none';
    }

    // Invoice Meta
    const invNum = invNumberInput.value.trim() || 'INV-001';
    previewInvNum.textContent = invNum;
    previewBarcodeNum.textContent = `BILLY-${invNum}`;

    const dateVal = invDateInput.value;
    previewInvDate.textContent = formatDateNice(dateVal);

    const dueDateVal = invDueDateInput.value;
    if (dueDateVal) {
      previewDueDateWrap.style.display = 'block';
      previewDueDate.textContent = formatDateNice(dueDateVal);
    } else {
      previewDueDateWrap.style.display = 'none';
    }

    // Status Stamp
    receiptStamp.className = 'receipt-stamp-badge';
    if (totals.status === 'PAID') {
      receiptStamp.classList.add('stamp-paid');
      receiptStamp.innerHTML = '<span><i class="fa-solid fa-check"></i> PAID</span>';
    } else if (totals.status === 'PARTIAL') {
      receiptStamp.classList.add('stamp-partial');
      receiptStamp.innerHTML = '<span>PARTIAL</span>';
    } else {
      receiptStamp.classList.add('stamp-unpaid');
      receiptStamp.innerHTML = '<span>PENDING</span>';
    }

    // Items list in preview
    previewItemsBody.innerHTML = '';
    let validItemCount = 0;

    currentInvoiceItems.forEach(item => {
      const name = item.name.trim();
      const p = item.price === '' ? 0 : parseFloat(item.price) || 0;
      const q = parseFloat(item.qty) || 0;
      if (name || p > 0) {
        validItemCount++;
        const rowTot = q * p;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="td-item"><strong>${escapeHtml(name || 'Custom Item')}</strong></td>
          <td class="td-qty">${q}</td>
          <td class="td-price">${curr}${p.toFixed(2)}</td>
          <td class="td-amount">${curr}${rowTot.toFixed(2)}</td>
        `;
        previewItemsBody.appendChild(tr);
      }
    });

    if (validItemCount === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="4" style="text-align: center; color: #8E96A4; padding: 16px;">
          No items added yet. Add items on the left panel.
        </td>
      `;
      previewItemsBody.appendChild(tr);
    }

    // Totals in preview
    previewSubtotal.textContent = `${curr}${totals.subtotal.toFixed(2)}`;

    if (totals.discountAmount > 0) {
      previewDiscountRow.style.display = 'flex';
      previewDiscountLabel.textContent = `Discount ${totals.discType === 'PERCENT' ? `(${totals.discVal}%)` : ''}`;
      previewDiscount.textContent = `- ${curr}${totals.discountAmount.toFixed(2)}`;
    } else {
      previewDiscountRow.style.display = 'none';
    }

    if (totals.taxAmount > 0) {
      previewTaxRow.style.display = 'flex';
      previewTaxLabel.textContent = `Tax / GST ${totals.taxType === 'PERCENT' ? `(${totals.taxVal}%)` : ''}`;
      previewTax.textContent = `+ ${curr}${totals.taxAmount.toFixed(2)}`;
    } else {
      previewTaxRow.style.display = 'none';
    }

    previewGrandTotal.textContent = `${curr}${totals.grandTotal.toFixed(2)}`;

    if (totals.status === 'PARTIAL') {
      previewPaidRow.style.display = 'flex';
      previewPaid.textContent = `${curr}${totals.amountPaid.toFixed(2)}`;
      previewDueRow.style.display = 'flex';
      previewDue.textContent = `${curr}${totals.balanceDue.toFixed(2)}`;
    } else if (totals.status === 'UNPAID') {
      previewPaidRow.style.display = 'none';
      previewDueRow.style.display = 'flex';
      previewDue.textContent = `${curr}${totals.grandTotal.toFixed(2)}`;
    } else {
      previewPaidRow.style.display = 'none';
      previewDueRow.style.display = 'none';
    }

    // Notes
    previewNoteMsg.textContent = invNotesInput.value.trim() || storeSettings.defaultNotes;

    // QR Code Update
    updateQrCode(totals.grandTotal);
  }

  function updateQrCode(totalAmount) {
    if (!storeSettings.upiId || storeSettings.upiId.trim() === '') {
      receiptQrWrap.style.display = 'none';
      return;
    }
    receiptQrWrap.style.display = 'flex';
    const upiStr = `upi://pay?pa=${encodeURIComponent(storeSettings.upiId)}&pn=${encodeURIComponent(storeSettings.name)}&am=${totalAmount.toFixed(2)}&cu=INR`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiStr)}&margin=1`;
    receiptQrImage.src = qrUrl;
  }

  // -----------------------------------------------------------------
  // 7. COLOROS 7 WHATSAPP DIRECT DISPATCH ENGINE
  // -----------------------------------------------------------------
  function buildWhatsAppMessageText(customNote = '') {
    const curr = storeSettings.currency || '₹';
    const totals = calculateTotals();
    const invNum = invNumberInput.value.trim() || 'INV-001';
    const cName = custNameInput.value.trim() || 'Valued Customer';
    const dateStr = formatDateNice(invDateInput.value);

    // Format items
    let itemsText = '';
    let counter = 1;
    currentInvoiceItems.forEach(item => {
      const name = item.name.trim();
      const p = item.price === '' ? 0 : parseFloat(item.price) || 0;
      const q = parseFloat(item.qty) || 0;
      if (name || p > 0) {
        itemsText += `${counter}. *${name || 'Item'}* (x${q}) - ${curr}${(q * p).toFixed(2)}\n`;
        counter++;
      }
    });

    if (!itemsText) {
      itemsText = '1. General Purchase - ' + curr + totals.grandTotal.toFixed(2) + '\n';
    }

    // Status emoji
    let statusText = '✅ PAID';
    if (totals.status === 'PARTIAL') {
      statusText = `⏳ PARTIAL (Paid: ${curr}${totals.amountPaid.toFixed(2)} | Due: ${curr}${totals.balanceDue.toFixed(2)})`;
    } else if (totals.status === 'UNPAID') {
      statusText = '⚠️ UNPAID / DUE';
    }

    let extraNote = customNote.trim();
    if (!extraNote) {
      extraNote = invNotesInput.value.trim() || storeSettings.defaultNotes;
    }

    // Construct the WhatsApp invoice template
    let msg = `🧾 *INVOICE #${invNum}*\n`;
    msg += `🏪 *${storeSettings.name}*\n`;
    if (storeSettings.tagline) msg += `_${storeSettings.tagline}_\n`;
    if (storeSettings.phone) msg += `📞 Contact: ${storeSettings.phone}\n`;
    msg += `━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *Customer*: ${cName}\n`;
    msg += `📅 *Date*: ${dateStr}\n`;
    msg += `━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `🛍️ *PURCHASED ITEMS*:\n`;
    msg += `${itemsText}\n`;
    msg += `━━━━━━━━━━━━━━━━━━\n`;
    msg += `Subtotal: ${curr}${totals.subtotal.toFixed(2)}\n`;

    if (totals.discountAmount > 0) {
      msg += `Discount: -${curr}${totals.discountAmount.toFixed(2)}\n`;
    }
    if (totals.taxAmount > 0) {
      msg += `Tax/GST: +${curr}${totals.taxAmount.toFixed(2)}\n`;
    }

    msg += `*Grand Total: ${curr}${totals.grandTotal.toFixed(2)}*\n`;
    msg += `Payment Status: ${statusText}\n`;

    if (storeSettings.upiId && totals.status !== 'PAID') {
      msg += `📲 *Pay via UPI*: ${storeSettings.upiId}\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━\n`;
    if (extraNote) msg += `${extraNote}\n`;
    msg += `🙏 *Thank you for your business!*`;

    return msg;
  }

  function cleanPhoneNumber(rawPhone) {
    if (!rawPhone) return '';
    // Strip non-digits
    let cleaned = rawPhone.replace(/\D/g, '');
    // If standard 10 digit Indian number, prefix with 91
    if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    return cleaned;
  }

  function openWhatsAppModal() {
    const rawPhone = custPhoneInput.value.trim();
    const cleanPhone = cleanPhoneNumber(rawPhone);
    const cName = custNameInput.value.trim() || 'Valued Customer';

    waModalCustName.textContent = cName;
    waModalCustPhone.textContent = cleanPhone ? `+${cleanPhone}` : '(No phone entered)';

    // Update message preview
    const msg = buildWhatsAppMessageText(waCustomNoteInput.value);
    waMessageText.textContent = msg;

    openModal(modalWhatsApp);
  }

  function sendWhatsAppDirect() {
    const rawPhone = custPhoneInput.value.trim();
    const cleanPhone = cleanPhoneNumber(rawPhone);

    if (!cleanPhone || cleanPhone.length < 10) {
      showToast('Please enter a valid customer phone number first!', 'warning');
      custPhoneInput.focus();
      return;
    }

    const msg = buildWhatsAppMessageText(waCustomNoteInput.value);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');
    closeModal(modalWhatsApp);
    showToast(`WhatsApp opened for ${waModalCustName.textContent}!`);
  }

  // -----------------------------------------------------------------
  // 8. SAVE & HISTORY MANAGEMENT
  // -----------------------------------------------------------------
  function saveCurrentInvoice() {
    const cName = custNameInput.value.trim();
    if (!cName) {
      showToast('Please enter customer name to save bill', 'warning');
      custNameInput.focus();
      return;
    }

    const totals = calculateTotals();
    const invNum = invNumberInput.value.trim() || 'INV-001';

    const invoiceRecord = {
      id: 'inv_' + Date.now(),
      invNumber: invNum,
      date: invDateInput.value,
      dueDate: invDueDateInput.value,
      customerName: cName,
      customerPhone: custPhoneInput.value.trim(),
      customerEmail: custEmailInput.value.trim(),
      customerAddress: custAddressInput.value.trim(),
      items: JSON.parse(JSON.stringify(currentInvoiceItems)),
      discount: {
        value: parseFloat(discountValInput.value) || 0,
        type: discountTypeSelect.value
      },
      tax: {
        value: parseFloat(taxValInput.value) || 0,
        type: taxTypeSelect.value
      },
      subtotal: totals.subtotal,
      grandTotal: totals.grandTotal,
      amountPaid: totals.amountPaid,
      balanceDue: totals.balanceDue,
      status: totals.status,
      notes: invNotesInput.value.trim(),
      savedAt: new Date().toISOString()
    };

    // Check if updating existing
    const existingIdx = invoicesHistory.findIndex(i => i.invNumber === invNum);
    if (existingIdx >= 0) {
      invoicesHistory[existingIdx] = invoiceRecord;
      showToast(`Invoice ${invNum} updated successfully!`);
    } else {
      invoicesHistory.unshift(invoiceRecord);
      showToast(`Invoice ${invNum} saved to history!`);
    }

    saveHistory();
  }

  function loadInvoiceFromHistory(inv) {
    invNumberInput.value = inv.invNumber || 'INV-001';
    invDateInput.value = inv.date || '';
    invDueDateInput.value = inv.dueDate || '';
    custNameInput.value = inv.customerName || '';
    custPhoneInput.value = inv.customerPhone || '';
    custEmailInput.value = inv.customerEmail || '';
    custAddressInput.value = inv.customerAddress || '';

    // Status
    paymentStatusRadios.forEach(radio => {
      radio.checked = (radio.value === inv.status);
    });

    // Discount & Tax
    if (inv.discount) {
      discountValInput.value = inv.discount.value || 0;
      discountTypeSelect.value = inv.discount.type || 'FLAT';
    }
    if (inv.tax) {
      taxValInput.value = inv.tax.value || 0;
      taxTypeSelect.value = inv.tax.type || 'PERCENT';
    }

    if (inv.amountPaid !== undefined) {
      amountPaidInput.value = inv.amountPaid;
    }

    invNotesInput.value = inv.notes || storeSettings.defaultNotes;

    // Items
    itemsListContainer.innerHTML = '';
    currentInvoiceItems = [];
    nextItemId = 1;

    if (inv.items && inv.items.length > 0) {
      inv.items.forEach(item => {
        addItemRow(item.name, item.qty, item.price);
      });
    } else {
      addItemRow('', 1, '');
    }

    updateCalculationsAndPreview();
    closeModal(modalHistory);
    showToast(`Loaded invoice ${inv.invNumber}!`);
  }

  function updateHistoryStats() {
    const totalCount = invoicesHistory.length;
    let totalRev = 0;
    let totalPending = 0;
    let todayCount = 0;

    const todayStr = new Date().toISOString().split('T')[0];

    invoicesHistory.forEach(inv => {
      totalRev += (inv.grandTotal || 0);
      totalPending += (inv.balanceDue || 0);
      if (inv.date === todayStr) todayCount++;
    });

    const curr = storeSettings.currency || '₹';
    historyCountBadge.textContent = totalCount;
    headerStatText.textContent = `Today: ${todayCount} bills`;

    metricTotalBills.textContent = totalCount;
    metricTotalRevenue.textContent = `${curr}${totalRev.toFixed(2)}`;
    metricTotalPending.textContent = `${curr}${totalPending.toFixed(2)}`;
  }

  function renderHistoryTable(query = '') {
    historyTableBody.innerHTML = '';
    const q = query.toLowerCase().trim();

    const filtered = invoicesHistory.filter(inv => {
      if (!q) return true;
      return (
        (inv.invNumber && inv.invNumber.toLowerCase().includes(q)) ||
        (inv.customerName && inv.customerName.toLowerCase().includes(q)) ||
        (inv.customerPhone && inv.customerPhone.includes(q))
      );
    });

    if (filtered.length === 0) {
      emptyHistoryState.style.display = 'block';
      return;
    }

    emptyHistoryState.style.display = 'none';
    const curr = storeSettings.currency || '₹';

    filtered.forEach(inv => {
      const tr = document.createElement('tr');

      let statusBadgeClass = 'hist-status-paid';
      if (inv.status === 'UNPAID') statusBadgeClass = 'hist-status-unpaid';
      else if (inv.status === 'PARTIAL') statusBadgeClass = 'hist-status-partial';

      tr.innerHTML = `
        <td><strong>${escapeHtml(inv.invNumber)}</strong></td>
        <td>${formatDateNice(inv.date)}</td>
        <td>${escapeHtml(inv.customerName)}</td>
        <td>${inv.customerPhone ? `+91 ${escapeHtml(inv.customerPhone)}` : '-'}</td>
        <td><strong>${curr}${(inv.grandTotal || 0).toFixed(2)}</strong></td>
        <td><span class="hist-status-badge ${statusBadgeClass}">${inv.status}</span></td>
        <td class="text-right">
          <div class="hist-action-group">
            <button class="hist-btn-icon hist-btn-wa" title="Send WhatsApp" data-action="wa">
              <i class="fa-brands fa-whatsapp"></i>
            </button>
            <button class="hist-btn-icon" title="View / Load Invoice" data-action="load">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </button>
            <button class="hist-btn-icon danger-hover" title="Delete" data-action="del">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </td>
      `;

      // Button actions
      tr.querySelector('[data-action="load"]').addEventListener('click', () => {
        loadInvoiceFromHistory(inv);
      });

      tr.querySelector('[data-action="wa"]').addEventListener('click', () => {
        loadInvoiceFromHistory(inv);
        openWhatsAppModal();
      });

      tr.querySelector('[data-action="del"]').addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete invoice ${inv.invNumber}?`)) {
          invoicesHistory = invoicesHistory.filter(i => i.id !== inv.id);
          saveHistory();
          renderHistoryTable(historySearchInput.value);
          showToast(`Invoice ${inv.invNumber} deleted`);
        }
      });

      historyTableBody.appendChild(tr);
    });
  }

  function exportHistoryToCsv() {
    if (invoicesHistory.length === 0) {
      showToast('No invoices to export', 'warning');
      return;
    }

    const headers = ['Invoice Number', 'Date', 'Customer Name', 'Phone', 'Subtotal', 'Grand Total', 'Amount Paid', 'Balance Due', 'Status'];
    const rows = invoicesHistory.map(inv => [
      `"${inv.invNumber}"`,
      `"${inv.date}"`,
      `"${inv.customerName.replace(/"/g, '""')}"`,
      `"${inv.customerPhone || ''}"`,
      (inv.subtotal || 0).toFixed(2),
      (inv.grandTotal || 0).toFixed(2),
      (inv.amountPaid || 0).toFixed(2),
      (inv.balanceDue || 0).toFixed(2),
      `"${inv.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Billy_Invoices_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Invoices exported as CSV file');
  }

  // -----------------------------------------------------------------
  // 9. SAMPLE DEMO DATA GENERATOR
  // -----------------------------------------------------------------
  function fillSampleDemoBill() {
    custNameInput.value = 'Rahul Verma';
    custPhoneInput.value = '9876543210';
    custEmailInput.value = 'rahul.verma@example.com';
    custAddressInput.value = 'Table #4 / Takeaway';

    // Set sample bakery & cafe items
    itemsListContainer.innerHTML = '';
    currentInvoiceItems = [];
    nextItemId = 1;

    addItemRow('Chocolate Truffle Pastry', 2, 120);
    addItemRow('Cold Coffee with Vanilla Ice Cream', 2, 150);
    addItemRow('Paneer Tikka Grilled Sandwich', 1, 180);
    addItemRow('Fresh Baked Veg Puff', 4, 35);

    discountValInput.value = '50';
    discountTypeSelect.value = 'FLAT';

    taxValInput.value = '5';
    taxTypeSelect.value = 'PERCENT';

    // Status
    paymentStatusRadios[0].checked = true; // PAID

    invNotesInput.value = 'Thank you for visiting Shree Krishna Cafe & Bakers! Visit again.';

    updateCalculationsAndPreview();
    showToast('Loaded demo sample bill! You can now test sending to WhatsApp.');
  }

  function resetToNewBill() {
    custNameInput.value = '';
    custPhoneInput.value = '';
    custEmailInput.value = '';
    custAddressInput.value = '';
    discountValInput.value = '0';
    taxValInput.value = '0';
    amountPaidInput.value = '';
    invNotesInput.value = storeSettings.defaultNotes;
    paymentStatusRadios[0].checked = true;

    setTodayDate();
    generateNextInvoiceNumber();
    clearAllItems();
    updateCalculationsAndPreview();
    showToast('Started new fresh bill');
  }

  // -----------------------------------------------------------------
  // 10. EVENT LISTENERS
  // -----------------------------------------------------------------
  function setupEventListeners() {
    // Theme toggle
    btnThemeToggle.addEventListener('click', toggleTheme);

    // New Bill
    btnNewInvoice.addEventListener('click', resetToNewBill);
    btnResetBill.addEventListener('click', resetToNewBill);
    btnFillSample.addEventListener('click', fillSampleDemoBill);

    // Save Bill
    btnSaveInvoice.addEventListener('click', saveCurrentInvoice);

    // Print
    btnPrintInvoice.addEventListener('click', () => {
      window.print();
    });

    // Expandable customer details
    toggleMoreCustDetailsBtn.addEventListener('click', () => {
      moreCustFields.classList.toggle('collapsed');
      const isCollapsed = moreCustFields.classList.contains('collapsed');
      toggleCustDetailsIcon.className = isCollapsed ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-up';
    });

    // Input listeners for live updates
    [
      custNameInput, custPhoneInput, custEmailInput, custAddressInput,
      invNumberInput, invDateInput, invDueDateInput, invNotesInput,
      discountValInput, discountTypeSelect, taxValInput, taxTypeSelect,
      amountPaidInput
    ].forEach(elem => {
      elem.addEventListener('input', updateCalculationsAndPreview);
      elem.addEventListener('change', updateCalculationsAndPreview);
    });

    paymentStatusRadios.forEach(radio => {
      radio.addEventListener('change', updateCalculationsAndPreview);
    });

    // Add item row
    btnAddItemRow.addEventListener('click', () => {
      addItemRow('', 1, '');
      setTimeout(() => {
        const allNames = itemsListContainer.querySelectorAll('.item-name-input');
        if (allNames.length > 0) allNames[allNames.length - 1].focus();
      }, 50);
    });

    // Quick preset chips
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const name = chip.dataset.name;
        const price = chip.dataset.price;
        addItemRow(name, 1, price);
        updateCalculationsAndPreview();
        showToast(`Added ${name}`);
      });
    });

    // WhatsApp Direct Buttons
    btnDirectWhatsApp.addEventListener('click', openWhatsAppModal);
    btnPreviewWaShare.addEventListener('click', openWhatsAppModal);

    // WhatsApp Modal Actions
    btnCloseWaModal.addEventListener('click', () => closeModal(modalWhatsApp));
    btnExecuteWhatsAppSend.addEventListener('click', sendWhatsAppDirect);
    waCustomNoteInput.addEventListener('input', () => {
      waMessageText.textContent = buildWhatsAppMessageText(waCustomNoteInput.value);
    });

    btnCopyWaText.addEventListener('click', () => {
      const msg = buildWhatsAppMessageText(waCustomNoteInput.value);
      navigator.clipboard.writeText(msg).then(() => {
        showToast('WhatsApp message copied to clipboard!');
      });
    });

    btnQuickCopyText.addEventListener('click', () => {
      const msg = buildWhatsAppMessageText();
      navigator.clipboard.writeText(msg).then(() => {
        showToast('Receipt summary copied to clipboard!');
      });
    });

    // Store Settings Modal
    btnSettings.addEventListener('click', () => openModal(modalSettings));
    btnCloseSettingsModal.addEventListener('click', () => closeModal(modalSettings));
    btnCancelSettings.addEventListener('click', () => closeModal(modalSettings));
    btnSaveSettings.addEventListener('click', saveSettingsFromUI);

    // History Modal
    btnHistory.addEventListener('click', () => {
      renderHistoryTable();
      openModal(modalHistory);
    });
    btnCloseHistoryModal.addEventListener('click', () => closeModal(modalHistory));
    btnCloseHistory.addEventListener('click', () => closeModal(modalHistory));
    historySearchInput.addEventListener('input', () => {
      renderHistoryTable(historySearchInput.value);
    });
    btnExportCsv.addEventListener('click', exportHistoryToCsv);
    btnClearHistory.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all saved invoices? This action cannot be undone.')) {
        invoicesHistory = [];
        saveHistory();
        renderHistoryTable();
        showToast('All invoice history cleared');
      }
    });

    // Close modals on clicking backdrop
    [modalWhatsApp, modalSettings, modalHistory].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    });
  }

  // -----------------------------------------------------------------
  // 11. MODAL & TOAST HELPERS
  // -----------------------------------------------------------------
  function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showToast(message, type = 'success') {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage.textContent = message;
    if (type === 'warning') {
      toastIcon.className = 'fa-solid fa-triangle-exclamation toast-icon';
      toastIcon.style.color = '#F59E0B';
    } else {
      toastIcon.className = 'fa-solid fa-circle-check toast-icon';
      toastIcon.style.color = '#07C160';
    }
    cosToast.classList.add('show');
    toastTimer = setTimeout(() => {
      cosToast.classList.remove('show');
    }, 2800);
  }

  // -----------------------------------------------------------------
  // 12. UTILITY FUNCTIONS
  // -----------------------------------------------------------------
  function formatDateNice(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
      }
    } catch (e) {}
    return dateStr;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Start app
  document.addEventListener('DOMContentLoaded', init);

})();
