var DEFAULT_SETTINGS = {
	actions: {
		grey: {
			css: {"opacity": "0.4", "text-decoration": "line-through", "background-color": "transparent", "border": "none"}, 
			title: "grey (q)"
		}, 
		blue:  {
			css: {"opacity": "1", "text-decoration": "none", "background-color": "#B6E1F2", "border": "1px solid #B6E1F2"}, 
			title: "blue (w)"
		},
		green:  {
			css: {"opacity": "1", "text-decoration": "none", "background-color": "#B9F73E", "border": "1px solid #B9F73E"}, 
			title: "green (e)"
		},
		red: {
			css: {"opacity": "1", "text-decoration": "none", "background-color": "#FFD83C", "border": "1px solid #FFD83C"}, 
			title: "yellow (r)"
		}
	},
	keydowns: {
		81: 'grey', 
		87: 'blue',
		69: 'green',
		82: 'red'
	},
	log_containers: 0,
	log_config: 1,
}

var DEFAULT_CONFIGS = {
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
			}
		},
		b: {
			container: '$("table#detalii_anunt")',
			identifier: '$(container).attr("anuntid")',
			meta: {
				title: '$("title").text().trim()',
				href:  'location.href',
				id:  '$(container).attr("anuntid")'
			},
			collection_key: 'a'
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
	},
	
	"config.ejobs.ro": {
		a: {
			container: '$("tr.companie")',
			identifier: '$(container).find("a:first").attr("name").replace("job_", "")',
			meta: {
				title: '$(container).find("a[onmouseover]").text().trim()',
				href: '$(container).find("a[onmouseover]").attr("href")',
				id: 'identity'
			}
		}
	},
	
	"config.hipo.ro": {
		a: {
			container: '$("table.recordTable:last tr")',
			identifier: 'emd5($(container).find("a:first").attr("href"))',
			meta: {
				title: '$(container).find("a:first").text().trim()',
				href: '$(container).find("a:first").attr("href")'
			}
		}
	},
	
	"config.myjob.ro": {
		a: {
			container: '$("tr.topjob")',
			identifier: '$(container).attr("id").replace("ljrow_", "")',
			meta: {
				title: '$(container).find("a:first").text().trim()',
				href: '$(container).find("a:first").attr("href")'
			}
		}
	},
	
	"config.imobiliare.net": {
		a: {
			container: '$("div[class^=\'anunt\']")',
			identifier: '$(container).find("a[id]").attr("id").replace("ad", "")',
			meta: {
				href: '$(container).find("a.micut:last").attr("href")'
			}
		},
		b: {
			container: '$("div.post")',
			identifier: '$(container).find("span[id]").attr("id").replace("ad", "")',
			meta: {
				href: 'location.href'
			},
			collection_key: 'a'
		}
	},
	
	"config.bestjobs.ro": {
		a: {
			container: '$("div.one-job")',
			identifier: '$(container).attr("id").replace("jobDiv_", "")',
			meta: {
				title: '$(container).find("div.one-job-title a").text().trim()',
				href: '$(container).find("div.one-job-title a").attr("href")'
			}
		}
	},
	
	"config.anunturiparticulari.ro": {
		a: {
			container: '$("div.anunt")',
			identifier: 'emd5($(container).find("div.colorat").text().trim())',
			meta: {
			}
		}
	}

}
