const POPUP_ROOT_ID = "reportit-popup-root";

const ensureRoot = () => {
  let root = document.getElementById(POPUP_ROOT_ID);

  if (!root) {
    root = document.createElement("div");
    root.id = POPUP_ROOT_ID;
    document.body.appendChild(root);
  }

  return root;
};

const getTone = (message) => {
  const text = String(message).toLowerCase();

  if (text.includes("failed") || text.includes("error") || text.includes("denied") || text.includes("not found")) {
    return "error";
  }

  if (text.includes("deleted") || text.includes("logout")) {
    return "warning";
  }

  return "success";
};

export const showAppPopup = (message) => {
  const root = ensureRoot();
  const popup = document.createElement("div");
  const tone = getTone(message);
  const icon = document.createElement("div");
  const text = document.createElement("div");

  popup.className = `reportit-app-popup reportit-app-popup-${tone}`;
  icon.className = "reportit-app-popup-icon";
  icon.innerHTML = '<span class="reportit-mini-logo">R<span>It</span></span>';
  text.className = "reportit-app-popup-message";
  text.textContent = String(message);
  popup.append(icon, text);

  root.appendChild(popup);

  window.setTimeout(() => {
    popup.classList.add("is-leaving");
    window.setTimeout(() => popup.remove(), 250);
  }, 2600);
};

export const showAppConfirm = (message) => {
  const root = ensureRoot();
  const popup = document.createElement("div");
  const icon = document.createElement("div");
  const text = document.createElement("div");
  const actions = document.createElement("div");
  const cancelButton = document.createElement("button");
  const confirmButton = document.createElement("button");

  popup.className = "reportit-app-popup reportit-app-confirm reportit-app-popup-warning";
  icon.className = "reportit-app-popup-icon";
  icon.innerHTML = '<span class="reportit-mini-logo">R<span>It</span></span>';
  text.className = "reportit-app-popup-message";
  text.textContent = String(message);
  actions.className = "reportit-app-confirm-actions";
  cancelButton.type = "button";
  cancelButton.className = "reportit-app-confirm-btn reportit-app-confirm-cancel";
  cancelButton.textContent = "Cancel";
  confirmButton.type = "button";
  confirmButton.className = "reportit-app-confirm-btn reportit-app-confirm-ok";
  confirmButton.textContent = "Yes";
  actions.append(cancelButton, confirmButton);
  popup.append(icon, text, actions);
  root.appendChild(popup);

  return new Promise((resolve) => {
    const close = (value) => {
      popup.classList.add("is-leaving");
      window.setTimeout(() => popup.remove(), 220);
      resolve(value);
    };

    cancelButton.addEventListener("click", () => close(false), { once: true });
    confirmButton.addEventListener("click", () => close(true), { once: true });
  });
};

export const installAppPopups = () => {
  window.__reportItPopupsInstalled = true;
  window.__reportItShowPopup = showAppPopup;
  window.__reportItShowConfirm = showAppConfirm;
  window.alert = showAppPopup;
  window.confirm = () => false;
  globalThis.alert = showAppPopup;
  globalThis.confirm = () => false;

  const queuedMessages = window.__reportItPopupQueue || [];
  window.__reportItPopupQueue = [];
  queuedMessages.forEach(showAppPopup);
};
