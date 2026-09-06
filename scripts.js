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

// --- JSON-driven tables ---

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[ch];
  });
}

async function loadTable(file, render) {
  try {
    const res = await fetch(file);
    if (!res.ok) {
      throw new Error(`Failed to load ${file} (${res.status})`);
    }
    render(await res.json());
  } catch (err) {
    console.error(err);
  }
}

function renderRecipes(recipes) {
  const tbody = document.querySelector("#recipes tbody");
  tbody.innerHTML = recipes
    .map(
      (r) => `
        <tr>
          <td data-label="Name">${escapeHtml(r.name)}</td>
          <td data-label="Dates">${escapeHtml(r.date)}</td>
          <td data-label="Link"><a class="link" href="${escapeHtml(r.url)}" target="_blank" rel="noopener">${escapeHtml(r.url)}</a></td>
          <td data-label="Copy"><button class="btn copy-btn" type="button">Copy</button></td>
        </tr>`
    )
    .join("");
}

function renderBuilds(builds) {
  const tbody = document.querySelector("#builds tbody");
  tbody.innerHTML = builds
    .map(
      (b) => `
        <tr>
          <td data-label="Version">${escapeHtml(b.version)}</td>
          <td data-label="Dates">${escapeHtml(b.date)}</td>
          <td data-label="" class="actions-cell">
            <a class="btn btn-download" href="${escapeHtml(b.url)}" download rel="noopener">Download</a>
            <button class="btn copy-btn" type="button">Copy</button>
          </td>
        </tr>`
    )
    .join("");
}

loadTable("data/recipes.json", renderRecipes);
loadTable("data/builds.json", renderBuilds);

// Copy URL button (event delegation): copies the first link href in the row
document.addEventListener("click", (event) => {
  const btn = event.target.closest(".copy-btn");
  if (!btn) {
    return;
  }

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