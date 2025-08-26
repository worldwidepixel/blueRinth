// Injected content: inject your injected.js as before
const script = document.createElement("script");
script.setAttribute("type", "module");
script.setAttribute("src", chrome.runtime.getURL("injected.js"));
(document.head || document.documentElement).appendChild(script);

// Theme switching: toggles a class on <body>, does not inject any <link> or <style>
function setThemeClass(theme) {
  document.body.classList.remove(
    "theme-blue",
    "theme-green",
    "theme-orange",
    "theme-pastelblue",
    "theme-pastelgreen",
    "theme-pastelorange",
    "theme-pastelpurple",
    "theme-pastelred",
    "theme-pastelyellow",
    "theme-purple",
    "theme-red",
    "theme-yellow",
    "theme-nineminecraft"
  );
  if (theme && theme !== "green") {
    document.body.classList.add(`theme-${theme}`);
  }
}

// On load, apply user's chosen theme
chrome.storage.sync.get("color").then((result) => {
  setThemeClass(result["color"]);
});

// Listen for theme changes
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "changeStylesheet") {
    setThemeClass(request.stylesheet);
  }
});

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
