// Menu tabs: toggles between Recipes and Build panels
document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.dataset.target;

    // Update menu active states
    document.querySelectorAll(".menu-item").forEach((el) => {
      const active = el === item;
      el.classList.toggle("is-active", active);
      el.setAttribute("aria-selected", String(active));
    });

    // Show only the matching panel
    document.querySelectorAll(".panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === target);
    });
  });
});

// Copy URL button: copies the link href of the same row to the clipboard
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const row = btn.closest("tr");
    const link = row.querySelector("a");

    if (!link) {
      return;
    }

    const copy = async () => {
      try {
        await navigator.clipboard.writeText(link.href);
      } catch (err) {
        // Fallback for older browsers / non-secure contexts
        const textarea = document.createElement("textarea");
        textarea.value = link.href;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
    };

    copy().then(() => {
      const original = btn.textContent;
      btn.classList.add("copied");
      btn.textContent = "Copied!";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.textContent = original;
      }, 1500);
    });
  });
});