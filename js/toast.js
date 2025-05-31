function showToast(message, type = "info", duration = 3000) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  const container = document.getElementById("toast-container");
  container.appendChild(toast);

  // Trigger the animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Auto-remove
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => container.removeChild(toast), 300); // after transition
  }, duration);
}
