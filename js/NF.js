var proxyNF = function($http) {
	// Ajoutez le code de construction du service
	// Cette fonction sera appelée pour instancier un objet service
	// Utilisez $http pour télécharger la base de données
	
		$http	.get ( "data/cabinetInfirmier.xml" )
			.then( function(response) {
		
			var parser = new DOMParser();
			var doc = parser.parseFromString(response.data ,"application/xml");

		return doc;	
	})	
	
	this.getData = function(src){
		console.log("NF -  getDATA");
		console.log(src);
		return $http.get(src).then(proccessData);
	}
	
	this.creerPatient = function (newpatient){
		console.log("NF - creer Patient");
		return $http({
		  method: 'POST',
		  url: 'http://localhost:8080/addPatient',
		  data : {
				patientName			: newpatient.patientName,
				patientForname		: newpatient.patientForname,
				patientNumber		: newpatient.patientNumber,
				patientSex			: newpatient.patientSex,
				patientBirthday		: newpatient.patientBirthday,
				patientFloor		: newpatient.patientFloor,
				patientStreet		: newpatient.patientStreet,
				patientPostalCode	: newpatient.patientPostalCode,
				patientCity 		: newpatient.patientCity
				}
				
			});
	}
	
	function prepareStringToQuery(adresse) {
		var reg =/[ ,-]/g;
		return adresse.patientFloor + "+" + adresse.patientStreet.replace(reg,"+") + ",+" + adresse.patientPostalCode + "+" + adresse.patientCity.replace(reg,"+") + ",+France";
	}
	
	this.getLatIng = function (adresse){
		var queryString = prepareStringToQuery(adresse);
		console.log("adresse requete",queryString);
		return $http({
			  method: 'POST',
			  url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+queryString+'&key=AIzaSyC0oGYYSN72lukTU1PK5G6ImDBTurcYyBY'
			});
	}
	
	this.affecterPatient = function(numCQ,idInfirmier) {
		console.log("NF - reaffecter Patient");
		return $http({
		  method: 'POST',
		  url: 'http://localhost:8080/affectation',
		  data : {
				infirmier 	: idInfirmier,
				patient 	: numCQ
				}
		});
		
	}
}

function isset ()
{

  var a = arguments,
    l = a.length,
    i = 0,
    undef;

  if (l === 0)
  {
    throw new Error('Empty isset');
  }

  while (i !== l)
  {
    if (a[i] === undef || a[i] === null || a[i] == 'null'|| a[i] == ''|| a[i] == 'none')
    {
      return false;
    }
    i++;
  }
  return true;
}

function proccessData (response){
	console.log("NF - proccessData");
	//~ console.log(response.data);
	var parser = new DOMParser();
	var doc = parser.parseFromString(response.data ,"application/xml");
	
	var cabinet  = { 
					patientNonAffectes:[],
					infirmiers:{}
					};


	/***Remplissage Infirmers****/

	var infirmiersXML = doc.querySelectorAll("infirmier");

	for (var i=0; i<infirmiersXML.length;i++){
		var infirmierTarget = infirmiersXML[i];
		var infirmier = { 
						nom		: infirmierTarget.querySelector("nom").textContent,
						prenom	: infirmierTarget.querySelector("prenom").textContent,
						id		: infirmierTarget.getAttribute("id"),
						photo	: infirmierTarget.querySelector("photo").textContent,
						patient	: []
						}
		var id= infirmierTarget.getAttribute("id");
		cabinet.infirmiers[id] = infirmier;
	}

	/***Remplissage Patient & Affectation Patient*****/
	var patientsXML = doc.querySelectorAll("patient");

	for (i=0; i<patientsXML.length ;i++){
		var patientXML = patientsXML[i];
		var patient = { nom : patientXML.querySelector("nom").textContent,
						prenom : patientXML.querySelector("prenom").textContent,
						sexe : patientXML.querySelector("sexe").textContent,
						naissance : patientXML.querySelector("naissance").textContent,
						numero : patientXML.querySelector("numero").textContent,
						adresse : { 
									
									rue : patientXML.querySelector("adresse").querySelector("rue").textContent,
									ville : patientXML.querySelector("adresse").querySelector("ville").textContent,
									codePostal : patientXML.querySelector("adresse").querySelector("codePostal").textContent
								}
						}
		var intervenant = patientXML.querySelector("visite").getAttribute("intervenant");
		//~ console.log(intervenant);
		if(isset(intervenant)){
			cabinet.infirmiers[intervenant].patient[cabinet.infirmiers[intervenant].patient.length] = patient;
		}
		else
			cabinet.patientNonAffectes[cabinet.patientNonAffectes.length] = patient;
	}
	
	return cabinet; 
}

proxyNF.$inject = [ "$http" ]; // Injection de dépendances

module.exports = function(mod) {
	var id = "proxyNF";
	mod.service(id, proxyNF);
	return id;
};

console.log('coucou nf');
