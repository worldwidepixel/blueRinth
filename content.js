// content.js
let pageSupportsBanners = false;
const fallbackimage = chrome.runtime.getURL("img/fallback-banner.png");
let banner = fallbackimage;
let currentUrl = window.location.href;

setInterval(checkUrlChange, 500);

async function checkUrlChange() {
  //console.log(window.location.href, currentUrl);
  const pageregex = new RegExp(
    "(/mod/|/plugin/|/shader/|/modpack/|/datapack/|/resourcepack/)"
  );
  if (window.location.href != currentUrl) {
    currentUrl = window.location.href;
    //.log("PAGE CHANGE");
    if (pageregex.test(window.location.href)) {
      //console.log("ALLOWED URL");
      setTimeout(function () {
        runBanner();
      }, 1000);
    } else {
      document.getElementsByClassName("banner-container")[0].style.opacity = 0;
      document.body.removeChild(
        document.getElementsByClassName("banner-container")[0]
      );
    }
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "changeStylesheet") {
    changeStylesheet(request.stylesheet);
  }
});

chrome.storage.sync.get("color").then((result) => {
  changeStylesheet(result["color"]);
});

document.onreadystatechange = async function () {
  var isEasterEggActive = await chrome.storage.sync.get(["easterEgg"]);

  if (document.readyState == "complete") {
    console.log(await isEasterEggActive["easterEgg"]);

    var mrLogoSvg = "";

    fetch(chrome.runtime.getURL(`img/easter_eggs/nineminecraft.svg`))
      .then((response) => response.text())
      .then((data) => {
        mrLogoSvg = data;
      });

    setTimeout(function () {
      if (isEasterEggActive["easterEgg"] == true) {
        //document.getElementsByClassName('text-logo')[0].innerHTML = mrLogoSvg;
        var newLogo = document.createElement("svg");
        newLogo.innerHTML = mrLogoSvg;
        document.getElementsByClassName("text-logo")[0].replaceWith(newLogo);
      }
    }, 200);

    runBanner();
    const designChanges = document.createElement("link");
    designChanges.rel = "stylesheet";
    designChanges.href = chrome.runtime.getURL(`css/design.css`);
    designChanges.id = "dynamicStylesheet";
    document.head.appendChild(designChanges);
  }
};

async function runBanner() {
  let pageUrl = window.location.href;
  const pageregex = new RegExp(
    "(/mod/|/plugin/|/shader/|/modpack/|/datapack/|/resourcepack/)"
  );
  const subpageregex = new RegExp(
    "(/gallery/|/changelog/|/versions/|/moderation/)"
  );
  if (pageregex.test(pageUrl)) {
    pageSupportsBanners = true;
    const apibase = "https://api.modrinth.com/v3/project/";
    if (pageUrl.slice(-1) === "/") {
      pageUrl = pageUrl.substring(0, pageUrl.length - 1);
    }
    let apiSteps = pageUrl.split("/");
    let projectSlug = "";
    if (subpageregex.test(pageUrl)) {
      projectSlug = apiSteps[apiSteps.length - 2];
    } else {
      projectSlug = apiSteps[apiSteps.length - 1];
    }
    console.log(projectSlug);
    try {
      const response = await fetch(apibase + projectSlug);
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      for (i = 0; i < data.gallery.length; i++) {
        if (data.gallery[i].featured === true) {
          banner = data.gallery[i].url;
          applyBanners();
        }
      }
    } catch {}
  }
  console.log(banner);
}

function applyBanners() {
  if (pageSupportsBanners) {
    const bannerContainer = document.createElement("div");
    const bannerMeta = document.createElement("link");
    bannerMeta.rel = "stylesheet";
    bannerMeta.href = chrome.runtime.getURL(`css/banners.css`);
    bannerMeta.id = "dynamicStylesheet";
    document.head.appendChild(bannerMeta);
    const bannerStyles = document.createElement("style");
    bannerStyles.innerHTML = `
.banner-image {
  background-image: linear-gradient(0deg, var(--color-bg) 0%, rgba(0, 0, 0, 0) 200%), url(${banner}) !important;
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

function changeStylesheet(stylesheet) {
  const existingStyles = document.getElementById("dynamicStylesheet");
  if (existingStyles) {
    existingStyles.remove();
  }

  // Apply new stylesheet to the webpage from the extension context
  const newStylesheet = document.createElement("link");
  newStylesheet.rel = "stylesheet";
  newStylesheet.href = chrome.runtime.getURL(`css/${stylesheet}.css`);
  newStylesheet.id = "dynamicStylesheet";
  document.head.appendChild(newStylesheet);
}
