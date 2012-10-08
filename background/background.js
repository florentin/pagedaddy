var storage = chrome.storage.local;

function getHost(url) {
	var a = document.createElement('a');
	a.href = url;
	return a.hostname.replace('www.', '');
}

function initialize_storage(stored_configs, CONFIG_KEY, COLLECTION_KEY) {
	if (!stored_configs[CONFIG_KEY]) {
		// initiate the configuration for this domain configs
		if (!DEFAULT_CONFIGS[CONFIG_KEY]) {
			// there are no defaults
			// TODO: error management, user warnings ?
			return false;
		} else {
			// we have a default config, let's store them
			stored_configs[CONFIG_KEY] = DEFAULT_CONFIGS[CONFIG_KEY];
			stored_configs[COLLECTION_KEY] = {};
			storage.set(stored_configs);	
		}
	}
	return true;
}

function checkForValidUrl(tabId, changeInfo, tab) {
	var DOMAIN = String(getHost(tab.url).replace('www.', ''));
	var CONFIG_KEY = 'config.'+DOMAIN;
	var COLLECTION_KEY = "collect."+DOMAIN;

	storage.get(CONFIG_KEY, function(stored_configs) {
		var initialized = initialize_storage(stored_configs, CONFIG_KEY, COLLECTION_KEY);
		if (initialized) {
			chrome.pageAction.show(tabId);
		}
	})
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
