const sectionTabs = document.querySelectorAll("[data-dashboard-section]");
const mainPanels = document.querySelectorAll("[data-dashboard-panel-main]");

sectionTabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-dashboard-section");

    sectionTabs.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    mainPanels.forEach((p) => p.classList.remove("active"));
    document
      .querySelector(`[data-dashboard-panel-main="${key}"]`)
      ?.classList.add("active");
  });
});
