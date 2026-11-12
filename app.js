/* ===================================================================
   MAMTHA CREATIONS — COMPREHENSIVE BOUTIQUE POS & BILLING ENGINE
   Designed for Mamtha Creations (Fashion & Bridal Studio, Patancheru)
   ColorOS 7 Infinite Design • Mobile-Ready • UPI QR • WhatsApp
   =================================================================== */

(function () {
  'use strict';

  // -----------------------------------------------------------------
  // 1. DEFAULT DATA, STORAGE KEYS & PRESET CATALOG
  // -----------------------------------------------------------------
  const STORAGE_KEYS = {
    SETTINGS: 'mamtha_store_settings',
    LEGACY_SETTINGS: 'billy_store_settings',
    INVOICES: 'mamtha_invoices_history',
    LEGACY_INVOICES: 'billy_invoices_history',
    THEME: 'mamtha_theme_mode',
    LAST_INV_NUM: 'mamtha_last_inv_number'
  };

  const DEFAULT_SETTINGS = {
    name: 'Mamtha Creations',
    tagline: 'Bespoke Fashion & Bridal Stitching Studio',
    phone: '+91 9515072693',
    address: 'Patancheru, Hyderabad, Telangana',
    gstin: '',
    currency: '₹',
    upiId: '9515072693@ybl',
    defaultNotes: 'Thank you for choosing Mamtha Creations! We appreciate your visit.',
    customQrUrl: 'qr-code.jpg',
    receiptStyle: 'modern' // 'modern' | 'thermal'
  };

  // Pre-configured Mamtha Creations Boutique Catalog
  const BOUTIQUE_CATALOG = [
    // Blouses
    { name: 'Blouse Normal Stitching', price: 650, cat: 'blouse' },
    { name: 'Blouse Lining Stitching', price: 850, cat: 'blouse' },
    { name: 'Princess Cut Designer Blouse', price: 1200, cat: 'blouse' },
    { name: 'Bridal Maggam Work Blouse', price: 3500, cat: 'blouse' },
    { name: 'Heavy Aari / Zardosi Work Blouse', price: 4800, cat: 'blouse' },
    { name: 'Computer Embroidery Work Blouse', price: 1800, cat: 'blouse' },
    // Sarees
    { name: 'Designer Silk Saree', price: 2500, cat: 'saree' },
    { name: 'Pattu Saree Matching Work', price: 3200, cat: 'saree' },
    { name: 'Saree Falls & Pico', price: 150, cat: 'saree' },
    { name: 'Handmade Saree Kuchu / Tassels', price: 450, cat: 'saree' },
    { name: 'Saree Rolling & Polishing', price: 200, cat: 'saree' },
    // Dresses
    { name: 'Kurti / Chudidar Stitching', price: 850, cat: 'dress' },
    { name: 'Designer Anarkali / Long Frock', price: 1800, cat: 'dress' },
    { name: 'Bridal Lehenga & Choli Stitching', price: 2800, cat: 'dress' },
    { name: 'Kids Lehenga / Pattu Pavada', price: 1200, cat: 'dress' },
    { name: 'Dupatta Designer Border & Pico', price: 250, cat: 'dress' },
    // Finishing / Alterations
    { name: 'Fitting & Size Alteration', price: 200, cat: 'finishing' },
    { name: 'Blouse Neck Restyling Work', price: 350, cat: 'finishing' },
    { name: 'Zip / Hook / Latkan Attachment', price: 100, cat: 'finishing' }
  ];

  // State
  let storeSettings = Object.assign({}, DEFAULT_SETTINGS);
  let invoicesHistory = [];
  let currentInvoiceItems = [];
  let nextItemId = 1;
  let activeMobileTab = 'editor'; // 'editor' | 'preview'
  let activeCatalogCat = 'all';
  let activeHistoryFilter = 'ALL';
  let activeWaTemplate = 'invoice';

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

  // Mobile Tabs
  const mobileTabBar = document.getElementById('mobileTabBar');
  const tabBtnEditor = document.getElementById('tabBtnEditor');
  const tabBtnPreview = document.getElementById('tabBtnPreview');
  const mobileGrandTotalPill = document.getElementById('mobileGrandTotalPill');
  const builderColumn = document.getElementById('builderColumn');
  const previewColumn = document.getElementById('previewColumn');
  const btnBackToEditor = document.getElementById('btnBackToEditor');
  const btnDockTogglePreview = document.getElementById('btnDockTogglePreview');

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
  const paymentModeSelect = document.getElementById('paymentMode');

  // Items & Calculations
  const itemsListContainer = document.getElementById('itemsList');
  const btnAddItemRow = document.getElementById('btnAddItemRow');
  const presetChipsContainer = document.getElementById('presetChipsContainer');
  const catalogCategoryTabs = document.getElementById('catalogCategoryTabs');
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
  const calcAdvanceRow = document.getElementById('calcAdvanceRow');
  const calcAdvanceVal = document.getElementById('calcAdvanceVal');
  const calcBalanceRow = document.getElementById('calcBalanceRow');
  const calcBalanceVal = document.getElementById('calcBalanceVal');

  // Dock Actions
  const btnResetBill = document.getElementById('btnResetBill');
  const btnFillSample = document.getElementById('btnFillSample');
  const btnSaveInvoice = document.getElementById('btnSaveInvoice');
  const btnPrintInvoice = document.getElementById('btnPrintInvoice');
  const btnDirectWhatsApp = document.getElementById('btnDirectWhatsApp');
  const btnPreviewWaShare = document.getElementById('btnPreviewWaShare');
  const btnNativeWebShare = document.getElementById('btnNativeWebShare');
  const btnQuickCopyText = document.getElementById('btnQuickCopyText');
  const btnToggleSlipStyle = document.getElementById('btnToggleSlipStyle');
  const slipStyleLabel = document.getElementById('slipStyleLabel');

  // Preview Card Elements
  const printableBillArea = document.getElementById('printableBillArea');
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
  const previewPaymentMode = document.getElementById('previewPaymentMode');
  const previewNoteMsg = document.getElementById('previewNoteMsg');
  const previewBarcodeNum = document.getElementById('previewBarcodeNum');
  const receiptQrWrap = document.getElementById('receiptQrWrap');
  const receiptQrImage = document.getElementById('receiptQrImage');
  const receiptUpiId = document.getElementById('receiptUpiId');
  const btnDirectUpiPayLink = document.getElementById('btnDirectUpiPayLink');

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
  const waTemplatePills = document.querySelectorAll('.wa-tpl-pill');

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
  const historyStatusFilters = document.getElementById('historyStatusFilters');
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
    renderCatalogChips('all');
    initServiceWorker();

    // Start with 1 default blank row
    addItemRow('', 1, '');
    updateCalculationsAndPreview();
    updateHistoryStats();

    // Check responsive view mode
    handleResponsiveLayout();
    window.addEventListener('resize', handleResponsiveLayout);
  }

  // -----------------------------------------------------------------
  // 4. STORAGE & SETTINGS MANAGEMENT
  // -----------------------------------------------------------------
  function loadSettings() {
    try {
      let saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!saved) saved = localStorage.getItem(STORAGE_KEYS.LEGACY_SETTINGS);

      if (saved) {
        const parsed = JSON.parse(saved);
        // Guarantee store name is Mamtha Creations
        if (parsed.name === 'Shree Krishna Cafe & Bakers' || !parsed.name || parsed.name.trim() === '') {
          parsed.name = 'Mamtha Creations';
          parsed.tagline = 'Bespoke Fashion & Bridal Stitching Studio';
          parsed.phone = '+91 9515072693';
          parsed.address = 'Patancheru, Hyderabad, Telangana';
          parsed.upiId = '9515072693@ybl';
          parsed.defaultNotes = 'Thank you for choosing Mamtha Creations! We appreciate your visit.';
        }
        if (!parsed.upiId || parsed.upiId === 'shreekrishnacafe@upi' || parsed.upiId === 'mamtha@upi') {
          parsed.upiId = '9515072693@ybl';
        }
        storeSettings = Object.assign({}, DEFAULT_SETTINGS, parsed);
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
      } else {
        storeSettings = Object.assign({}, DEFAULT_SETTINGS);
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
      }
    } catch (e) {
      console.error('Failed to load settings', e);
      storeSettings = Object.assign({}, DEFAULT_SETTINGS);
    }
    applyStoreSettingsToUI();
  }

  function applyStoreSettingsToUI() {
    navStoreName.textContent = storeSettings.name || 'Mamtha Creations';
    previewStoreName.textContent = storeSettings.name || 'Mamtha Creations';
    previewStoreTagline.textContent = storeSettings.tagline || 'Bespoke Fashion & Bridal Stitching Studio';
    previewStoreAddress.textContent = storeSettings.address || 'Patancheru, Hyderabad, Telangana';
    previewStorePhone.textContent = storeSettings.phone || '+91 9515072693';

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
    if (!invNotesInput.value || invNotesInput.value.includes('Shree Krishna') || invNotesInput.value === 'Thank you for choosing us!') {
      invNotesInput.value = storeSettings.defaultNotes || DEFAULT_SETTINGS.defaultNotes;
    }

    // Populate Settings modal inputs
    setStoreNameInput.value = storeSettings.name;
    setStoreTaglineInput.value = storeSettings.tagline;
    setStorePhoneInput.value = storeSettings.phone;
    setStoreGstInput.value = storeSettings.gstin || '';
    setStoreAddressInput.value = storeSettings.address;
    setCurrencySelect.value = storeSettings.currency || '₹';
    setUpiIdInput.value = storeSettings.upiId || '9515072693@ybl';
    setDefaultNotesInput.value = storeSettings.defaultNotes;

    // Receipt QR image: User's PhonePe QR
    receiptQrImage.src = 'qr-code.jpg';

    // Receipt style
    applyReceiptStyle(storeSettings.receiptStyle || 'modern');

    updateCalculationsAndPreview();
  }

  function saveSettingsFromUI() {
    storeSettings.name = setStoreNameInput.value.trim() || DEFAULT_SETTINGS.name;
    storeSettings.tagline = setStoreTaglineInput.value.trim();
    storeSettings.phone = setStorePhoneInput.value.trim() || DEFAULT_SETTINGS.phone;
    storeSettings.gstin = setStoreGstInput.value.trim();
    storeSettings.address = setStoreAddressInput.value.trim() || DEFAULT_SETTINGS.address;
    storeSettings.currency = setCurrencySelect.value;
    storeSettings.upiId = setUpiIdInput.value.trim() || '9515072693@ybl';
    storeSettings.defaultNotes = setDefaultNotesInput.value.trim() || DEFAULT_SETTINGS.defaultNotes;

    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
    applyStoreSettingsToUI();
    closeModal(modalSettings);
    showToast('Store settings saved successfully!');
  }

  function applyReceiptStyle(style) {
    storeSettings.receiptStyle = style;
    if (style === 'thermal') {
      printableBillArea.classList.add('style-thermal');
      slipStyleLabel.textContent = 'Modern Invoice';
    } else {
      printableBillArea.classList.remove('style-thermal');
      slipStyleLabel.textContent = 'Thermal Slip';
    }
  }

  function toggleReceiptStyle() {
    const nextStyle = storeSettings.receiptStyle === 'thermal' ? 'modern' : 'thermal';
    applyReceiptStyle(nextStyle);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
    showToast(`Switched to ${nextStyle === 'thermal' ? 'Thermal 80mm Slip' : 'Modern Invoice'} view`);
  }

  function loadHistory() {
    try {
      let saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (!saved) saved = localStorage.getItem(STORAGE_KEYS.LEGACY_INVOICES);
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
      showToast('Switched to Light Mode');
    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      themeIcon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
      showToast('Switched to Dark Mode');
    }
  }

  function setTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    invDateInput.value = `${yyyy}-${mm}-${dd}`;

    // Default delivery date: 4 days from today
    setDeliveryDateOffset(4);
  }

  function setDeliveryDateOffset(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    invDueDateInput.value = `${yyyy}-${mm}-${dd}`;
    updateCalculationsAndPreview();
  }

  function generateNextInvoiceNumber() {
    let nextNum = 1;
    if (invoicesHistory.length > 0) {
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
  // 5. MOBILE VIEW SWITCHING & RESPONSIVENESS
  // -----------------------------------------------------------------
  function switchMobileTab(targetTab) {
    activeMobileTab = targetTab;
    if (targetTab === 'preview') {
      tabBtnPreview.classList.add('active');
      tabBtnEditor.classList.remove('active');
      builderColumn.classList.add('mobile-hidden');
      previewColumn.classList.remove('mobile-hidden');
      if (btnDockTogglePreview) {
        btnDockTogglePreview.innerHTML = '<i class="fa-solid fa-file-pen"></i><span class="dock-btn-text">Edit Bill</span>';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      tabBtnEditor.classList.add('active');
      tabBtnPreview.classList.remove('active');
      builderColumn.classList.remove('mobile-hidden');
      previewColumn.classList.add('mobile-hidden');
      if (btnDockTogglePreview) {
        btnDockTogglePreview.innerHTML = '<i class="fa-regular fa-eye"></i><span class="dock-btn-text">Preview</span>';
      }
    }
  }

  function handleResponsiveLayout() {
    const isMobile = window.innerWidth <= 1024;
    if (isMobile) {
      if (activeMobileTab === 'preview') {
        builderColumn.classList.add('mobile-hidden');
        previewColumn.classList.remove('mobile-hidden');
      } else {
        builderColumn.classList.remove('mobile-hidden');
        previewColumn.classList.add('mobile-hidden');
      }
    } else {
      builderColumn.classList.remove('mobile-hidden');
      previewColumn.classList.remove('mobile-hidden');
    }
  }

  // -----------------------------------------------------------------
  // 6. CATEGORIZED CHIPS & ITEM AUTOCOMPLETE
  // -----------------------------------------------------------------
  function renderCatalogChips(cat = 'all') {
    activeCatalogCat = cat;
    presetChipsContainer.innerHTML = '';

    const filtered = cat === 'all' 
      ? BOUTIQUE_CATALOG 
      : BOUTIQUE_CATALOG.filter(item => item.cat === cat);

    filtered.forEach(item => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'preset-chip';
      chip.dataset.name = item.name;
      chip.dataset.price = item.price;
      chip.innerHTML = `+ ${escapeHtml(item.name)} <span class="chip-price">₹${item.price}</span>`;
      chip.addEventListener('click', () => {
        addItemRow(item.name, 1, item.price);
        updateCalculationsAndPreview();
        showToast(`Added ${item.name}`);
      });
      presetChipsContainer.appendChild(chip);
    });
  }

  // -----------------------------------------------------------------
  // 7. LINE ITEMS MANAGEMENT
  // -----------------------------------------------------------------
  function addItemRow(name = '', qty = 1, price = '', notes = '') {
    const id = nextItemId++;
    const row = {
      id: id,
      name: name,
      qty: parseFloat(qty) || 1,
      price: price === '' ? '' : (parseFloat(price) || 0),
      notes: notes
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
      <div class="col-item-desc item-desc-wrap">
        <label class="mobile-item-label">Item / Service Name</label>
        <div class="item-name-input-wrap">
          <input type="text" class="item-name-input" placeholder="e.g. Blouse Stitching / Saree Work" value="${escapeHtml(item.name)}" autocomplete="off">
          <div class="autocomplete-dropdown" style="display: none;"></div>
        </div>
        <input type="text" class="item-note-input" placeholder="Tailoring / pattern note (e.g. Boat neck, Front hook)" value="${escapeHtml(item.notes || '')}">
      </div>
      <div class="col-item-qty item-qty-wrap">
        <label class="mobile-item-label">Qty</label>
        <input type="number" class="item-qty-input" placeholder="1" min="0.01" step="any" value="${item.qty}" inputmode="decimal">
      </div>
      <div class="col-item-price item-price-wrap">
        <label class="mobile-item-label">Rate (${curr})</label>
        <input type="number" class="item-price-input" placeholder="0.00" min="0" step="any" value="${item.price}" inputmode="decimal">
      </div>
      <div class="col-item-total item-total-wrap">
        <label class="mobile-item-label">Total</label>
        <div class="row-total-val">${curr}${totalVal.toFixed(2)}</div>
      </div>
      <div class="col-item-action">
        <button type="button" class="btn-remove-row" title="Delete row">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    `;

    // Elements
    const nameInput = rowDiv.querySelector('.item-name-input');
    const noteInput = rowDiv.querySelector('.item-note-input');
    const qtyInput = rowDiv.querySelector('.item-qty-input');
    const priceInput = rowDiv.querySelector('.item-price-input');
    const removeBtn = rowDiv.querySelector('.btn-remove-row');
    const totalElem = rowDiv.querySelector('.row-total-val');
    const autoDropdown = rowDiv.querySelector('.autocomplete-dropdown');

    function onRowChange() {
      item.name = nameInput.value;
      item.notes = noteInput.value;
      item.qty = parseFloat(qtyInput.value) || 0;
      item.price = priceInput.value === '' ? '' : (parseFloat(priceInput.value) || 0);
      const rowTot = item.price === '' ? 0 : item.qty * item.price;
      totalElem.textContent = `${storeSettings.currency || '₹'}${rowTot.toFixed(2)}`;
      updateCalculationsAndPreview();
    }

    // Autocomplete handler
    nameInput.addEventListener('input', () => {
      onRowChange();
      const val = nameInput.value.trim().toLowerCase();
      if (val.length >= 1) {
        const matches = BOUTIQUE_CATALOG.filter(c => c.name.toLowerCase().includes(val)).slice(0, 5);
        if (matches.length > 0) {
          autoDropdown.innerHTML = '';
          matches.forEach(m => {
            const opt = document.createElement('div');
            opt.className = 'auto-opt';
            opt.innerHTML = `<span>${escapeHtml(m.name)}</span> <strong>₹${m.price}</strong>`;
            opt.addEventListener('mousedown', (e) => {
              e.preventDefault();
              nameInput.value = m.name;
              priceInput.value = m.price;
              autoDropdown.style.display = 'none';
              onRowChange();
            });
            autoDropdown.appendChild(opt);
          });
          autoDropdown.style.display = 'block';
          return;
        }
      }
      autoDropdown.style.display = 'none';
    });

    nameInput.addEventListener('blur', () => {
      setTimeout(() => { autoDropdown.style.display = 'none'; }, 200);
    });

    noteInput.addEventListener('input', onRowChange);
    qtyInput.addEventListener('input', onRowChange);
    priceInput.addEventListener('input', onRowChange);

    // Enter on price jumps to next row
    priceInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addItemRow('', 1, '');
        setTimeout(() => {
          const allNames = itemsListContainer.querySelectorAll('.item-name-input');
          if (allNames.length > 0) allNames[allNames.length - 1].focus();
        }, 50);
      }
    });

    removeBtn.addEventListener('click', function () {
      if (currentInvoiceItems.length <= 1) {
        item.name = '';
        item.notes = '';
        item.qty = 1;
        item.price = '';
        nameInput.value = '';
        noteInput.value = '';
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
  // 8. CALCULATIONS & LIVE PREVIEW RENDERER
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

    // Paid / Advance / Balance Due
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
    mobileGrandTotalPill.textContent = `${curr}${totals.grandTotal.toFixed(0)}`;

    // Partial / Advance payment input show/hide
    if (totals.status === 'PARTIAL') {
      amountPaidRow.style.display = 'grid';
      balanceDueDisplay.textContent = `${curr}${totals.balanceDue.toFixed(2)}`;
      calcAdvanceRow.style.display = 'flex';
      calcAdvanceVal.textContent = `${curr}${totals.amountPaid.toFixed(2)}`;
      calcBalanceRow.style.display = 'flex';
      calcBalanceVal.textContent = `${curr}${totals.balanceDue.toFixed(2)}`;
    } else {
      amountPaidRow.style.display = 'none';
      calcAdvanceRow.style.display = 'none';
      calcBalanceRow.style.display = 'none';
    }

    // Update Quick Stat text in header
    updateHeaderPillText();

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
    previewBarcodeNum.textContent = `MAMTHA-${invNum}`;

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
      receiptStamp.innerHTML = '<span><i class="fa-solid fa-check"></i> FULLY PAID</span>';
    } else if (totals.status === 'PARTIAL') {
      receiptStamp.classList.add('stamp-partial');
      receiptStamp.innerHTML = `<span>ADVANCE PAID (DUE: ${curr}${totals.balanceDue.toFixed(0)})</span>`;
    } else {
      receiptStamp.classList.add('stamp-unpaid');
      receiptStamp.innerHTML = '<span>PAYMENT DUE</span>';
    }

    // Payment Mode
    previewPaymentMode.textContent = paymentModeSelect.value;

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
          <td class="td-item">
            <strong>${escapeHtml(name || 'Custom Stitching')}</strong>
            ${item.notes ? `<div class="preview-item-note">${escapeHtml(item.notes)}</div>` : ''}
          </td>
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
        <td colspan="4" style="text-align: center; color: #8E96A4; padding: 20px 8px;">
          No garments or services added yet. Click "+ Blouse", "+ Maggam Work" or add items on the left.
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

    // Direct UPI Payment Link on Mobile
    const payTargetAmount = totals.status === 'PARTIAL' ? totals.balanceDue : totals.grandTotal;
    const upiUri = `upi://pay?pa=${encodeURIComponent(storeSettings.upiId)}&pn=${encodeURIComponent(storeSettings.name)}&am=${payTargetAmount.toFixed(2)}&cu=INR&tn=Bill-${encodeURIComponent(invNum)}`;
    btnDirectUpiPayLink.href = upiUri;
    btnDirectUpiPayLink.innerHTML = `<i class="fa-solid fa-mobile-screen-button"></i> Pay ${curr}${payTargetAmount.toFixed(2)} via UPI App`;
  }

  function updateHeaderPillText() {
    const todayStr = new Date().toISOString().split('T')[0];
    let todayCount = 0;
    let todayRev = 0;
    invoicesHistory.forEach(inv => {
      if (inv.date === todayStr) {
        todayCount++;
        todayRev += (inv.amountPaid || inv.grandTotal || 0);
      }
    });
    const curr = storeSettings.currency || '₹';
    headerStatText.textContent = `Today: ${todayCount} bills (${curr}${todayRev.toFixed(0)})`;
  }

  // -----------------------------------------------------------------
  // 9. WHATSAPP DIRECT MESSAGE BUILDER
  // -----------------------------------------------------------------
  function buildWhatsAppMessageText(customNote = '') {
    const curr = storeSettings.currency || '₹';
    const totals = calculateTotals();
    const invNum = invNumberInput.value.trim() || 'INV-001';
    const cName = custNameInput.value.trim() || 'Valued Customer';
    const dateStr = formatDateNice(invDateInput.value);
    const deliveryDateStr = invDueDateInput.value ? formatDateNice(invDueDateInput.value) : '';

    if (activeWaTemplate === 'ready') {
      // READY FOR PICKUP TEMPLATE
      let readyMsg = `👗 *MAMTHA CREATIONS — ORDER READY!* ✨\n`;
      readyMsg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      readyMsg += `Dear *${cName}*,\n\n`;
      readyMsg += `Your tailoring & designer dress order for *Bill #${invNum}* is now *READY FOR TRIAL & PICKUP*! 🪡\n\n`;
      if (totals.balanceDue > 0) {
        readyMsg += `💰 *Pending Balance on Delivery*: ${curr}${totals.balanceDue.toFixed(2)}\n`;
        readyMsg += `📲 *Pay via UPI*: ${storeSettings.upiId}\n\n`;
      } else {
        readyMsg += `✅ *Payment Status*: Fully Paid\n\n`;
      }
      readyMsg += `🏪 *Store Address*: ${storeSettings.address}\n`;
      readyMsg += `📞 *Contact*: ${storeSettings.phone}\n`;
      readyMsg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      if (customNote.trim()) readyMsg += `${customNote.trim()}\n`;
      readyMsg += `We look forward to seeing you at Mamtha Creations! 🙏`;
      return readyMsg;
    }

    if (activeWaTemplate === 'reminder') {
      // FRIENDLY BALANCE REMINDER TEMPLATE
      let remMsg = `⏳ *PAYMENT REMINDER — MAMTHA CREATIONS*\n`;
      remMsg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      remMsg += `Dear *${cName}*,\n\n`;
      readyMsg: remMsg += `This is a gentle reminder regarding the balance due for your order *Bill #${invNum}*.\n\n`;
      remMsg += `🏷️ *Grand Total*: ${curr}${totals.grandTotal.toFixed(2)}\n`;
      remMsg += `💵 *Advance Paid*: ${curr}${totals.amountPaid.toFixed(2)}\n`;
      remMsg += `⚠️ *Balance Due*: ${curr}${totals.balanceDue.toFixed(2)}\n`;
      if (deliveryDateStr) remMsg += `📦 *Scheduled Delivery*: ${deliveryDateStr}\n\n`;
      remMsg += `📲 *Scan or Pay via UPI*: ${storeSettings.upiId}\n`;
      remMsg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      if (customNote.trim()) remMsg += `${customNote.trim()}\n`;
      remMsg += `Thank you! For queries call: ${storeSettings.phone}`;
      return remMsg;
    }

    // STANDARD INVOICE TEMPLATE
    let itemsText = '';
    let counter = 1;
    currentInvoiceItems.forEach(item => {
      const name = item.name.trim();
      const p = item.price === '' ? 0 : parseFloat(item.price) || 0;
      const q = parseFloat(item.qty) || 0;
      if (name || p > 0) {
        itemsText += `${counter}. *${name || 'Service'}* (x${q}) — ${curr}${(q * p).toFixed(2)}\n`;
        if (item.notes) itemsText += `   ↳ _${item.notes}_\n`;
        counter++;
      }
    });

    if (!itemsText) {
      itemsText = '1. Boutique / Stitching Services — ' + curr + totals.grandTotal.toFixed(2) + '\n';
    }

    let statusLine = '✅ FULLY PAID';
    if (totals.status === 'PARTIAL') {
      statusLine = `⏳ *ADVANCE RECEIVED*: ${curr}${totals.amountPaid.toFixed(2)}\n⚠️ *BALANCE ON DELIVERY*: ${curr}${totals.balanceDue.toFixed(2)}`;
    } else if (totals.status === 'UNPAID') {
      statusLine = `⚠️ *BALANCE DUE*: ${curr}${totals.grandTotal.toFixed(2)}`;
    }

    let extraNote = customNote.trim();
    if (!extraNote) {
      extraNote = invNotesInput.value.trim() || storeSettings.defaultNotes;
    }

    let msg = `🧾 *INVOICE #${invNum}*\n`;
    msg += `✨ *${storeSettings.name}*\n`;
    if (storeSettings.tagline) msg += `_${storeSettings.tagline}_\n`;
    msg += `📍 ${storeSettings.address}\n`;
    msg += `📞 Contact: ${storeSettings.phone}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *Customer*: ${cName}\n`;
    msg += `📅 *Order Date*: ${dateStr}\n`;
    if (deliveryDateStr) {
      msg += `📦 *Delivery Date*: ${deliveryDateStr}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `👗 *SERVICES & ITEMS*:\n`;
    msg += `${itemsText}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Subtotal: ${curr}${totals.subtotal.toFixed(2)}\n`;

    if (totals.discountAmount > 0) {
      msg += `Discount: -${curr}${totals.discountAmount.toFixed(2)}\n`;
    }
    if (totals.taxAmount > 0) {
      msg += `Tax/GST: +${curr}${totals.taxAmount.toFixed(2)}\n`;
    }

    msg += `*Grand Total: ${curr}${totals.grandTotal.toFixed(2)}*\n`;
    msg += `Payment Mode: ${paymentModeSelect.value}\n`;
    msg += `${statusLine}\n\n`;

    if (storeSettings.upiId && totals.balanceDue > 0) {
      msg += `📲 *Pay via UPI*: ${storeSettings.upiId}\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (extraNote) msg += `${extraNote}\n`;
    msg += `🙏 *Thank you for choosing Mamtha Creations!*`;

    return msg;
  }

  function cleanPhoneNumber(rawPhone) {
    if (!rawPhone) return '';
    let cleaned = rawPhone.replace(/\D/g, '');
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
    waModalCustPhone.textContent = cleanPhone ? `+${cleanPhone}` : '(No mobile number entered)';

    // Update message preview
    const msg = buildWhatsAppMessageText(waCustomNoteInput.value);
    waMessageText.textContent = msg;

    openModal(modalWhatsApp);
  }

  function sendWhatsAppDirect() {
    const rawPhone = custPhoneInput.value.trim();
    const cleanPhone = cleanPhoneNumber(rawPhone);

    if (!cleanPhone || cleanPhone.length < 10) {
      showToast('Please enter customer mobile number first!', 'warning');
      custPhoneInput.focus();
      return;
    }

    const msg = buildWhatsAppMessageText(waCustomNoteInput.value);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, '_blank');
    closeModal(modalWhatsApp);
    showToast(`Opening WhatsApp for ${waModalCustName.textContent}...`);
  }

  function shareNativeMobile() {
    const msg = buildWhatsAppMessageText();
    const cName = custNameInput.value.trim() || 'Customer';
    const invNum = invNumberInput.value.trim() || 'INV-001';

    if (navigator.share) {
      navigator.share({
        title: `Bill ${invNum} - Mamtha Creations`,
        text: msg
      }).then(() => {
        showToast('Shared successfully!');
      }).catch((e) => {
        if (e.name !== 'AbortError') {
          copyBillTextToClipboard();
        }
      });
    } else {
      copyBillTextToClipboard();
    }
  }

  function copyBillTextToClipboard() {
    const msg = buildWhatsAppMessageText();
    navigator.clipboard.writeText(msg).then(() => {
      showToast('Bill text copied to clipboard!');
    });
  }

  // -----------------------------------------------------------------
  // 10. SAVE, HISTORY & REPORTING
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
      paymentMode: paymentModeSelect.value,
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

    if (inv.paymentMode) {
      paymentModeSelect.value = inv.paymentMode;
    }

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
        addItemRow(item.name, item.qty, item.price, item.notes);
      });
    } else {
      addItemRow('', 1, '');
    }

    updateCalculationsAndPreview();
    closeModal(modalHistory);
    showToast(`Loaded invoice ${inv.invNumber}!`);

    if (window.innerWidth <= 1024) {
      switchMobileTab('editor');
    }
  }

  function markInvoiceFullyPaid(inv) {
    inv.status = 'PAID';
    inv.amountPaid = inv.grandTotal;
    inv.balanceDue = 0;
    saveHistory();
    renderHistoryTable(historySearchInput.value);
    showToast(`Bill ${inv.invNumber} marked as Fully Paid!`);

    // If currently open invoice is this one, update UI too
    if (invNumberInput.value.trim() === inv.invNumber) {
      paymentStatusRadios[0].checked = true;
      updateCalculationsAndPreview();
    }
  }

  function updateHistoryStats() {
    const totalCount = invoicesHistory.length;
    let totalRev = 0;
    let totalPending = 0;

    invoicesHistory.forEach(inv => {
      totalRev += (inv.amountPaid !== undefined ? inv.amountPaid : inv.grandTotal || 0);
      totalPending += (inv.balanceDue || 0);
    });

    const curr = storeSettings.currency || '₹';
    historyCountBadge.textContent = totalCount;
    metricTotalBills.textContent = totalCount;
    metricTotalRevenue.textContent = `${curr}${totalRev.toFixed(2)}`;
    metricTotalPending.textContent = `${curr}${totalPending.toFixed(2)}`;

    updateHeaderPillText();
  }

  function renderHistoryTable(query = '') {
    historyTableBody.innerHTML = '';
    const q = query.toLowerCase().trim();

    const filtered = invoicesHistory.filter(inv => {
      // Filter by status tab
      if (activeHistoryFilter !== 'ALL' && inv.status !== activeHistoryFilter) {
        return false;
      }
      // Filter by search query
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
      let statusLabel = 'PAID';
      if (inv.status === 'UNPAID') {
        statusBadgeClass = 'hist-status-unpaid';
        statusLabel = 'PENDING';
      } else if (inv.status === 'PARTIAL') {
        statusBadgeClass = 'hist-status-partial';
        statusLabel = 'ADVANCE';
      }

      tr.innerHTML = `
        <td><strong>${escapeHtml(inv.invNumber)}</strong></td>
        <td>${formatDateNice(inv.date)}</td>
        <td>
          <div class="hist-cust-name">${escapeHtml(inv.customerName)}</div>
          <div class="hist-cust-phone">${inv.customerPhone ? `+91 ${escapeHtml(inv.customerPhone)}` : '-'}</div>
        </td>
        <td>${inv.dueDate ? formatDateNice(inv.dueDate) : '-'}</td>
        <td><strong>${curr}${(inv.grandTotal || 0).toFixed(2)}</strong></td>
        <td class="${inv.balanceDue > 0 ? 'text-danger fw-bold' : 'text-muted'}">
          ${curr}${(inv.balanceDue || 0).toFixed(2)}
        </td>
        <td><span class="hist-status-badge ${statusBadgeClass}">${statusLabel}</span></td>
        <td class="text-right">
          <div class="hist-action-group">
            ${inv.status !== 'PAID' ? `
              <button class="hist-btn-icon hist-btn-pay" title="Mark Fully Paid (Collect Balance)" data-action="mark-paid">
                <i class="fa-solid fa-check"></i>
              </button>
            ` : ''}
            <button class="hist-btn-icon hist-btn-wa" title="Send WhatsApp" data-action="wa">
              <i class="fa-brands fa-whatsapp"></i>
            </button>
            <button class="hist-btn-icon" title="View / Edit Invoice" data-action="load">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </button>
            <button class="hist-btn-icon danger-hover" title="Delete" data-action="del">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </td>
      `;

      // Actions
      const markPaidBtn = tr.querySelector('[data-action="mark-paid"]');
      if (markPaidBtn) {
        markPaidBtn.addEventListener('click', () => markInvoiceFullyPaid(inv));
      }

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

    const headers = ['Invoice Number', 'Order Date', 'Delivery Date', 'Customer Name', 'Phone', 'Subtotal', 'Grand Total', 'Advance Paid', 'Balance Due', 'Status', 'Payment Mode'];
    const rows = invoicesHistory.map(inv => [
      `"${inv.invNumber}"`,
      `"${inv.date}"`,
      `"${inv.dueDate || ''}"`,
      `"${inv.customerName.replace(/"/g, '""')}"`,
      `"${inv.customerPhone || ''}"`,
      (inv.subtotal || 0).toFixed(2),
      (inv.grandTotal || 0).toFixed(2),
      (inv.amountPaid || 0).toFixed(2),
      (inv.balanceDue || 0).toFixed(2),
      `"${inv.status}"`,
      `"${inv.paymentMode || 'PhonePe / UPI'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mamtha_Creations_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders exported as CSV file');
  }

  // -----------------------------------------------------------------
  // 11. SAMPLE DEMO DATA
  // -----------------------------------------------------------------
  function fillSampleDemoBill() {
    custNameInput.value = 'Smt. Anitha Varma';
    custPhoneInput.value = '9876543210';
    custEmailInput.value = 'anitha.varma@example.com';
    custAddressInput.value = 'Near Rythu Bazar, Patancheru';

    // Set dates
    setTodayDate();
    setDeliveryDateOffset(5); // Delivery in 5 days

    itemsListContainer.innerHTML = '';
    currentInvoiceItems = [];
    nextItemId = 1;

    addItemRow('Bridal Maggam Work Blouse', 1, 3500, 'Peacock design, heavy gold zardosi, back boat neck');
    addItemRow('Pattu Saree Matching Work', 1, 1500, 'Saree pallu matching border & beads');
    addItemRow('Handmade Saree Kuchu / Tassels', 1, 450, 'Silk thread matching tassels');
    addItemRow('Saree Falls & Pico', 1, 150, 'Standard matching fall');

    discountValInput.value = '200';
    discountTypeSelect.value = 'FLAT';

    taxValInput.value = '0';
    taxTypeSelect.value = 'PERCENT';

    // Partial Advance Payment: Received ₹2000, Balance ₹3400
    paymentStatusRadios[1].checked = true; // PARTIAL
    amountPaidInput.value = '2000';
    paymentModeSelect.value = 'UPI / PhonePe';

    invNotesInput.value = 'Thank you for choosing Mamtha Creations! Please bring this bill at the time of delivery.';

    updateCalculationsAndPreview();
    showToast('Loaded demo boutique bill! You can test sending on WhatsApp or printing.');
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
    paymentModeSelect.value = 'UPI / PhonePe';

    setTodayDate();
    generateNextInvoiceNumber();
    clearAllItems();
    updateCalculationsAndPreview();

    if (window.innerWidth <= 1024) {
      switchMobileTab('editor');
    }

    showToast('Started new fresh bill');
  }

  // -----------------------------------------------------------------
  // 12. EVENT LISTENERS
  // -----------------------------------------------------------------
  function setupEventListeners() {
    // Theme toggle
    btnThemeToggle.addEventListener('click', toggleTheme);

    // Mobile Tabs
    if (tabBtnEditor) {
      tabBtnEditor.addEventListener('click', () => switchMobileTab('editor'));
    }
    if (tabBtnPreview) {
      tabBtnPreview.addEventListener('click', () => switchMobileTab('preview'));
    }
    if (btnBackToEditor) {
      btnBackToEditor.addEventListener('click', () => switchMobileTab('editor'));
    }
    if (btnDockTogglePreview) {
      btnDockTogglePreview.addEventListener('click', () => {
        if (activeMobileTab === 'editor') {
          switchMobileTab('preview');
        } else {
          switchMobileTab('editor');
        }
      });
    }

    // Receipt Style Toggle
    btnToggleSlipStyle.addEventListener('click', toggleReceiptStyle);

    // Quick Date Pills
    document.querySelectorAll('.date-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const days = parseInt(btn.dataset.days, 10);
        setDeliveryDateOffset(days);
        showToast(`Delivery set to +${days} days`);
      });
    });

    // Catalog Category Tabs
    if (catalogCategoryTabs) {
      catalogCategoryTabs.querySelectorAll('.cat-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          catalogCategoryTabs.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderCatalogChips(btn.dataset.cat);
        });
      });
    }

    // New, Reset, Demo Bill
    btnNewInvoice.addEventListener('click', resetToNewBill);
    btnResetBill.addEventListener('click', resetToNewBill);
    btnFillSample.addEventListener('click', fillSampleDemoBill);

    // Save Bill
    btnSaveInvoice.addEventListener('click', saveCurrentInvoice);

    // Print
    btnPrintInvoice.addEventListener('click', () => {
      window.print();
    });

    // Expandable Customer Details
    toggleMoreCustDetailsBtn.addEventListener('click', () => {
      moreCustFields.classList.toggle('collapsed');
      const isCollapsed = moreCustFields.classList.contains('collapsed');
      toggleCustDetailsIcon.className = isCollapsed ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-up';
    });

    // Live update listeners
    [
      custNameInput, custPhoneInput, custEmailInput, custAddressInput,
      invNumberInput, invDateInput, invDueDateInput, invNotesInput,
      discountValInput, discountTypeSelect, taxValInput, taxTypeSelect,
      amountPaidInput, paymentModeSelect
    ].forEach(elem => {
      elem.addEventListener('input', updateCalculationsAndPreview);
      elem.addEventListener('change', updateCalculationsAndPreview);
    });

    paymentStatusRadios.forEach(radio => {
      radio.addEventListener('change', updateCalculationsAndPreview);
    });

    // Add Item Row
    btnAddItemRow.addEventListener('click', () => {
      addItemRow('', 1, '');
      setTimeout(() => {
        const allNames = itemsListContainer.querySelectorAll('.item-name-input');
        if (allNames.length > 0) allNames[allNames.length - 1].focus();
      }, 50);
    });

    // WhatsApp Direct Buttons
    btnDirectWhatsApp.addEventListener('click', openWhatsAppModal);
    btnPreviewWaShare.addEventListener('click', openWhatsAppModal);
    btnNativeWebShare.addEventListener('click', shareNativeMobile);

    // WhatsApp Template Switcher
    waTemplatePills.forEach(pill => {
      pill.addEventListener('click', () => {
        waTemplatePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeWaTemplate = pill.dataset.tpl;
        waMessageText.textContent = buildWhatsAppMessageText(waCustomNoteInput.value);
      });
    });

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

    btnQuickCopyText.addEventListener('click', copyBillTextToClipboard);

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

    if (historyStatusFilters) {
      historyStatusFilters.querySelectorAll('.hist-filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          historyStatusFilters.querySelectorAll('.hist-filter-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeHistoryFilter = btn.dataset.filter;
          renderHistoryTable(historySearchInput.value);
        });
      });
    }

    btnExportCsv.addEventListener('click', exportHistoryToCsv);
    btnClearHistory.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all saved invoices? This cannot be undone.')) {
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
  // 13. PWA SERVICE WORKER
  // -----------------------------------------------------------------
  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(() => {
          console.log('Mamtha POS PWA Service Worker Registered');
        }).catch(err => {
          console.log('SW registration note:', err.message);
        });
      });
    }
  }

  // -----------------------------------------------------------------
  // 14. MODAL & TOAST HELPERS
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
  // 15. UTILITIES
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
