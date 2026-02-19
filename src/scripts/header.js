const searchInput = document.getElementById("pmSearch");

window.addEventListener("keydown", (e) => {
  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const isCmdK = isMac && e.metaKey && e.key.toLowerCase() === "k";
  const isCtrlK = !isMac && e.ctrlKey && e.key.toLowerCase() === "k";

  if (isCmdK || isCtrlK) {
    e.preventDefault();
    searchInput?.focus();
  }
});
