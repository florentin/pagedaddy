var storage = chrome.storage.local;

function getHost(url) {
	var a = document.createElement('a');
	a.href = url;
	return a.hostname.replace('www.', '');
}

$(document).ready(function() {
	chrome.tabs.getSelected(null, function(tab) {
		var DOMAIN = getHost(tab.url);
		var COLLECTION_KEY = "collect."+DOMAIN;
		var CONFIG_KEY = 'config.'+DOMAIN;
			
		var button1 = $("#reset_config");
		button1.click(function(event) {
			storage.remove(CONFIG_KEY, function(config) {
				$(event.target).css('background-color', '#00FF00');
			});
		});

		var button2 = $("#reset_collection");
		button2.click(function(event) {
			storage.remove(COLLECTION_KEY, function(config) {
				$(event.target).css('background-color', '#00FF00');
			});
		});
		
		$("body").append(button1).append(button2);
	});
})

