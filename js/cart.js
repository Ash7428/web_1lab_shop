const STORAGE_KEY = "cart";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function writeCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function getCart() {
  return readCart();
}

export function addToCart(product) {
  const cart = readCart();
  const key = String(product.id);

  if (!cart[key]) cart[key] = { ...product, qty: 1 };
  else cart[key].qty += 1;

  writeCart(cart);
  return cart;
}

export function removeFromCart(productId) {
  const cart = readCart();
  delete cart[String(productId)];
  writeCart(cart);
  return cart;
}

export function setQty(productId, qty) {
  const cart = readCart();
  const key = String(productId);
  if (!cart[key]) return cart;

  const safeQty = Number.isFinite(qty) ? Math.trunc(qty) : 1;

  if (safeQty <= 0) delete cart[key];
  else cart[key].qty = safeQty;

  writeCart(cart);
  return cart;
}

export function clearCart() {
  writeCart({});
}

export function calcTotals(cart) {
  const items = Object.values(cart);
  const count = items.reduce((s, it) => s + it.qty, 0);
  const total = items.reduce((s, it) => s + it.qty * it.price, 0);
  return { count, total };
}
