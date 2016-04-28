var proxyNF = function($http) {
		
		$http	.get ( "data/cabinetInfirmier.xml" )
			.then( function(response) {
		
			var parser = new DOMParser();
			var doc = parser.parseFromString(response.data ,"application/xml");

		return doc;	
	})	
	
	this.getData = function(src){
		return $http.get(src).then(proccessData);
	}
	
	this.creerPatient = function (newpatient){
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
		
	this.affecterPatient = function(numCQ,idInfirmier) {
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

