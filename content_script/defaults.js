var SETTINGS = {
	actions: {
		grey: {
			css: {"opacity": "0.4", "text-decoration": "line-through", "background-color": "transparent", "border": "none"}, 
			title: "grey (a)"
		}, 
		blue:  {
			css: {"opacity": "1", "text-decoration": "none", "background-color": "#B6E1F2", "border": "1px solid #B6E1F2"}, 
			title: "blue (s)"
		},
		green:  {
			css: {"opacity": "1", "text-decoration": "none", "background-color": "#B9F73E", "border": "1px solid #B9F73E"}, 
			title: "green (d)"
		},
		red: {
			css: {"opacity": "1", "text-decoration": "none", "background-color": "#FF6770", "border": "1px solid #FF6770"}, 
			title: "red (f)"
		}
	},
	keydowns: {
		65: 'grey', 
		83: 'blue',
		68: 'green',
		70: 'red'
	},
	log_containers: 0,
	log_config: false,
}

var CONFIGS = {
	"config.imobiliare.ro": {
		a: {
			container: '$("div.oferta")',
			identifier: '$(container).attr("id")',
			meta: {
				title: '$(container).find("a:eq(1)").text().trim()',
				href: '$(container).find("a:eq(1)").attr("href")',
				id: '$(container).attr("id")'
			}
		}
	},

	"config.anuntul.ro": {
		a: {
			container: '$("table#lista_anunturi tr")',
			identifier: '$(container).find("td.text a").attr("id")',
			meta: {
				title: '$(container).find("td.text a").text().trim()',
				href:  '$(container).find("td.text a").attr("href")',
				id:  '$(container).find("td.text a").attr("id")'
			},
			collections: ['a', 'b']
		},
		b: {
			container: '$("table#detalii_anunt")',
			identifier: '$(container).attr("anuntid")',
			meta: {
				title: '$("title").text().trim()',
				href:  'location.href',
				id:  '$(container).attr("anuntid")'
			},
			collections: ['a', 'b']
		}
	},
	
	"config.reddit.com": {
		a: {
			container: '$("div.thing")',
			identifier: '$(container).find("a:first").attr("href")',
			meta: {
				title: '$(container).find("a:first").text().trim()',
				href:  '$(container).find("a:first").attr("href")'
			}
		}
	},
	
	"config.magazinuldecase.ro": {
		a: {
			container: '$("div.imobil")',
			identifier: 'emd5($("h2 a:first", container).attr("href").replace(/#.*/g, ""))',
			meta: {
				title: '$(container).find("h2 a:first").text().trim()',
				href:  '$(container).find("h2 a:first").attr("href")'
			}
		}
	},
	
	"config.directproprietar.ro": {
		a: {
			container: '$("div.iep_offercontainer")',
			identifier: 'emd5($("a:first", container).attr("href"))',
			meta: {
				title: '$(container).find("a:first").text()',
				href:  '$(container).find("a:first").attr("href")'
			}
		}
	},
	
	"config.ro-imobile.ro": {
		a: {
			container: '$("table[height=70]")',
			identifier: 'emd5($(container).find("a:first").attr("href"))',
			meta: {
				title: '$(container).find("strong:first").text().trim()',
				href:  '$(container).find("a:first").attr("href")'
			}
		}
	},
	
	"config.okazii.ro": {
		a: {
			container: '$("ul#OKAZII-Items li")',
			identifier: 'emd5($(container).find("h2 a:first").attr("href"))',
			meta: {
				title: '$(container).find("h2 a:first").text().trim()',
				href:  '$(container).find("h2 a:first").attr("href")'
			}
		}
	},
	
	"config.mercador.ro": {
		a: {
			container: '$("table#offers_table tr[id*=\'offer-\']")',
			identifier: 'emd5($("h4 a", container).attr("href"))',
			meta: {
				title: '$(container).find("h4 a").text().trim()',
				href:  '$(container).find("h4 a").attr("href")'
			}
		}
	},
	
	"config.bizimobiliare.ro": {
		a: {
			container: '$("div.content table.listari")',
			identifier: '$(container).find("a.lnkclick").attr("id").replace("ad", "")',
			meta: {
				title: '$(container).find("div.colorat").text().trim()',
				href:  '$(container).find("div.colorat").attr("onclick").match(/\'([^\']*)\'/i)[1]',
				id: 	'identity'
			}
		}
	},
	
	"config.cauta-imobiliare.ro": {
		a: {
			container: '$("table[width=720] tr div[onclick][style]")',
			identifier: '$(container).find("table").attr("id").replace("tr", "")',
			meta: {
				title: '$(container).find("table").attr("onmouseover").trim()',
				href:  '$(container).attr("onclick").match(/\'([^\']*)\'$/i)[1]',
				id: 	'identity'
			}
		}
	},
	
	"config.anunturiimobiliare.ro": {
		a: {
			container: '$("div.anunt")',
			identifier: '$(container).find("div.micut a:first").attr("id").replace("ad", "")',
			meta: {
				title: '$(container).find("div.colorat").text().trim()',
				href:  '$(container).find("div.colorat").attr("onclick").match(/\'([^\']*)\'$/i)[1]',
				id: 	'identity'
			}
		}
	}

}
