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
		
		console.debug('collect', identity, flag)
		storage.set(config);
		
		mark_as_collected(container, flag);
	});
}

function add_actions(container) {
	var wrapper = $('<span style="width: 100%;"></span>').hide();
	
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

	$(container).append(wrapper);

	$(container).hover(
		function() {
			wrapper.show();
		},
		function() {
			wrapper.hide();
		}
	);
	//$(container).css('border', '1px solid yellow')
}

function enable_containers(id, config) {
	var containers = eval(config.container);
	
	containers.each(function(i, container) {
		var identity = eval(config.identifier);
		
		if (identity instanceof jQuery)
			var identity = md5(JSON.stringify(get_attributes(identity)))
		
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
	});

	return containers;
}

function process_containers(containers, collection) {
	if (!collection) {
		return false;
	}

	$(containers).each(function(index, container) {
		$.each(collection, function(key, info) {
			if ($(container).data('identity')==key) {
				mark_as_collected(container, info['flag']);
			}
		})
	})
}


storage.get(CONFIG_KEY, function(configs) {
	// initiate the configuration for this domain
	if (!configs[CONFIG_KEY]) {
		configs[CONFIG_KEY] = CONFIGS[CONFIG_KEY];
		storage.set(configs);
	}
	console.debug('configs', configs)
	
	$.each(configs[CONFIG_KEY], function(id, config) {
		var containers = enable_containers(id, config);
		storage.get(COLLECTION_KEY, function(collection) {
			if (!collection[COLLECTION_KEY]) {
				collection[COLLECTION_KEY] = {};
				storage.set(collection);
			}
			console.debug('collection', collection)
			process_containers(containers, collection[COLLECTION_KEY][id]);
		});
	})
});
