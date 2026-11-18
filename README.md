# Furnish Store (refactored)

Static multi-page website. No build step: open `index.html` in a browser, or deploy the folder to any static host.

## Structure
- `index.html`, `products.html`, `about.html`, `testimonials.html`, `contact.html`
- `css/style.css` - one shared, responsive stylesheet
- `js/main.js` - mobile menu, cart (saved in localStorage), form handling
- `img/` - renamed images (`hero-sofa.png`, `product-1..3.jpg`, `testimonial-bg.jpg`)

## What changed
- Hero image now uses a relative path (was `http://127.0.0.1:5500/...`).
- Responsive layout (CSS grid/flex, no absolute-position hacks, no fixed pixel widths).
- Shared header/nav and footer on every page; all pages are linked.
- Empty / broken pages (about, products, testimonials, contact) completed.
- Cart: add to cart, quantity, remove, total (front-end only).
- Typos, page titles, alt text, `type="email"`, form labels, semantic HTML fixed.
- Removed dead/duplicate CSS, `index2.html`, `indx2.css`, and misspelled folders.

## Still to do (needs your decision)
- Checkout/payment, newsletter and contact form submission are placeholders (see `TODO` in `js/main.js`).
- Replace placeholder text: testimonial (lorem ipsum, "John Doe"), About copy, product descriptions, `info@example.com`, social links.
- `img/testimonial-bg.jpg` looks like a Getty Images stock photo (original filename). Confirm you have a license or replace it.
