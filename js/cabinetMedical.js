var template = require( "../cabinetMedical.html" );
require( "./cabinetMedical.css" );
require( "./ajoutPatient.css" );
var angular = require ("angular");

module.exports = function(angularModule) {
	var proxyNF = require("./NF.js")(angularModule);

	var controller = function( proxyNF, NgMap) {

		this.data = {};
		controller = this;
		
		this.location = {
			lat : 45.193861,
			lng : 5.768843
		}
		
		this.addressMarker = "";
		
		this.newpatient =  {
			patientName			: "",
			patientForname		: "",
			patientNumber		: "",
			patientSex			: "",
			patientBirthday		: "",
			patientFloor		: "",
			patientStreet		: "",
			patientPostalCode	: "",
			patientCity 		: ""
		}
	
		
		var formVide = {
			patientName			: "",
			patientForname		: "",
			patientNumber		: "",
			patientSex			: "",
			patientBirthday		: "",
			patientFloor		: "",
			patientStreet		: "",
			patientPostalCode	: "",
			patientCity 		: ""
		}
		
			
		this.adresseOk="Grenoble";
		
		this.myVar = true;
		this.textButton = "Fermer ajouter patient";
		
		
		this.getLatIng = function(noyau,adresse){
			console.log("chercher Adresse");
			//console.log(adresse);
			noyau.getLatIng(adresse).then(function(data){
			//~ console.log("coordonnée:",data.data.results[0].geometry.location);
			controller.location.lat = data.data.results[0].geometry.location.lat;
			controller.location.lng = data.data.results[0].geometry.location.lng;
		});
		};
		
		function prepareStringAdresse(patient) {
			return patient.patientFloor + " " + patient.patientStreet + " " + patient.patientPostalCode + " " + patient.patientCity;
		}
		
		this.adrKeyDown = function (){
			
			this.addressMarker = prepareStringAdresse(this.newpatient);
			//~ console.log("event keydown");
			//~ this.getLatIng(proxyNF,this.newpatient);
		}
		/****init Map *****/
		NgMap.getMap({timeout:5000, id:"mapId"})
				.then(
					function (map) {
						console.log("init map");
						
						var Center = new google.maps.LatLng(45.193861, 5.768843);
						google.maps.event.trigger(map, 'resize');
						map.setCenter(Center);
						
						//console.log(controller.location.lng);
						
						var myMarker = new google.maps.Marker(
						{ position	: new google.maps.LatLng(0, 0)
						, title		: "Je suis ici!"
						, icon		: '../images/GoogleMapsMarkers/blue_markerA.png'
						} );
						myMarker.setMap(map);
						
						var geocoder = new google.maps.Geocoder();
						
						function geocoderParser( res ) {
							if(res[0].address_components.length == 7){
								controller.newpatient.patientFloor = res[0].address_components[0].long_name;
								controller.newpatient.patientStreet = res[0].address_components[1].long_name;
								controller.newpatient.patientCity = res[0].address_components[2].long_name;
							}
							else{
								controller.newpatient.patientFloor = "00";
								controller.newpatient.patientStreet = res[0].address_components[0].long_name;
								controller.newpatient.patientCity = res[0].address_components[1].long_name;
							}
									
							controller.newpatient.patientPostalCode = res[0].address_components[res[0].address_components.length-1].long_name;
							
							//console.log("form vide",controller.newpatient);
						}
						
						var evt = google.maps.event.addListener(
							  map
							, 'click'
							, function(evt) {
								myMarker.setPosition(evt.latLng);
								
								geocoder.geocode( 
									{'latLng': evt.latLng}
									, function(results, status) {
										if (status == google.maps.GeocoderStatus.OK) {
											geocoderParser(results);
											console.log("fin geocoder");
											//~ controller.setAdr();
										} 
										else {
											console.error("Error geocoding:", status);
										}
									}
								);
								
							}
						);
						
						console.log("fin init map");
					}, function (err) {
						console.log("Google Map Error", err);
					}
				);
				
				
		/********************/
		
		this.showForm = function(){
			console.log("show form");
			
			this.myVar = !this.myVar;
			
			if(this.myVar == false){
				this.textButton = "Ajouter un nouveau patient";
			}
			else {
				this.textButton = "Fermer ajouter patient";
			}
			NgMap.getMap({timeout:5000, id:"mapId"})
				.then(
					function (map) {
						console.log("re-init map");
						
						var currCenter = new google.maps.LatLng(45.193861, 5.768843);
						google.maps.event.trigger(map, 'resize');
						map.setCenter(currCenter);
						
						var myMarker = new google.maps.Marker(
						{ position	: currCenter
						, title		: "Je suis ici!"
						} );
						myMarker.setMap(map);
						
						var geocoder = new google.maps.Geocoder();
						
						function geocoderParser( res ) {
							if(res[0].address_components.length == 7){
								controller.newpatient.patientFloor = res[0].address_components[0].long_name;
								controller.newpatient.patientStreet = res[0].address_components[1].long_name;
								controller.newpatient.patientCity = res[0].address_components[2].long_name;
							}
							else{
								controller.newpatient.patientFloor = "00";
								controller.newpatient.patientStreet = res[0].address_components[0].long_name;
								controller.newpatient.patientCity = res[0].address_components[1].long_name;
							}
									
							controller.newpatient.patientPostalCode = res[0].address_components[res[0].address_components.length-1].long_name;
						}
						
						var evt = google.maps.event.addListener(
							  map
							, 'click'
							, function(evt) {
								myMarker.setPosition(evt.latLng);
								
								geocoder.geocode( 
									{'latLng': evt.latLng}
									, function(results, status) {
										if (status == google.maps.GeocoderStatus.OK) {
											geocoderParser(results);
											console.log("fin geocoder");
										} 
										else {
											console.error("Error geocoding:", status);
										}
									}
								);
							
							}
						);
						
						console.log("fin init map");
					}, function (err) {
						console.log("Google Map Error", err);
					}
				);
		}

		this.reset = function(){
			console.log("reset form");
			this.newpatient = angular.copy(formVide);
		};
		
		this.setAdr = function () {
			this.newpatient = angular.copy(this.newpatient);	
		};
		
		proxyNF.getData(this.src).then(function(data){
			console.log(data);
			controller.data = data; 
		});
		
		this.loadData = function (noyau) {
			console.log("loadData Activated");
			noyau.getData(this.src)
			.then(function(data) {
				controller.data = data;
			},function(data) {
				console.log("mauvaise affectation data");
				console.log(data);
			});
		}
						
		this.creerPatient = function(newpatient) {
			if(newpatient.patientPostalCode != "" ){	
				console.log('addpatient');
				proxyNF.creerPatient(newpatient)
				.then(
				function(){
					controller.reset();
					console.log('retour post bien passer');
					controller.loadData(proxyNF);},
				function(){
					console.log('retour post mal passer');
					});
			}
		};
		
		this.notify = function(){
			setTimeout(function(){
				console.log("debut notify");
				controller.loadData(proxyNF);
				console.log("fin notify");
			}, 250);
			
		};
				
		this.onDropComplete=function(data,evt,id){
			console.log("drop medical");
			console.log("drop success, data:", data,id);
			console.log(data.numero,id);	
			proxyNF.affecterPatient(data.numero,id)
			.then(function(){
				controller.loadData(proxyNF);
				console.log("drop complete");				
				});
			
		};	

	}
	
	controller.$inject = [ proxyNF, "NgMap" ]; // Injection de dépendances

	angularModule.component( "cabinetMedical", {
		template	: template,
		bindings	: {
			titre	: "@",
			src : "@",
			data : "<"
		},
		controller	: controller
	});
};

