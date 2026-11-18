(() => {
  "use strict";

  const CART_KEY = "furnish-cart";
  const money = (n) => "$" + n.toFixed(2);

  /* ---------- Storage helpers (safe if storage is blocked) ---------- */
  const loadCart = () => {
    try {
      const data = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  };
  const saveCart = (cart) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      /* ignore */
    }
  };

  let cart = loadCart();

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------- Cart dialog ---------- */
  const dialog = document.createElement("dialog");
  dialog.className = "cart-dialog";
  dialog.setAttribute("aria-labelledby", "cart-title");
  dialog.innerHTML = `
    <div class="cart-dialog__inner">
      <div class="cart-dialog__head">
        <h2 id="cart-title">Your cart</h2>
        <button type="button" class="icon-btn" data-close aria-label="Close cart">&times;</button>
      </div>
      <div id="cart-body"></div>
    </div>`;
  document.body.appendChild(dialog);
  const cartBody = dialog.querySelector("#cart-body");

  const countEl = document.querySelector("[data-cart-count]");

  const render = () => {
    const qty = cart.reduce((sum, i) => sum + i.qty, 0);
    if (countEl) countEl.textContent = qty;

    if (!cart.length) {
      cartBody.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      return;
    }
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    cartBody.innerHTML = `
      <ul class="cart-list">
        ${cart
          .map(
            (i) => `
          <li class="cart-item">
            <strong></strong>
            <span>${money(i.price * i.qty)}</span>
            <div class="cart-item__actions">
              <button type="button" class="qty-btn" data-dec="${i.id}" aria-label="Decrease quantity">&minus;</button>
              <span aria-live="polite">${i.qty}</span>
              <button type="button" class="qty-btn" data-inc="${i.id}" aria-label="Increase quantity">+</button>
              <button type="button" class="link-btn" data-remove="${i.id}">Remove</button>
            </div>
          </li>`
          )
          .join("")}
      </ul>
      <div class="cart-total"><span>Total</span><span>${money(total)}</span></div>
      <button type="button" class="btn btn--accent" data-checkout style="width:100%">Checkout</button>`;
    // Set names via textContent (avoids injecting HTML)
    cartBody.querySelectorAll(".cart-item strong").forEach((el, idx) => {
      el.textContent = cart[idx].name;
    });
  };

  const change = (id, delta) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
    saveCart(cart);
    render();
  };

  dialog.addEventListener("click", (e) => {
    const t = e.target;
    if (t === dialog || t.closest("[data-close]")) return dialog.close();
    if (t.dataset.inc) change(t.dataset.inc, 1);
    if (t.dataset.dec) change(t.dataset.dec, -1);
    if (t.dataset.remove) {
      cart = cart.filter((i) => i.id !== t.dataset.remove);
      saveCart(cart);
      render();
    }
    if (t.hasAttribute("data-checkout")) {
      // TODO: connect to a real checkout / payment provider.
      alert("Checkout is not connected yet. Add your payment provider here.");
    }
  });

  document.querySelectorAll("[data-cart-open]").forEach((btn) =>
    btn.addEventListener("click", () => {
      render();
      if (typeof dialog.showModal === "function") dialog.showModal();
    })
  );

  document.querySelectorAll("[data-add-to-cart]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const { id, name, price } = btn.dataset;
      const existing = cart.find((i) => i.id === id);
      if (existing) existing.qty += 1;
      else cart.push({ id, name, price: Number(price), qty: 1 });
      saveCart(cart);
      render();
      const original = btn.textContent;
      btn.textContent = "Added \u2713";
      setTimeout(() => (btn.textContent = original), 1200);
    })
  );

  render();

  /* ---------- Forms (front-end only) ---------- */
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const newsletter = document.querySelector("[data-newsletter]");
  if (newsletter) {
    newsletter.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsletter.querySelector("input[type=email]");
      const msg = newsletter.parentElement.querySelector(".form-msg");
      if (!isEmail(input.value.trim())) {
        msg.textContent = "Please enter a valid email address.";
        input.focus();
        return;
      }
      // TODO: send to your email service (Mailchimp, etc.)
      msg.textContent = "Thanks for subscribing!";
      newsletter.reset();
    });
  }

  const contact = document.querySelector("[data-contact]");
  if (contact) {
    contact.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!contact.reportValidity()) return;
      const msg = contact.querySelector(".form-msg");
      // TODO: send to your backend / form service (Formspree, etc.)
      msg.textContent = "Thank you! We received your message and will reply soon.";
      contact.reset();
    });
  }
})();
