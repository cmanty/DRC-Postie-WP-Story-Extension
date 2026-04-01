// ─── CONFIG ──────────────────────────────────────────────────────────────────
const CONFIG_URL = "https://dfwinteractive.com/wp-content/uploads/DRCtoPostieCategories/drc-postie-config.json";
// ─────────────────────────────────────────────────────────────────────────────

let pageUrl = "";

function populateTypes(types) {
  const container = document.getElementById("type-options");
  container.innerHTML = "";
  types.forEach((item) => {
    const label = document.createElement("label");
    label.className = "checkbox-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = JSON.stringify(item);
    label.appendChild(input);
    label.appendChild(document.createTextNode(item.label));
    container.appendChild(label);
  });
}

function populateCategories(categories) {
  const select = document.getElementById("category");
  categories.forEach((item) => {
    const option = document.createElement("option");
    option.value = JSON.stringify(item);
    option.textContent = item.label;
    select.appendChild(option);
  });
}

function buildMailto() {
  const category = JSON.parse(document.getElementById("category").value);
  const checkedBoxes = document.querySelectorAll("#type-options input[type=checkbox]:checked");
  const selectedTags = Array.from(checkedBoxes).map((o) => JSON.parse(o.value).tag);
  const title = document.getElementById("title").value.trim();
  const excerpt = document.getElementById("excerpt").value.trim();

  const subject = `${selectedTags.join(" ")} ${title}`;

  const bodyParts = [];
  if (excerpt) bodyParts.push(excerpt);
  if (pageUrl) bodyParts.push(`${pageUrl}`);
  bodyParts.push(":end");
  const body = bodyParts.join("\n\n");

  return `mailto:${encodeURIComponent(category.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  fetch(CONFIG_URL)
    .then((res) => res.json())
    .then((categories) => {
      populateCategories(categories);
      populateTypes(categories[0].types);

      document.getElementById("category").addEventListener("change", (e) => {
        const category = JSON.parse(e.target.value);
        populateTypes(category.types);
      });
    })
    .catch(() => {
      document.getElementById("category").innerHTML = "<option>Failed to load</option>";
      document.getElementById("type").innerHTML = "<option>Failed to load</option>";
    });

  // Query the last focused non-popup window to get the article tab,
  // since this page runs in its own detached popup window.
  chrome.tabs.query({ active: true, windowType: "normal" }, (tabs) => {
    if (tabs[0]) {
      pageUrl = tabs[0].url || "";
      document.getElementById("title").value = tabs[0].title || "";
    }
  });

  document.getElementById("send").addEventListener("click", () => {
    const mailto = buildMailto();
    window.open(mailto, "_self");
    window.close();
  });
});
