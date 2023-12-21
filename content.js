// content.js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'changeStylesheet') {
        // Remove existing styles
        const existingStyles = document.getElementById('dynamicStylesheet');
        if (existingStyles) {
            existingStyles.remove();
        }

        // Apply new stylesheet to the webpage from the extension context
        const newStylesheet = document.createElement('link');
        newStylesheet.rel = 'stylesheet';
        newStylesheet.href = chrome.runtime.getURL(`css/${request.stylesheet}.css`);
        newStylesheet.id = 'dynamicStylesheet';
        document.head.appendChild(newStylesheet);
    }
});
