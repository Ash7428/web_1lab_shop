import { getCart, calcTotals, clearCart } from "./cart.js";

export function initOrder(onCartChanged) {
  const dialog = document.getElementById("orderDialog");
  const openBtn = document.getElementById("openOrder");
  const closeBtn = document.getElementById("closeOrder");
  const form = document.getElementById("orderForm");
  const success = document.getElementById("orderSuccess");

  openBtn.addEventListener("click", () => {
    const totals = calcTotals(getCart());
    if (totals.count === 0) {
      alert("Корзина пуста");
      return;
    }

    success.hidden = true;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  });

  closeBtn.addEventListener("click", () => {
    dialog.close?.();
    dialog.removeAttribute("open");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // показать сообщение
    success.hidden = false;

    // очистить корзину
    clearCart();
    onCartChanged?.();

    // закрыть и сбросить форму
    setTimeout(() => {
      dialog.close?.();
      dialog.removeAttribute("open");
      form.reset();
      success.hidden = true;
    }, 800);
  });
}
