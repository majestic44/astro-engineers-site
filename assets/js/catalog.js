let allItems = [];
let activeCat = "All";
let activeType = "All";

async function loadCatalog(){
  const out = document.getElementById("catalogGrid");
  if(!out) return;

  try{
    const url = "assets/data/catalog.json";
    const res = await fetch(url, { cache: "no-store" });
    if(!res.ok) throw new Error(`HTTP ${res.status} while fetching ${url}`);

    const data = await res.json();
    allItems = Array.isArray(data.items) ? data.items : [];

    wireFilters();
    render();

  }catch(err){
    console.error("Catalog load failed:", err);
    out.innerHTML = `
      <section class="card" style="grid-column:1/-1;">
        <h2>Catalog</h2>
        <p class="desc">
          Unable to load <span class="tag">assets/data/catalog.json</span>.
          Open DevTools → Console for the exact error.
        </p>
        <p class="desc" style="margin-top:10px;">
          <span class="tag">${escapeHtml(String(err.message || err))}</span>
        </p>
      </section>
    `;
  }
}

function wireFilters(){
  const catWrap = document.getElementById("catFilters");
  const typeWrap = document.getElementById("typeFilters");

  if(catWrap){
    catWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".pill");
      if(!btn) return;
      activeCat = btn.dataset.cat || "All";
      setActive(catWrap, btn);
      render();
    });
  }

  if(typeWrap){
    typeWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".pill");
      if(!btn) return;
      activeType = btn.dataset.type || "All";
      setActive(typeWrap, btn);
      render();
    });
  }
}

function setActive(container, activeEl){
  container.querySelectorAll(".pill").forEach(el => el.classList.remove("active"));
  activeEl.classList.add("active");
}

function render(){
  const out = document.getElementById("catalogGrid");
  if(!out) return;

  const filtered = allItems.filter(it => {
    const cat = (it.category || "Other").toLowerCase();
    const type = (it.type || "Static").toLowerCase();

    const catOk = activeCat === "All" || cat === activeCat.toLowerCase();
    const typeOk = activeType === "All" || type === activeType.toLowerCase();

    return catOk && typeOk;
  });

  if(!filtered.length){
    out.innerHTML = `
      <section class="card" style="grid-column:1/-1;">
        <h2>No results</h2>
        <p class="desc">No catalog items match your current filters.</p>
      </section>
    `;
    return;
  }

  // Group by category for section headers
  const order = ["Factory", "Ships", "Other"];
  const groups = new Map(order.map(k => [k, []]));

  for(const it of filtered){
    const key = normalizeCategory(it.category);
    if(!groups.has(key)) groups.set(key, []);
    groups.get(key).push(it);
  }

  // Render grouped sections
  let html = "";
  for(const cat of order){
    const items = groups.get(cat) || [];
    if(!items.length) continue;

    html += `
      <section class="card" style="grid-column:1/-1;">
        <h2>${escapeHtml(cat)}</h2>
        <p class="desc" style="margin:6px 0 0;">
          ${escapeHtml(categoryDesc(cat))}
        </p>
      </section>
    `;

    html += items.map(renderCard).join("");
  }

  out.innerHTML = html;
}

function categoryDesc(cat){
  if(cat === "Factory") return "Industry builds and production infrastructure.";
  if(cat === "Ships") return "Space-capable ships and variants.";
  return "Tools, services, and other offerings.";
}

function normalizeCategory(cat){
  const c = String(cat || "Other").trim().toLowerCase();
  if(c === "factory" || c === "factories") return "Factory";
  if(c === "ships" || c === "ship") return "Ships";
  return "Other";
}

function fmtQuanta(n){
  if(n === null || n === undefined || n === "") return "";
  const num = Number(n);
  if(Number.isNaN(num)) return "";
  return num.toLocaleString();
}

function renderCard(item){
  const category = normalizeCategory(item.category);
  const typeLabel = (item.type || "Static").trim();
  const typeClass = typeLabel.toLowerCase(); // static | space | dynamic

  const bp = fmtQuanta(item.priceBlueprintQuanta);
  const tk = fmtQuanta(item.priceTokenQuanta);

  const bpBox = bp ? `
    <div class="priceBox">
      <div class="label">Blueprint Only</div>
      <div class="value">${escapeHtml(bp)}
        <img class="qicon spin" src="assets/img/quanta.svg" alt="Quanta">
      </div>
    </div>` : "";

  const tkBox = tk ? `
    <div class="priceBox">
      <div class="label">Token Only</div>
      <div class="value">${escapeHtml(tk)}
        <img class="qicon spin" src="assets/img/quanta.svg" alt="Quanta">
      </div>
    </div>` : "";

  const priceRow = (bpBox || tkBox) ? `<div class="priceRow">${bpBox}${tkBox}</div>` : "";

  return `
    <section class="card">
      <h2>${escapeHtml(item.name || "Item")}</h2>

      <div class="metaRow">
        <span class="catTag">${escapeHtml(category)}</span>
        <span class="typeTag ${escapeHtml(typeClass)}">${escapeHtml(typeLabel)}</span>
      </div>

      <div class="kpiGrid" style="margin-top:10px;">
        <div class="kpi"><div class="label">Tier</div><div class="value">${escapeHtml(item.tier || "-")}</div></div>
        <div class="kpi"><div class="label">Lead Time</div><div class="value">${escapeHtml(item.leadTime || "-")}</div></div>
        <div class="kpi"><div class="label">Status</div><div class="value">${escapeHtml(item.status || "-")}</div></div>
        <div class="kpi"><div class="label">Category</div><div class="value">${escapeHtml(category)}</div></div>
      </div>

      ${priceRow}

      <div class="dividerLine" style="height:1px;background:rgba(255,255,255,.10);margin:12px 0;"></div>
      <div class="desc" style="margin:0;">${escapeHtml(item.notes || "")}</div>
    </section>
  `;
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[c]));
}

document.addEventListener("DOMContentLoaded", loadCatalog);
