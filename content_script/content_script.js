var storage = chrome.storage.local;
//storage.clear();

var DOMAIN = String(document.domain.replace('www.', ''));
var COLLECTION_KEY = "collect."+DOMAIN;
var CONFIG_KEY = 'config.'+DOMAIN;


String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};

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

function mark_as_collected(jcontainer, flag) {
	var old_flag = jcontainer.data('flag');
	if (old_flag)
		jcontainer.removeClass("flag_{0}".format(old_flag))
	jcontainer.addClass("flag_{0}".format(flag));
	jcontainer.data('flag', flag)
}

function collect_element(event) {
	
	var jcontainer = $(event.data.container);
	var flag = event.data.flag;
	
	var config_id = jcontainer.data('config_id');
	var identity_key = jcontainer.data('identity_key');
	var meta = jcontainer.data('meta');	
	
	var data = {"flag": flag}
	if (meta)
		data["meta"] = meta();
	
	if (event.ctrlKey) {
		//console.debug("collect element", jcontainer, config_id, identity_key, data)
		//return true;
	}
	
	storage.get(COLLECTION_KEY, function(config) {
		if (!config[COLLECTION_KEY][config_id]) {
			config[COLLECTION_KEY][config_id] = {}
		}
		
		config[COLLECTION_KEY][config_id][identity_key] = data;
		storage.set(config);
		
		//console.debug('collected', container, identity_key, flag)		
		mark_as_collected(jcontainer, flag);
	});
}

function add_actions(container) {
	var wrapper = $('<span ></span>').hide();
	$.each(SETTINGS.flags, function(i, flag) {
		var button = $('<button type="button" class="css3button">{0}</button>'.format(flag) );
		button.click(
			{
				container: container,
				flag: flag
			},
			collect_element
		);
		wrapper.append(button);
	});
	$(container).after(wrapper);
	$(container).tooltip({ position: "top center", relative: true });
}

function enable_containers(config_id, config, collection) {
	var containers = eval(config.container);

	$.each(containers, function(i, container) {
		var jcontainer = $(container);
		
		if (jcontainer.data('enabled'))
			return false
			
		var identity = eval(config.identifier);
		
		if (identity instanceof jQuery) {
			var identity_key = JSON.stringify(get_attributes(identity));
		} else {
			var identity_key = String(identity);
		}
					
		if (!identity_key) {
			console.log("cannot establish identity", jcontainer, identity)
			return true
		}
		
		// Chrome storage will crash if the key is a INT like string, so we append a "#"		
		jcontainer.data('identity_key',  "#"+identity_key);
		jcontainer.data('config_id', config_id);

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
		
		add_actions(container);

		if (collection) {
			$.each(collection, function(identity_key, info) {
				if (jcontainer.data('identity_key')==identity_key) {
					mark_as_collected(jcontainer, info['flag']);
				}
			})
		}

		jcontainer.data('enabled', true)
		
		if (SETTINGS.debug_containers && i < SETTINGS.debug_containers )
			console.debug("container enabled", jcontainer, config_id, identity, identity_key, meta())
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

			//console.debug('config', id, config, collection)
			enable_containers(id, config, collection);
		});
	})
});
