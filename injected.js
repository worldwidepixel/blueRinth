document.onreadystatechange = function () {
  const projectRegex =
    /^https?:\/\/modrinth\.com\/(?:project|mod|resourcepack|shader|datapack|modpack)\/([^\/]+)/;
  const projectIdTest = projectRegex.exec(window.location.href);
  const projectId =
    projectIdTest != null && projectIdTest.length > 1 ? projectIdTest[1] : null;
  if (projectId !== null) {
    runBanner(projectId);
    return;
  }
  pageSupportsBanners = false;
};

useNuxtApp()._middleware.global.push(function handleRoute(to, from) {
  if (to.name.startsWith("type-id")) {
    const { id } = to.params;
    console.log("entering project", id);
    runBanner(id);
  } else if (from.name && from.name.startsWith("type-id")) {
    const { id } = from.params;
    //console.log("leaving project", id);
    const containers = document.getElementsByClassName("banner-container");
    for (let container of containers) {
      document.body.removeChild(container);
    }
    pageSupportsBanners = false;
  }
});

let pageSupportsBanners = false;
const fallbackimage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAnSURBVHhe7cEBDQAAAMKg909tDjcgAAAAAAAAAAAAAAAAAAAA4FwNQEAAAQtzTh0AAAAASUVORK5CYII=";
let banner = fallbackimage;

async function runBanner(id) {
  console.log("runBanner called with id:", id);
  pageSupportsBanners = true;
  const apibase = "https://api.modrinth.com/v3/project/";

  try {
    const response = await fetch(apibase + id);
    if (!response.ok) {
      console.error("blueRinth: Response failed during banner loading.");
      return;
    }
    const data = await response.json();
    console.log("Project API data:", data);
    console.log("gallery:", data.gallery);
    data.gallery.forEach((entry) => {
      if (entry.featured === true) {
        banner = entry.url;
        applyBanners();
      }
    });
  } catch {
    console.error(
      "blueRinth: Something failed during banner loading. Please contact WorldWidePixel."
    );
  }
}

function applyBanners() {
  console.log("applyBanners called, banner:", banner);
  if (pageSupportsBanners) {
    const bannerContainer = document.createElement("div");
    const bannerStyles = document.createElement("style");
    bannerStyles.innerHTML = `
  .banner-image {
    background-image:
    linear-gradient(0deg, var(--color-bg) 0%, rgba(0, 0, 0, 0) 200%),
    url(${banner}) !important;
  }
  `;
    document.head.appendChild(bannerStyles);
    bannerContainer.classList.add("banner-container");
    const bannerImage = document.createElement("div");
    bannerImage.classList.add("banner-image");
    bannerContainer.appendChild(bannerImage);
    const bannerBg = document.createElement("div");
    bannerBg.classList.add("banner-bg");
    document.body.appendChild(bannerBg);
    document.body.appendChild(bannerContainer);
    bannerContainer.style.opacity = "100%";
  }
}
