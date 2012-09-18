var storage = chrome.storage.local;
//storage.clear();

var DOMAIN = String(document.domain.replace('www.', ''));
var COLLECTION_KEY = "collect."+DOMAIN;
var CONFIG_KEY = 'config.'+DOMAIN;

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
	var action = DEFAULT_SETTINGS.actions[action_key];
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
	
	var collection_key = jcontainer.data('collection_key');
	var identity = jcontainer.data('identity');
	var meta = jcontainer.data('meta');	
	
	var data = {"action_key": action_key}
	if (meta)
		data["meta"] = meta();
	
	storage.get(COLLECTION_KEY, function(collection) {
		collection[COLLECTION_KEY][collection_key][identity] = data;
		storage.set(collection);

		mark_as_collected(jcontainer, action_key);
	});
}

function add_actions(jcontainer) {
	var wrapper = $('<span ></span>').hide();
	$.each(DEFAULT_SETTINGS.actions, function(action_key, action) {
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
				var action_key = DEFAULT_SETTINGS.keydowns[keyevent.which];
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

function enable_containers(config, collection) {
	var containers = eval(config.container);

	$.each(containers, function(i, container) {
		var jcontainer = $(container);
		
		if (jcontainer.data('enabled'))
			return false

		// determine the identity of the container
		var identity_obj = eval(config.identifier);
		if (!identity_obj) {
			console.log("cannot establish identity", jcontainer, identity_obj);
			return true;
		}
		if (identity_obj instanceof jQuery) {
			var identity = JSON.stringify(get_attributes(identity_obj));
		} else {
			var identity = String(identity_obj);
		}
		identity = "#"+identity
		
		// Chrome storage will crash if the key is a INT like string, so we append a "#"
		jcontainer.data('identity',  identity);
		jcontainer.data('collection_key', config.collection_key);

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
			//console.log('collection', collection);
			$.each(collection, function(collection_key, collected) {
				if (jcontainer.data('identity')==collection_key) {
					console.log('marking', jcontainer, collected)
					mark_as_collected(jcontainer, collected['action_key']);
				}
			})
		}

		jcontainer.data('enabled', true)
		
		if (DEFAULT_SETTINGS.log_containers && i < DEFAULT_SETTINGS.log_containers )
			console.debug("container enabled", jcontainer, config, identity_obj, identity, meta())
	});

	return containers;
}

function emd5(string, key, raw) {
	if (!string) 
		return String();
	else
		return md5(string, key, raw);
}

storage.get(CONFIG_KEY, function(stored_configs) {
	if (!stored_configs[CONFIG_KEY]) {
		// initiate the configuration for this domain configs
		if (!DEFAULT_CONFIGS[CONFIG_KEY]) {
			// there are no defaults
			return false;
		} else {
			// we have a default config, let's store them
			stored_configs[CONFIG_KEY] = DEFAULT_CONFIGS[CONFIG_KEY];
			storage.set(stored_configs);
		}
	}

	$.each(stored_configs[CONFIG_KEY], function(config_id, config) {
		config.id = config_id;
		
		storage.get(COLLECTION_KEY, function(collections) {
			
			// this config might use another config's collection
			// typeof something === "undefined"
			if (!config.hasOwnProperty('collection_key')) {
				config.collection_key = config.id;
			}
			
			// initialize the collection for the COLLECTION_KEY and the collection_key
			if (!collections.hasOwnProperty(COLLECTION_KEY)) {
				collections[COLLECTION_KEY] = {};
				storage.set(collections);
			}
			
			if (!collections[COLLECTION_KEY].hasOwnProperty(config.collection_key)) {
				collections[COLLECTION_KEY][config.collection_key] = {};
				storage.set(collections);
			}

			var collection = collections[COLLECTION_KEY][config.collection_key];

			if (DEFAULT_SETTINGS.log_config)
				console.debug('config', config, 'collection', collection);

			enable_containers(config, collection);
		});
	})
});
