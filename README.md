# Mamtha Creations — Minimalist Billing & Invoicing System

A fast, responsive, ColorOS 7 inspired point-of-sale billing and invoicing tool built specifically for **Mamtha Creations** (Bespoke Fashion & Bridal Stitching Studio, Patancheru, Hyderabad).

---

## ✨ Key Features

1. **Instant WhatsApp Billing**:
   - Send complete, professional formatted bills directly to customer WhatsApp with 1 tap.
   - Includes purchased items, quantities, rates, subtotal, discount, GST/Tax, and payment status.
   - Includes direct UPI ID (`9515072693@ybl`) for instant customer payments.

2. **PhonePe UPI QR Code in Live Receipt Preview**:
   - Live receipt preview renders the store's PhonePe QR code (`qr-code.jpg`).
   - Displays UPI ID: `9515072693@ybl`.
   - Customers can scan to pay with PhonePe, Google Pay, Paytm, BHIM, or any UPI app.

3. **100% Mobile & Touch Optimized**:
   - Mobile Segmented View Switcher: easily switch between **Bill Editor** and **Live Receipt**.
   - Responsive line items: on mobile screens, items format as touch-friendly cards with zero horizontal overflow or cramped fields.
   - Safe-area bottom dock: quick actions (Reset, Demo Sample, Save, Print/PDF, Preview) + full-width WhatsApp CTA button.

4. **Installable Mobile PWA (Progressive Web App)**:
   - Works like a native mobile app on Android and iPhone!
   - Can be added to your home screen ("Add to Home screen").
   - Offline capable with Service Worker caching.

5. **Invoice Management & History**:
   - Save and update invoices in browser local storage.
   - Search past invoices by customer name, phone number, or bill number.
   - Re-send to WhatsApp or reprint anytime.
   - Export all invoices to CSV file.

---

## 📱 How to Use on Your Phone

### Option A: Local Wi-Fi (Instant Phone Access)
1. Make sure your computer and phone are connected to the same Wi-Fi network.
2. Double-click `Launch-On-Phone.bat` in this folder (or run `python -m http.server 8080`).
3. Open your phone's browser (Chrome on Android or Safari on iPhone) and enter:
   ```
   http://192.168.1.4:8080
   ```
4. The Mamtha Creations app will open instantly!

### Option B: Install as an App on Phone (Home Screen)
- **On Android (Google Chrome)**:
  1. Open the app link in Chrome.
  2. Tap the three dots (⋮) menu in the top right.
  3. Tap **"Install app"** or **"Add to Home screen"**.
  4. The **Mamtha POS** icon will appear on your phone's home screen and open in full-screen mode like a native app!

- **On iPhone (Safari)**:
  1. Open the app link in Safari.
  2. Tap the Share button (box with upward arrow) at the bottom.
  3. Scroll down and tap **"Add to Home Screen"**.
  4. Tap **"Add"**.

---

## 💻 How to Use on Computer
- Simply double-click `index.html` or `Start-Mamtha-Billing.bat` to launch in your browser.
