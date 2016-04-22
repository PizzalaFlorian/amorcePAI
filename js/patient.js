var template = require( "../patient.html" );
require( "./patient.css" );

module.exports = function(angularModule) {

	var controller = function() { 
		};
				
	angularModule.component("patient",{
		template : template,
		bindings :{
					data : "<"
				},
		controller : controller
		});
};

