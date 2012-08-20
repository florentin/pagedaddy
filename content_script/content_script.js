var storage = chrome.storage.local;
//storage.clear();

var DOMAIN = String(document.domain.replace('www.', ''));
var COLLECTION_KEY = "collect."+DOMAIN;
var CONFIG_KEY = 'config.'+DOMAIN;

function debug() {
	console.log('penis')
	return true
}

function get_attributes(data, kwargs) {
	var all_attrs = []
	data.each(function(index, elem) {
		var elem_attrs = {}
		$(elem.attributes).each(function() {
			elem_attrs[this.nodeName] = this.nodeValue;
		});
		all_attrs.push(elem_attrs);
	})
	return all_attrs;
}

function mark_as_collected(jcontainer, action_key) {
	var action = SETTINGS.actions[action_key];
	if (action.css) {
		
		var original_css = jcontainer.data('original_css') || {}
		if (original_css) { // reset css
			$.each(original_css, function(key, css) {
				jcontainer.css(key, css);
			});
		} else { // backup css
			$.each(action.css, function(key, css) {
				original_css[key] = css;
			});
			jcontainer.data('original_css', original_css)
		}
		jcontainer.css(action.css);
	}
}

function collect_element(event) {
	var jcontainer = event.data.jcontainer;
	var action_key = event.data.action_key;
	
	var config_key = jcontainer.data('config_key');
	var identity_key = jcontainer.data('identity_key');
	var meta = jcontainer.data('meta');	
	
	var data = {"action_key": action_key}
	if (meta)
		data["meta"] = meta();
	
	storage.get(COLLECTION_KEY, function(config) {
		if (!config[COLLECTION_KEY][config_key]) {
			config[COLLECTION_KEY][config_key] = {}
		}
		
		config[COLLECTION_KEY][config_key][identity_key] = data;
		storage.set(config);
		
		//console.debug('collected', container, identity_key, action_key)		
		mark_as_collected(jcontainer, action_key);
	});
}

function add_actions(jcontainer) {
	var wrapper = $('<span ></span>').hide();
	$.each(SETTINGS.actions, function(action_key, action) {
		var button = $('<button type="button" class="css3button">'+(action.title || action_key)+'</button>' );
		button.click(
			{
				jcontainer: jcontainer,
				action_key: action_key
			},
			collect_element
		);
		wrapper.append(button);
	});
	jcontainer.after(wrapper);
	jcontainer.tooltip({ position: "top center", relative: true });
	
	jcontainer.hover(
		function(event) {
			var that = $(this);
			$(document).keydown(function(keyevent) {
				var action_key = SETTINGS.keydowns[keyevent.which];
				if (action_key) {
					event.data = {
						jcontainer: that, 
						action_key: action_key
					};
					collect_element(event)
				}
			});
		},
		function(event) {
			$(document).unbind('keydown');
		}
	)	
}

function enable_containers(config_key, config, collection) {
	var containers = eval(config.container);

	$.each(containers, function(i, container) {
		var jcontainer = $(container);
		
		if (jcontainer.data('enabled'))
			return false
			
		var identity = eval(config.identifier);
			
		if (!identity) {
			console.log("cannot establish identity", jcontainer, identity)
			return true
		}
		
		if (identity instanceof jQuery) {
			var identity_key = JSON.stringify(get_attributes(identity));
		} else {
			var identity_key = String(identity);
		}
		
		// Chrome storage will crash if the key is a INT like string, so we append a "#"		
		jcontainer.data('identity_key',  "#"+identity_key);
		jcontainer.data('config_key', config_key);

		if (config.meta) {
			// lazy evaluation of the meta values
			var meta = function () {
				var data = {}
				$.each(config.meta, function(key, expr) {
					var item = eval(expr);
					if (item instanceof jQuery) {
						item = item.text()
					}
					data[key] = item;
				})
				return data;
			}
			
			jcontainer.data('meta', meta);
		}
		
		add_actions(jcontainer);

		if (collection) {
			$.each(collection, function(identity_key, info) {
				if (jcontainer.data('identity_key')==identity_key) {
					mark_as_collected(jcontainer, info['action_key']);
				}
			})
		}

		jcontainer.data('enabled', true)
		
		if (SETTINGS.log_containers && i < SETTINGS.log_containers )
			console.debug("container enabled", jcontainer, config_key, identity, identity_key, meta())
	});

	return containers;
}

function emd5(string, key, raw) {
	if (!string) 
		return String();
	else
		return md5(string, key, raw);
}

storage.get(CONFIG_KEY, function(configs) {
	// initiate the configuration for this domain
	if (!configs[CONFIG_KEY]) {
		if (!CONFIGS[CONFIG_KEY]) {
			return false;
		}
		
		configs[CONFIG_KEY] = CONFIGS[CONFIG_KEY];
		storage.set(configs);
	}

	$.each(configs[CONFIG_KEY], function(id, config) {
		storage.get(COLLECTION_KEY, function(collections) {
			if (!collections[COLLECTION_KEY]) {
				collections[COLLECTION_KEY] = {};
				storage.set(collections);
			}

			if (config.collections) {
				var collection = {}
				$.each(config.collections, function(i, collection_id) {
					$.extend(collection, collections[COLLECTION_KEY][collection_id]);
				})
			} else
				var collection = collections[COLLECTION_KEY][id]
			
			if (SETTINGS.log_config)
				console.debug('config', id, config, collection)
			enable_containers(id, config, collection);
		});
	})
});
