document.addEventListener("DOMContentLoaded", () => {
  // Load Header
  fetch("../components/header/header.html")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load header");
      return response.text();
    })
    .then((data) => {
      document.getElementById("app-header").innerHTML = data;
      // Initialize Header Logic (e.g., Mobile Menu) if needed
      // initMobileMenu();
    })
    .catch((error) => console.error("Error loading header:", error));

  // Load Footer
  fetch("../components/footer/footer.html")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load footer");
      return response.text();
    })
    .then((data) => {
      document.getElementById("app-footer").innerHTML = data;
    })
    .catch((error) => console.error("Error loading footer:", error));
});
