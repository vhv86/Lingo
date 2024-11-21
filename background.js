let tabId = null;
let gptTabId = null;
chrome.runtime.onInstalled.addListener(() => {
    // Create a context menu item
    chrome.contextMenus.create({
        id: "Lookup_in_Cambridge_dictionary",
        title: "Look up in Cambridge dictionary",
        contexts: ["selection"] // Show this menu only when text is selected
    });

    chrome.contextMenus.create({
        id: "Add_to_dictionary",
        title: "Add to my IPA list",
        contexts: ["selection"] // Show this menu only when text is selected
    });

    chrome.contextMenus.create({
        id: "Ask_ChatGPT",
        title: "Ask ChatGPT",
        contexts: ["selection"] // Show this menu only when text is selected
    });
});


// Clean up the tab ID if the tab is closed
chrome.tabs.onRemoved.addListener((closedTabId) => {
    if (closedTabId === tabId) {
        tabId = null; // Reset the stored tab ID
    }
});

function createTab(url) {
    chrome.tabs.create({ url }, (tab) => {
        tabId = tab.id; // Store the tab ID
    });
}

function createGptTab(url) {
    chrome.tabs.create({ url }, (tab) => {
        gptTabId = tab.id; // Store the tab ID
    });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "Lookup_in_Cambridge_dictionary") {
        const url = `https://dictionary.cambridge.org/dictionary/english/${info.selectionText}`;
        // Reuse or create the search tab
        if (tabId) {
            chrome.tabs.get(tabId, (existingTab) => {
                if (chrome.runtime.lastError || !existingTab) {
                    createTab(url);
                } else {
                    chrome.tabs.update(tabId, { url: url, active: true });
                }
            });
        } else {
            createTab(url);
        }
    }
    else if (info.menuItemId === "Ask_ChatGPT") {
        let prompt = "Give me IPA of this word and its meaning in vietnamese: [ " + info.selectionText + "]";

        const url = `https://chat.openai.com/?model=gpt-4&conversation_id=673f235e-0a44-8002-b419-2f1e39880208&q=${encodeURIComponent(prompt)}`;
        // Reuse or create the search tab
        if (gptTabId) {
            chrome.tabs.get(gptTabId, (existingTab) => {
                if (chrome.runtime.lastError || !existingTab) {
                    createGptTab(url);
                } else {
                    chrome.tabs.update(gptTabId, { url: url, active: true });
                }
            });
        } else {
            createGptTab(url);
        }
    }

});