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

function mark_as_collected(container, flag) {
	var old_flag = $(container).data('flag');
	if (old_flag)
		$(container).removeClass("flag_{0}".format(old_flag))
	$(container).addClass("flag_{0}".format(flag));
	$(container).data('flag', flag)
}

function collect_element(event) {
	var container = event.data.container;
	var flag = event.data.flag;

	storage.get(COLLECTION_KEY, function(config) {
		var config_id = $(container).data('config_id');
		var identity = $(container).data('identity');
		var meta = $(container).data('meta');

		if (!config[COLLECTION_KEY][config_id]) {
			config[COLLECTION_KEY][config_id] = {}
		}

		var data = {"flag": flag}
		if (meta)
			data["meta"] = meta()
		
		config[COLLECTION_KEY][config_id][identity] = data;
		storage.set(config);
		
		console.debug('collected', container, identity, flag)
		
		mark_as_collected(container, flag);
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
		)
		wrapper.append(button);
	});
	$(container).after(wrapper);
	$(container).tooltip({ position: "top center", relative: true });
}

function enable_containers(id, config, collection) {
	var containers = eval(config.container);

	containers.each(function(i, container) {
		if ($(container).data('enabled'))
			return false
			
		var identity = eval(config.identifier);

		//console.log('container enabled', container, identity)
		
		if (identity instanceof jQuery)
			identity = get_attributes(identity)
		
		identity = md5(JSON.stringify(identity))
		
		$(container).data('identity',  identity);
		$(container).data('config_id', id);

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
			
			$(container).data('meta', meta);
		}
		add_actions(container);

		if (collection) {
			$.each(collection, function(identity, info) {
				if ($(container).data('identity')==identity) {
					mark_as_collected(container, info['flag']);
				}
			})
		}

		$(container).data('enabled', true)
	});

	return containers;
}


storage.get(CONFIG_KEY, function(configs) {
	// initiate the configuration for this domain
	if (!configs[CONFIG_KEY]) {
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

			console.debug('config', id, config, collection)
			enable_containers(id, config, collection);
		});
	})
});
