var template = require( "../infirmier.html" );
require( "./infirmier.css" );

module.exports = function(angularModule) {

	var proxyNF = require("./NF.js")(angularModule);
	//var cabinet = require("./cabinetMedical.js")(angularModule);

	var controller = function( proxyNF ){ 
	//var controller = function(){ 
		
		this.data = {};
		controller = this;
		
		this.loadData = function (noyau) {
			console.log("loadData Activated");
			noyau.getData("/data/cabinetInfirmier.xml")
			.then(function(data) {
				console.log("bonne affectation data");
				controller.data = data;
			},function(data) {
				console.log("mauvaise affectation data");
				//this.data = data;
				console.log(data);
			});
		}
		
		this.onDropComplete=function(data,evt,id){
			console.log("drop infirmier");
			console.log("drop success, data:", data,id);
			console.log(data.numero,id);
			proxyNF.affecterPatient(data.numero,id)
			//~ .then(controller.loadData(proxyNF));	
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

