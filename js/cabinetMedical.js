var template = require( "../cabinetMedical.html" );
require( "./cabinetMedical.css" );
require( "./ajoutPatient.css" );
var angular = require ("angular"); // sert ici pour la copie d'objet.

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
		
		this.myVar = true; /*Controle formuluaire*/
		this.textButton = "Fermer ajouter patient";
		
		function prepareStringAdresse(patient) { //convertie un objet patient en une chaine adresse pour placer le marker
			return patient.patientFloor + " " + patient.patientStreet + " " + patient.patientPostalCode + " " + patient.patientCity;
		}
		
		this.adrKeyDown = function (){ //affecte l'adresse au marker
			this.addressMarker = prepareStringAdresse(this.newpatient);
		}
		
		/****Map *****/
		NgMap.getMap({timeout:5000, id:"mapId"})
				.then(
					function (map) {
						
						var Center = new google.maps.LatLng(45.193861, 5.768843);
						google.maps.event.trigger(map, 'resize');
						map.setCenter(Center);
					
						var geocoder = new google.maps.Geocoder();
						
						function geocoderParser( res ) {
							var adresse ="";
							if(res[0].address_components.length == 7){ //Cas l'adresse pointée a un numero de rue.
								controller.newpatient.patientFloor = res[0].address_components[0].long_name;
								controller.newpatient.patientStreet = res[0].address_components[1].long_name;
								controller.newpatient.patientCity = res[0].address_components[2].long_name;
							}
							else{ //cas l'adresse pointée ne possède pas de numero de rue.
								controller.newpatient.patientFloor = "00";
								controller.newpatient.patientStreet = res[0].address_components[0].long_name;
								controller.newpatient.patientCity = res[0].address_components[1].long_name;
							}
							// récupère le code postal.		
							controller.newpatient.patientPostalCode = res[0].address_components[res[0].address_components.length-1].long_name;
							
							return adresse;
						}
						
						var evt = google.maps.event.addListener(
							  map
							, 'click'
							, function(evt) {
								//transmet localisation au marker
								location.lat = evt.latLng.lat();
								location.lng = evt.latLng.lng();
								geocoder.geocode( 
									{'latLng': evt.latLng}
									, function(results, status) { // calcul de l'adresse pour le formulaire
										if (status == google.maps.GeocoderStatus.OK) {
											var adresse = geocoderParser(results);
										} 
										else {
											console.error("Error geocoding:", status);
										}
									}
								);
								
							}
						);
						
						//~ console.log("fin init map");
					}, function (err) {
						console.log("Google Map Error", err);
					}
				);
		/********** Fin Map **********/
		
		this.showForm = function(){ //Gestion du masquage / affichage du formulaire d'ajout du patient
			
			this.myVar = !this.myVar;
			
			if(this.myVar == false){
				this.textButton = "Ajouter un nouveau patient";
			}
			else {
				this.textButton = "Fermer ajouter patient";
			}
		}

		this.reset = function(){ // vide les champs du formulaire d'ajout de patient
			this.newpatient = angular.copy(formVide);
			
		};
		
		function prepareCoordAdresse(loc){ //perpare les données pour le marker sur la carte.
			return "["+loc.lat+", "+loc.lng+"]";
		}
		
		this.setAdr = function () { // recopie l'adresse sur le formulaire et replace le marker sur la carte
			this.newpatient = angular.copy(this.newpatient);
			this.addressMarker = prepareCoordAdresse(location);	
			//~ console.log("adresse",this.addressMarker);
		};
		
		proxyNF.getData(this.src).then(function(data){ //rafraichit les données.
			controller.data = data; 
		});
		
		this.loadData = function (noyau) { //appelle un rafraichissement de données et affecte les nouvelles
			//~ console.log("loadData Activated");
			noyau.getData(this.src)
			.then(function(data) {
				controller.data = data;
			},function(data) {
				console.log("mauvaise affectation data");
				console.log(data);
			});
		}
						
		this.creerPatient = function(newpatient) { //ajoute un patient suivant les données du formulaire
			if(newpatient.patientPostalCode != "" ){	
				//~ console.log('addpatient');
				proxyNF.creerPatient(newpatient)
				.then(
				function(){
					controller.reset();//vide le formulaire
					//~ console.log('reussite ajout');
					controller.loadData(proxyNF);},
				function(){
					console.log('erreure ajout patient');
					});
			}
		};
		
		this.notify = function(){ //rafraichie les données après un délai
			setTimeout(function(){
				controller.loadData(proxyNF);
			}, 250);
			
		};
				
		this.onDropComplete=function(data,evt,id){ //réaffecte un patient via un drag and drop	
			proxyNF.affecterPatient(data.numero,id)
			.then(function(){
				controller.loadData(proxyNF);				
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

