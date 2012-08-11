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
			identifier: '$("a:first", container)',
			meta: {
				title: '$(container).find("a:first").text()',
				href:  '$(container).find("a:first").attr("href")'
			}
		},
		b: {
			container: '$("table#lista_anunturi tr")',
			identifier: '$("td.text a:first", container).attr("href")',
			meta: {
				title: '$("td.text a:first", container).text()',
				href:  '$("td.texta:first", container).attr("href")'
			},
			collections: ['b', 'c']
		},
		c: {
			container: '$("table#detalii_anunt")',
			identifier: 'location.href',
			meta: {
				title: '$("title").text()',
				href:  'location.href'
			},
			collections: ['b', 'c']
		}
	},
	
	"config.google.com": {
		a: {
			id: 'a',
			container: '$("li.g")',
			identifier: '$("div:first", container)',
			meta: {
				title: '$(container).find("h3 a").text()',
				href:  '$(container).find("h3 a").attr("href")'
			}
		}
	},
	
	"config.reddit.com": {
		a: {
			container: '$("div.thing")',
			identifier: '$("a:first", container)',
			meta: {
				title: '$(container).find("a").text()',
				href:  '$(container).find("a").attr("href")'
			}
		}
	},
	
	"config.magazinuldecase.ro": {
		a: {
			container: '$("div.imobil")',
			identifier: '$("h2 a:first", container).attr("href").replace(/#.*/g, "")',
			meta: {
				title: '$(container).find("h2 a:first").text()',
				href:  '$(container).find("h2 a:first").attr("href")'
			}
		}
	},
	
	"config.directproprietar.ro": {
		a: {
			container: '$("div.iep_offercontainer")',
			identifier: '$("a:first", container)',
			meta: {
				title: '$(container).find("a:first").text()',
				href:  '$(container).find("a:first").attr("href")'
			}
		}
	},
	
	"config.ro-imobile.ro": {
		a: {
			container: '$("table[height=70]")',
			identifier: '$("a:first", container)',
			meta: {
				title: '$(container).find("strong:first").text()',
				href:  '$(container).find("a:first").attr("href")'
			}
		}
	},
	
	"config.okazii.ro": {
		a: {
			container: '$("ul#OKAZII-Items li")',
			identifier: '$("h2 a:first", container).attr("href")',
			meta: {
				title: '$(container).find("h2 a:first").text()',
				href:  '$(container).find("h2 a:first").attr("href")'
			}
		}
	}

}
