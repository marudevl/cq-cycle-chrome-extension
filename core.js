/**
 * Created by sam on 2/24/15.
 */
function goto(callback) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        console.log(tabs);
        var currentUrl = tabs[0].url;
        var next = callback(currentUrl);
        if (next != null) {
            chrome.tabs.update(tabs[0].id, {url: next });
        }
    });
}

/**
 * @return  Object with host name (including port) and path of given url
 */
function urlItems(url) {
    url = url.replace(/https?:\/\//, ""); // remove protocol
    var items = {};
    var host = url.match(/(\w+)/)[1];
    var port = url.match(/\w+:(\d+)/)[1];
    items.hostname = host + ":" + port;
    items.path = "/" + url.match(/\w+:\d+\/(.*)/)[1];
    return items;
}

/**
 * @return String path stripped of /crx/de/index.jsp, /siteadmin, /cf , .html elements (if such elements are present)
 */
function contentPage(path) {
    return path.replace("/crx/de/index.jsp#/", "/").replace("/cf#/", "/").replace("/siteadmin#/", "/").replace(/\.html.*/, "");
}

function utilityUrl(url, utility) {
    var items = urlItems(url);
    var page = contentPage(items.path);
    return items.hostname + "/" + utility + "#" + page;
}

function gotoCrxDe() {
    goto(function(currentUrl) {
        return utilityUrl(currentUrl, "crx/de/index.jsp");
    })
}

function gotoSiteadmin() {
    goto(function(currentUrl) {
        return utilityUrl(currentUrl, "siteadmin");
    })
}

function gotoContentFinder() {
    goto(function(currentUrl) {
        return utilityUrl(currentUrl, "cf") + ".html"; // cf needs .html
    })
}

function gotoRawPage(mode) {
    goto(function(currentUrl) {
        if (mode !== undefined) {
            chrome.cookies.set({'url': currentUrl,
                'name': 'wcmmode',
                'value': mode.toUpperCase(),
                'path': '/',
                'expirationDate': 1551207160000 // 2017
            });
        }
        var items = urlItems(currentUrl);
        var page = contentPage(items.path);
        return items.hostname + page + ".html";
    })
}

function cycle() {
    // TODO: rm nested goto()
    goto(function(currentUrl) {
        if (currentUrl.match(".*/crx/de/index.jsp#/.*")) { // crx-de => siteadmin
            gotoSiteadmin();
        } else if (currentUrl.match(".*/siteadmin#/.*")) { // siteadmin => direct
            gotoRawPage();
        } else if (currentUrl.match(".*/cf#/content/.*")) { // content finder => crx/de
            gotoCrxDe();
        } else if (currentUrl.match(".*/content/.*")) { // direct => content finder
            gotoContentFinder();
        } else {
            // stay on page.
        }
    });
}
