// content.js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'changeStylesheet') {
        changeStylesheet(request.stylesheet);
    }
});

console.log(browser.storage.sync.get("color"));
browser.storage.sync.get("color").then(result => {
    changeStylesheet(result["color"]);
})

function changeStylesheet(stylesheet) {
    const existingStyles = document.getElementById('dynamicStylesheet');
        if (existingStyles) {
            existingStyles.remove();
        }

        // Apply new stylesheet to the webpage from the extension context
        const newStylesheet = document.createElement('link');
        newStylesheet.rel = 'stylesheet';
        newStylesheet.href = chrome.runtime.getURL(`css/${stylesheet}.css`);
        newStylesheet.id = 'dynamicStylesheet';
        document.head.appendChild(newStylesheet);
}
