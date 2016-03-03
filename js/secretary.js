require( "./secretary.css" );

var utils = require( "./utils.js" );
utils.XHR("GET", "data/cabinetInfirmier.xml").then( function(data) {console.log(data);} )

var parser = new DOMParser();
var doc = parser.parseFromString("./data/cabinetInfirmier.xml" ,"application/xml");

var cabinet  = { 
				patientNonAffectes:[],
				infirmiers:{}
				};



/***Remplissage Infirmers****/

var infirmiersXML = doc.querySelectorAll("infirmier");


for (var i=0; i<infirmiersXML.length;i++){
	var infirmierXML = infirmiersXML[i];
	var infirmier = { 
					nom: infirmierXML.querySelector("nom").textContent,
					prenom: infirmierXML.querySelector("prenom").textContent,
					id: infirmierXML.getAttribute("id"),
					patient: []
					}
	var id= infirmierXML.getAttribute("id");
	cabinet.infirmiers[id] = infirmier;
}

console.log("cabinet :");
console.log(cabinet);

/***Remplissage Patient*****/
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
	
	if('null' != intervenant){
		cabinet.infirmiers[intervenant].patient[cabinet.infirmiers[intervenant].patient.length] = patient;
	}
	else
		cabinet.patientNonAffectes[cabinet.patientNonAffectes.length] = patient;
}
