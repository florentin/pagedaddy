var SETTINGS = {
	flags: ['grey', 'yellow', 'red'],
	action_position: ""
}

var CONFIGS = {
	"config.imobiliare.ro": {
		a: {
			container: '$("div.oferta")',
			identifier: '$(container).attr("id")',
			meta: {
				title: '$(container).find("a:eq(1)").text()',
				href: '$(container).find("a:eq(1)").attr("href")'
			}
		}
	},

	"config.anuntul.ro": {
		a: {
			container: '$("table#lista_anunturi tr")',
			identifier: '$(container).find("a:first")',
			meta: {
				title: '$(container).find("a:first").text()',
				href:  '$(container).find("a:first").attr("href")'
			}
		}
	},
	
	"config.google.com": {
		a: {
			id: 'a',
			container: '$("li.g")',
			identifier: '$(container).find("div:first")',
			meta: {
				title: '$(container).find("h3 a").text()',
				href:  '$(container).find("h3 a").attr("href")'
			}
		}
	},
	
	"config.reddit.com": {
		a: {
			container: '$("div.thing")',
			identifier: '$(container).find("a:first")',
			meta: {
				title: '$(container).find("a").text()',
				href:  '$(container).find("a").attr("href")'
			}
		}
	},
	
	"config.magazinuldecase.ro": {
		a: {
			container: '$("div.imobil")',
			identifier: '$(container).find("h2 a:first")',
			meta: {
				title: '$(container).find("h2 a:first").text()',
				href:  '$(container).find("h2 a:first").attr("href")'
			}
		}
	},
	
	"config.directproprietar.ro": {
		a: {
			container: '$("div.iep_offercontainer")',
			identifier: '$(container).find("a:first")',
			meta: {
				title: '$(container).find("a:first").text()',
				href:  '$(container).find("a:first").attr("href")'
			}
		}
	},
	
	"config.ro-imobile.ro": {
		a: {
			container: '$("table[height=70]")',
			identifier: '$(container).find("a:first")',
			meta: {
				title: '$(container).find("strong:first").text()',
				href:  '$(container).find("a:first").attr("href")'
			}
		}
	},
	
	"config.okazii.ro": {
		a: {
			container: '$("ul#OKAZII-Items li")',
			identifier: '$(container).find("h2 a:first")',
			meta: {
				title: '$(container).find("h2 a:first").text()',
				href:  '$(container).find("h2 a:first").attr("href")'
			}
		}
	}

}
