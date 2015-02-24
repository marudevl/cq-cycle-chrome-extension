function onClickHandler(info, tab) {
    if (info.menuItemId === "edit-item") {
        gotoRawPage("edit");
    } else if (info.menuItemId === "preview-item") {
        gotoRawPage("preview");
    } else if (info.menuItemId === 'disabled-item') {
        gotoRawPage("disabled");
    } else if (info.menuItemId === 'crxde-item') {
        gotoCrxDe();
    } else if (info.menuItemId === 'siteadmin-item') {
        gotoSiteadmin();
    }
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({"title": "edit", "id": "edit-item"});
    chrome.contextMenus.create({"title": "preview", "id": "preview-item"});
    chrome.contextMenus.create({"title": "disabled", "id": "disabled-item"});
    chrome.contextMenus.create({"title": "CRX-DE", "id": "crxde-item"});
    chrome.contextMenus.create({"title": "Siteadmin", "id": "siteadmin-item"});
});
