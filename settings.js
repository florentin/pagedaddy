var SETTINGS = {
	flags: ['grey', 'yellow'],
	action_position: ""
}

var CONFIGS = {
	"config.imobiliare.ro": [
		{
			id: 'a',
			container: '$("div.oferta")',
			identifier: '$(container).attr("id")',
			meta: {
				title: '$(container).find("a:eq(1)").text()',
				href: '$(container).find("a:eq(1)").attr("href")'
			}
		}
	],

	"config.anuntul.ro": [
		{
			id: 'a',
			container: '$("table#lista_anunturi tr")',
			identifier: '$(container).find("a:first")',
			meta: {
				title: '$(container).find("a:first").text()',
				href:  '$(container).find("a:first").attr("href")'
			}
		}
	],
	
	"config.google.com": [
		{
			id: 'a',
			container: '$("li.g")',
			identifier: '$(container).find("div:first")',
			meta: {
				title: '$(container).find("h3 a").text()',
				href:  '$(container).find("h3 a").attr("href")'
			}
		}
	]
}
