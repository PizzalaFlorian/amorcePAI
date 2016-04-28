var template = require( "../infirmier.html" );
require( "./infirmier.css" );

module.exports = function(angularModule) {

	var proxyNF = require("./NF.js")(angularModule);

	var controller = function( proxyNF ){ 
		
		this.data = {};
		controller = this;
		
		this.loadData = function (noyau) {
			noyau.getData("/data/cabinetInfirmier.xml")
			.then(function(data) {
				controller.data = data;
			},function(data) {
				console.log("mauvaise affectation data");
				console.log(data);
			});
		}
		
		this.onDropComplete=function(data,evt,id){
			proxyNF.affecterPatient(data.numero,id)	
		};
		
	};
	
	controller.$inject = [ proxyNF];
				
	angularModule.component("infirmier",{
		template : template,
		bindings :{
					data : "<"
				},
		controller : controller
	});
};

