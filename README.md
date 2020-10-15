# How to install/run
create a database on mysql
edit ormconfig.json, mit eben diesen daten
run npm i
run npm start
Application legt automatisch einen user "admin" pw: "pleaseChange" an wenn kein user vorhanden
Collection fuer Postman ist in CodingExample.postman_collection
	app nutzt tokenbasierte Authentication, es duerfte also noetig sein die authentication token im header zu aendern, Die token sind im response header vom login enthalten
	also api/v1/login, admin:pleaseChange, return header hat den token fuer weitere requests
	(der key ist derzeit in der default.json config der einfachheit halber, sollte natuerlich normalerweise .env sein und teil der deploy chain)

# API enpoints
/api/v1/users
	GET (admin)
	POST (admin)
	DELETE (admin)
	PUT (admin)

	../current
		GET (auth)
	../login (open)
		POST

/api/v1/userhobbies
	POST (auth)
	DELETE (auth)
	GET (auth)
	../sortedByOccurence (auth)
		GET
	../forUser (admin)
		GET
		
# Known limitations:
Noch kein endpoint fuer hobbies - (war auch nicht weiter spezifiziert), Hobbies werden derzeit einfach mit angelegt wenn nicht vorhanden
	(Koennte natuerlich eine einfache CRUD API fuer admins sein, ist jetzt aber auch nur noch fleissarbeit)
Kein logging
API-Mapping (Db-Modell zu api-modell) nur fuer users, best practice waere natuerlich fuer alle modelle
