// Injected content

const script = document.createElement("script");
script.setAttribute("type", "module");
script.setAttribute("src", chrome.runtime.getURL("injected.js"));

const head =
  document.head ||
  document.getElementsByTagName("head")[0] ||
  document.documentElement;
head.insertBefore(script, head.lastChild);

// Non-injected content

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "changeStylesheet") {
    changeStylesheet(request.stylesheet);
  }
});

chrome.storage.sync.get("color").then((result) => {
  changeStylesheet(result["color"]);
});

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

// Design changes

document.onreadystatechange = async function () {
  if (document.readyState == "complete") {
    const designChanges = document.createElement("link");
    designChanges.rel = "stylesheet";
    designChanges.href = chrome.runtime.getURL(`css/design.css`);
    designChanges.id = "dynamicStylesheet";
    document.head.appendChild(designChanges);
    const bannerMeta = document.createElement("link");
    bannerMeta.rel = "stylesheet";
    bannerMeta.href = chrome.runtime.getURL(`css/banners.css`);
    bannerMeta.id = "bannerStyles";
    document.head.appendChild(bannerMeta);
  }
};
