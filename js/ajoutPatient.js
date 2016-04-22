var template = require( "../ajoutPatient.html" );
require( "./ajoutPatient.css" );

console.log("ajoutPatient ctrl");

module.exports = function(angularModule) {

	var noyau = require("./NF.js")(angularModule);

	//~ var controller =  function($scope,proxyNF) {
	var controller =  function(noyau) {
		
		module.controller = this;
		var ctrl = this;
		this.data = {};
		
		this.loadData = function (noyau) {
			console.log("loadData Activated");
			noyau.getData("./data/cabinetInfirmier.xml")
			.then(function(data) {
				console.log("bonne affectation data");
				this.data = data;
				console.log(data);
			},function(data) {
				console.log("mauvaise affectation data");
				//this.data = data;
				console.log(data);
			});
		}
		
		//ctrl.loadData(noyau);
		
		this.creerPatient = function(newpatient) {
			console.log('addpatient');
			noyau.creerPatient(newpatient)
			//.then(controller.loadData(noyau));
			.then(
			function(){
				console.log('retour post bien passer');
				ctrl.loadData(noyau);},
			function(){
				console.log('retour post mal passer');
				});
			 
		};	
	};
	
	controller.$inject = [noyau];
				
	angularModule.component("ajoutpatient",{
		template : template,
		bindings :{
					data : "<"
				},
		controller : controller
		});
};



