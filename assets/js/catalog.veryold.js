async function loadCatalog(){
  const out = document.getElementById("catalogGrid");
  if(!out) return;
  try{
    const res = await fetch("assets/data/catalog.json", { cache: "no-store" });
    const data = await res.json();
    out.innerHTML = (data.items || []).map(item => {
  const category = item.category || "Other";
  const type = (item.type || "Static").toLowerCase();

  return `
    <section class="card">
      <h2>${escapeHtml(item.name || "Item")}</h2>

      <div class="metaRow">
        <span class="catTag">${escapeHtml(category)}</span>
        <span class="typeTag ${type}">
          ${escapeHtml(item.type || "Static")}
        </span>
      </div>

      <div class="kpiGrid" style="margin-top:10px;">
        <div class="kpi">
          <div class="label">Tier</div>
          <div class="value">${escapeHtml(item.tier || "-")}</div>
        </div>
        <div class="kpi">
          <div class="label">Lead Time</div>
          <div class="value">${escapeHtml(item.leadTime || "-")}</div>
        </div>
        <div class="kpi">
          <div class="label">Status</div>
          <div class="value">${escapeHtml(item.status || "-")}</div>
        </div>
      </div>

      <div class="dividerLine"></div>
      <div class="desc" style="margin:0;">
        ${escapeHtml(item.notes || "")}
      </div>
    </section>
  `;
}).join("");
  }catch(e){
    out.innerHTML = `<section class="card"><h2>Catalog</h2><p class="desc">Unable to load catalog.json. If you're running locally, use a simple server (see README).</p></section>`;
  }
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
document.addEventListener("DOMContentLoaded", loadCatalog);
