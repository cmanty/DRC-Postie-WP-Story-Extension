// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Fill in your Postie inbox emails and display labels for each category.
const CATEGORIES = [
  { label: "Category Name", email: "postie-address@yourdomain.com" },
  // { label: "Another Category", email: "another@yourdomain.com" },
];

// Fill in the tags that get prepended to the email subject line.
const TYPES = [
  { label: "Type Name", tag: "[TAG]" },
  // { label: "Another Type", tag: "[ANOTHER]" },
];
// ─────────────────────────────────────────────────────────────────────────────

let pageUrl = "";

function populateSelect(id, items, labelKey) {
  const select = document.getElementById(id);
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = JSON.stringify(item);
    option.textContent = item[labelKey];
    select.appendChild(option);
  });
}

function buildMailto() {
  const category = JSON.parse(document.getElementById("category").value);
  const type = JSON.parse(document.getElementById("type").value);
  const title = document.getElementById("title").value.trim();
  const excerpt = document.getElementById("excerpt").value.trim();
  const image = document.getElementById("image").value.trim();

  const subject = `${type.tag} ${title}`;

  const bodyParts = [];
  if (excerpt) bodyParts.push(excerpt);
  if (image) bodyParts.push(`Image: ${image}`);
  if (pageUrl) bodyParts.push(`Source: ${pageUrl}`);
  const body = bodyParts.join("\n\n");

  return `mailto:${encodeURIComponent(category.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  populateSelect("category", CATEGORIES, "label");
  populateSelect("type", TYPES, "label");

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
  });
});
