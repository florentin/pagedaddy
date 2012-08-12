var storage = chrome.storage.sync;

function getHost(url) {
	var a = document.createElement('a');
	a.href = url;
	return a.hostname.replace('www.', '');
}

function checkForValidUrl(tabId, changeInfo, tab) {
	var DOMAIN = String(getHost(tab.url).replace('www.', ''));
	var CONFIG_KEY = 'config.'+DOMAIN;

	storage.get(CONFIG_KEY, function(configs) {
		if (configs[CONFIG_KEY])
			chrome.pageAction.show(tabId);
	})
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
