import { products } from "./products.js";
import { getCart, addToCart, removeFromCart, setQty, calcTotals } from "./cart.js";
import { initOrder } from "./order.js";

const productGrid = document.getElementById("productGrid");
const cartList = document.getElementById("cartList");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartTotal2 = document.getElementById("cartTotal2");

const cartCountBtn = document.getElementById("cartCountBtn");

const cartDialog = document.getElementById("cartDialog");
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");

const cartListModal = document.getElementById("cartListModal");
const cartTotalModal = document.getElementById("cartTotalModal");

const openOrderFromCart = document.getElementById("openOrderFromCart");
const openOrderBtn = document.getElementById("openOrder");



function renderCatalog() {
  productGrid.innerHTML = products.map(p => `
  <article class="card">
    <img class="card-img" src="${p.image}" alt="${p.alt ?? p.title}" loading="lazy">
    <h3>${p.title}</h3>
    <p>Цена: <b>${p.price}</b> ₽</p>
    <button data-add="${p.id}" type="button">Добавить в корзину</button>
  </article>
`).join("");


  productGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;

    const id = Number(btn.dataset.add);
    const product = products.find(x => x.id === id);
    if (!product) return;

    const cart = addToCart(product);
    renderCart(cart);
  });
}

/*
function renderCart(cart = getCart()) {
  const items = Object.values(cart);

  cartList.innerHTML = items.length
    ? items.map(it => `
        <li class="cart-item">
          <div>
            <div><b>${it.title}</b></div>
            <div>${it.price} ₽ × ${it.qty} = <b>${it.price * it.qty}</b> ₽</div>
          </div>

          <div class="cart-controls">
            <input class="qty" type="number" min="1" value="${it.qty}" data-qty="${it.id}">
            <button type="button" data-del="${it.id}">Удалить</button>
          </div>
        </li>
      `).join("")
    : `<li>Корзина пуста</li>`;

  const totals = calcTotals(cart);
  cartCount.textContent = String(totals.count);
  cartTotal.textContent = String(totals.total);
  cartTotal2.textContent = String(totals.total);
}
*/

function renderCart(cart = getCart()) {
  const items = Object.values(cart);

  const html = items.length
    ? items.map(it => `
        <li class="cart-item">
          <div>
            <div><b>${it.title}</b></div>
            <div>${it.price} ₽ × ${it.qty} = <b>${it.price * it.qty}</b> ₽</div>
          </div>

          <div class="cart-controls">
            <input class="qty" type="number" min="1" value="${it.qty}" data-qty="${it.id}">
            <button type="button" data-del="${it.id}">Удалить</button>
          </div>
        </li>
      `).join("")
    : `<li>Корзина пуста</li>`;

  // рисуем в боковой корзине
  cartList.innerHTML = html;

  // и в модалке
  if (cartListModal) cartListModal.innerHTML = html;

  if (cartListModal) {
  cartListModal.addEventListener("click", (e) => {
    const del = e.target.closest("[data-del]");
    if (!del) return;

    const id = Number(del.dataset.del);
    const cart = removeFromCart(id);
    renderCart(cart);
  });

  cartListModal.addEventListener("input", (e) => {
    const inp = e.target.closest("[data-qty]");
    if (!inp) return;

    const id = Number(inp.dataset.qty);
    const qty = Number(inp.value);
    const cart = setQty(id, qty);
    renderCart(cart);
  });
}

if (openCart) {
  openCart.addEventListener("click", () => {
    // если пусто — можно все равно открывать, но я оставлю открытие
    if (typeof cartDialog.showModal === "function") cartDialog.showModal();
    else cartDialog.setAttribute("open", "");
  });
}

if (closeCart) {
  closeCart.addEventListener("click", () => {
    cartDialog.close?.();
    cartDialog.removeAttribute("open");
  });
}

if (openOrderFromCart) {
  openOrderFromCart.addEventListener("click", () => {
    // закрываем корзину и открываем заказ
    cartDialog.close?.();
    cartDialog.removeAttribute("open");
    openOrderBtn.click();
  });
}



  const totals = calcTotals(cart);
  cartCount.textContent = String(totals.count);
  cartTotal.textContent = String(totals.total);
  cartTotal2.textContent = String(totals.total);

  if (cartCountBtn) cartCountBtn.textContent = String(totals.count);
  if (cartTotalModal) cartTotalModal.textContent = String(totals.total);
}



cartList.addEventListener("click", (e) => {
  const del = e.target.closest("[data-del]");
  if (!del) return;

  const id = Number(del.dataset.del);
  const cart = removeFromCart(id);
  renderCart(cart);
});

cartList.addEventListener("input", (e) => {
  const inp = e.target.closest("[data-qty]");
  if (!inp) return;

  const id = Number(inp.dataset.qty);
  const qty = Number(inp.value);
  const cart = setQty(id, qty);
  renderCart(cart);
});

renderCatalog();
renderCart();
initOrder(() => renderCart());
