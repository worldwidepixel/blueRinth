document.addEventListener('DOMContentLoaded', function () {
    // Get all color buttons
    const colorButtons = document.querySelectorAll('.colour');
    
    // Add click event listener to each button
    colorButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Get the id of the clicked button
            const buttonId = button.id;

            // Send a message to the content script in the active tab
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'changeStylesheet', stylesheet: buttonId });
            });

            let pref = {};
            pref["color"] = buttonId;
            chrome.storage.sync.set(pref); //chrome
        });
    });
});
