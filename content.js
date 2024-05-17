// content.js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'changeStylesheet') {
        changeStylesheet(request.stylesheet);
    }
});

chrome.storage.sync.get("color").then(result => {
    changeStylesheet(result["color"]);
})

document.onreadystatechange = async function () {

    var isEasterEggActive = await chrome.storage.sync.get(["easterEgg"]);

    if (document.readyState == "complete" ) {
        console.log(await isEasterEggActive['easterEgg']);

        var mrLogoSvg = '';

        fetch(chrome.runtime.getURL(`img/easter_eggs/nineminecraft.svg`))
            .then(response => response.text())
            .then((data) => {
            mrLogoSvg = data;
        })

        setTimeout(function(){ 

            if (isEasterEggActive['easterEgg'] == true) {

                //document.getElementsByClassName('text-logo')[0].innerHTML = mrLogoSvg;
                var newLogo = document.createElement('svg');
                newLogo.innerHTML = mrLogoSvg;
                document.getElementsByClassName('text-logo')[0].replaceWith(newLogo);

            }
        }, 200);  
        
}};

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
