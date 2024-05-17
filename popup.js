document.addEventListener('DOMContentLoaded', function () {

    var easterEggClicks = 0;
    var logoButton = document.getElementById('logoButton');
    var easterEggActive = false;

    chrome.storage.sync.get("easterEgg").then(result => {
        if (result["easterEgg"] == true) {
            loadEasterEggTrue();
        } else {
            loadEasterEggFalse();
        }
    })

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
                try {
                    const oldButton = document.getElementById(result["color"]);
                    if (oldButton.id != buttonId) {
                        const child = oldButton.children[0];
                        child.style.opacity = '0';
                    }
                } catch {
                    
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

    logoButton.addEventListener('click', async function () {
        var isEasterEggActive = await chrome.storage.sync.get(["easterEgg"])
        console.log(await isEasterEggActive['easterEgg']);
        if (easterEggClicks < 5) {
            easterEggClicks++;
            console.log(easterEggClicks);
        } else if (easterEggClicks === 5 && await isEasterEggActive['easterEgg'] == false) {
            logoButton.classList.add("activeEasterEggImg");
            logoButton.classList.remove("easterEggImg");
            easterEggClicks = 0;
            easterEggActive = true;
            let pref = {};
            pref["easterEgg"] = easterEggActive;
            chrome.storage.sync.set(pref);

            if (chrome.storage.sync.get(["color"]) != 'nineMinecraft') {
                let prevColourPref = {};
                prevColourPref["prevColour"] = chrome.storage.sync.get(["color"]);
                chrome.storage.sync.set(prevColourPref);
            }

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'changeStylesheet', stylesheet: 'nineMinecraft' });
            });

            let colourPref = {};
            colourPref["color"] = 'nineMinecraft';
            chrome.storage.sync.set(colourPref);
            
        } else if (easterEggClicks === 5 && await isEasterEggActive['easterEgg'] == true) {
            logoButton.classList.remove("activeEasterEggImg");
            logoButton.classList.add("easterEggImg");
            easterEggClicks = 0;
            easterEggActive = false;
            let pref = {};
            pref["easterEgg"] = easterEggActive;
            chrome.storage.sync.set(pref);

            var prevColourPref = chrome.storage.sync.get(["prevColour"]);

            let colourPref = {};
            colourPref["color"] = prevColourPref;
            chrome.storage.sync.set(colourPref);
        };
    });

    function loadEasterEggTrue() {
        logoButton.classList.add("activeEasterEggImg");
        logoButton.classList.remove("easterEggImg");
    }

    function loadEasterEggFalse() {
        logoButton.classList.remove("activeEasterEggImg");
        logoButton.classList.add("easterEggImg");
    }

    async function getEasterEgg() {
        chrome.storage.sync.get("easterEgg").then(result => {
            return result["easterEgg"];
        })
    }
});
