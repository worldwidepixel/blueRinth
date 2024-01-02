document.addEventListener('DOMContentLoaded', function () {
    //Add a check mark to the currently selected color
    chrome.storage.sync.get("color").then(result => {
        const button = document.getElementById(result["color"]);
        const child = button.children[0];
        child.style.opacity = '1';
    })
    
    // Get all color buttons
    const colorButtons = document.querySelectorAll('.colour');
    
    // Add click event listener to each button
    colorButtons.forEach(button => {
        button.addEventListener('click', function () {
            
            // Get the id of the clicked button
            const buttonId = button.id;

            // Get rid of the check mark in the previously selected button
            chrome.storage.sync.get("color").then(result => {
                const oldButton = document.getElementById(result["color"]);
                if (oldButton.id != buttonId) {
                    const child = oldButton.children[0];
                    child.style.opacity = '0';
                }
            });

            // Add the check mark to the clicked button
            const selectedButton = document.getElementById(buttonId);
            const child = selectedButton.children[0];
            child.style.opacity = '1';

            // Send a message to the content script in the active tab
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'changeStylesheet', stylesheet: buttonId });
            });

            let pref = {};
            pref["color"] = buttonId;
            chrome.storage.sync.set(pref);
        });
    });
});
