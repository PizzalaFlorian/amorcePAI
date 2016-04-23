var angular 		= require( "angular" 		)
  , angularMaterial	= require( "angular-material" );
require( "ng-draggable" );
require( "ngmap" );
 
require( "angular-material/angular-material.css" );
require( "./secretary.css" );

var cabinetModule = angular.module( "cabinet", [ angularMaterial, "ngDraggable", "ngMap" ] );

require("./NF.js")(cabinetModule);
require("./cabinetMedical.js")(cabinetModule);
require("./infirmier.js")(cabinetModule);
require("./patient.js")(cabinetModule);

