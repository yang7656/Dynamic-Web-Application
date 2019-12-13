// Luca and Shijun
// Scripts for Vue and Leaflet
var app;
var lat =44.949642;
var lng =-93.093124;
var mymap;
var latlng;
var addressLat;
var addressLng;
var currentAddress;

//function Init(crime_api_url) {
function Init(crime_api_url) {
    console.log(crime_api_url);
	// VUE
	app = new Vue({
		el: '#app',
		data: {
			mapDiv: false,
			tableDiv: false,
			addressDiv: true,
			userLat: "",
			userLng: "",
			inputSearch: "",
            searchType: "select",
            searchTypeOptions: [
            	{ value: "select", text: "select" },
                { value: "address", text: "address" },
                { value: "latlong", text: "latlong" }
            ],
            stpaulcrimes: [],
            Codes: [],
            Neighborhoods: [],
            currentCoordinate: [],
            searchStartDate: "",
            searchEndDate: "",
            searchStartTime: "",
            searchEndTime: "",
            crimeSelected: [],
            neighSelected: [],
            unchangeCrime: []
        },
        methods:{
	        showMap: function(){
	            this.mapDiv = !this.mapDiv;
	        },
	        showTable: function() {
	        	this.tableDiv = !this.tableDiv;
	        },
	        changeAddressDiv: function(value){
	        	if (this.searchType === 'latlong') {
	        		this.addressDiv = false;
	        	} else {
	        		this.addressDiv = true;
	        	}
	        }
    	}
	});
    
	//MAP
	latlng = L.latLng(lat, lng);
	mymap = L.map('mapid', {
		center: latlng,
		zoom: 12
	});//.setView(latlng, 15);
	mymap.setMinZoom(11);
	mymap.setMaxZoom(18);
    var southWest = L.latLng(44.888009, -93.208156);
    var northEast = L.latLng(44.992017, -93.004975);
    var mybounds = L.latLngBounds(southWest, northEast);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    bounds: mybounds,
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(mymap);
	mymap.setMaxBounds(mybounds);//mymap.getBounds());
    
    
	//DATA FOR TABLE
    
    //$.getJSON('http://cisc-dean.stthomas.edu:8036/incidents', (data)=> {
    $.getJSON(crime_api_url+'/incidents', (allData)=> {
        unchangeCrime = allData;
    });
    
    //$.getJSON('http://cisc-dean.stthomas.edu:8036/incidents?start_date=2019-10-01&end_date=2019-10-31', (data)=> {
    $.getJSON(crime_api_url + '/incidents?start_date=2019-10-01&end_date=2019-10-31', (data)=> {
        
        app.stpaulcrimes = data;

        var commited = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var centerOfNeighbor = [];
        var tem = {};
        
        for (var key in data) {
            commited[data[key].neighborhood_number-1]++;
            
            if (data[key].incident.includes("Homicide") || data[key].incident.includes("Rape") || data[key].incident.includes("Assault") || data[key].incident.includes("Asasult") || data[key].incident.includes("Discharge")) {
                app.stpaulcrimes[key].color = '#d9d366';
            }
            else if (data[key].incident.includes("Robbery") || data[key].incident.includes("Theft") || data[key].incident.includes("Burglary") || data[key].incident.includes("Arson") || data[key].incident.includes("Vandalism") || data[key].incident.includes("Graffiti") || data[key].incident.includes("Narcotics")) {
                app.stpaulcrimes[key].color = '#d6a7a7';
            }
            else if (data[key].incident.includes("Police") || data[key].incident.includes("Community")) {
                app.stpaulcrimes[key].color = '#66a9d9';
            }
        }
        
        // 17 neighborhoods
        // 1|Conway/Battlecreek/Highwood; 44.956758, -93.015139
        centerOfNeighbor.push([44.956758, -93.015139]);
        L.marker([44.956758, -93.015139]).addTo(mymap).bindPopup(commited[0]+' crimes commited').openPopup();
        // 2|Greater East Side; 44.977519, -93.025290
        centerOfNeighbor.push([44.977519, -93.025290]);
        L.marker([44.977519, -93.025290]).addTo(mymap).bindPopup(commited[1]+' crimes commited').openPopup();
        // 3|West Side; 44.931369, -93.082249
        centerOfNeighbor.push([44.931369, -93.082249]);
        L.marker([44.931369, -93.082249]).addTo(mymap).bindPopup(commited[2]+' crimes commited').openPopup();
        // 4|Dayton's Bluff; 44.957164, -93.057100
        centerOfNeighbor.push([44.957164, -93.057100]);
        L.marker([44.957164, -93.057100]).addTo(mymap).bindPopup(commited[3]+' crimes commited').openPopup();
        // 5|Payne/Phalen; 44.978208, -93.069673
        centerOfNeighbor.push([44.978208, -93.069673]);
        L.marker([44.978208, -93.069673]).addTo(mymap).bindPopup(commited[4]+' crimes commited').openPopup();
        // 6|North End; 44.977405, -93.110969
        centerOfNeighbor.push([44.977405, -93.110969]);
        L.marker([44.977405, -93.110969]).addTo(mymap).bindPopup(commited[5]+' crimes commited').openPopup();
        // 7|Thomas/Dale(Frogtown); 44.960265, -93.118686
        centerOfNeighbor.push([44.960265, -93.118686]);
        L.marker([44.960265, -93.118686]).addTo(mymap).bindPopup(commited[6]+' crimes commited').openPopup();
        // 8|Summit/University; 44.948581, -93.128205
        centerOfNeighbor.push([44.948581, -93.128205]);
        L.marker([44.948581, -93.128205]).addTo(mymap).bindPopup(commited[7]+' crimes commited').openPopup();
        // 9|West Seventh; 44.931735, -93.119224
        centerOfNeighbor.push([44.931735, -93.119224]);
        L.marker([44.931735, -93.119224]).addTo(mymap).bindPopup(commited[8]+' crimes commited').openPopup();
        // 10|Como; 44.982860, -93.150844
        centerOfNeighbor.push([44.982860, -93.150844]);
        L.marker([44.982860, -93.150844]).addTo(mymap).bindPopup(commited[9]+' crimes commited').openPopup();
        // 11|Hamline/Midway; 44.962891, -93.167436
        centerOfNeighbor.push([44.962891, -93.167436]);
        L.marker([44.962891, -93.167436]).addTo(mymap).bindPopup(commited[10]+' crimes commited').openPopup();
        // 12|St. Anthony; 44.973546, -93.195991
        centerOfNeighbor.push([44.973546, -93.195991]);
        L.marker([44.973546, -93.195991]).addTo(mymap).bindPopup(commited[11]+' crimes commited').openPopup();
        // 13|Union Park; 44.948401, -93.174050
        centerOfNeighbor.push([44.948401, -93.174050]);
        L.marker([44.948401, -93.174050]).addTo(mymap).bindPopup(commited[12]+' crimes commited').openPopup();
        // 14|Macalester-Groveland; 44.934301, -93.175363
        centerOfNeighbor.push([44.934301, -93.175363]);
        L.marker([44.934301, -93.175363]).addTo(mymap).bindPopup(commited[13]+' crimes commited').openPopup();
        // 15|Highland; 44.911489, -93.172075
        centerOfNeighbor.push([44.911489, -93.172075]);
        L.marker([44.911489, -93.172075]).addTo(mymap).bindPopup(commited[14]+' crimes commited').openPopup();
        // 16|Summit Hill; 44.937493, -93.136353
        centerOfNeighbor.push([44.937493, -93.136353]);
        L.marker([44.937493, -93.136353]).addTo(mymap).bindPopup(commited[15]+' crimes commited').openPopup();
        // 17|Capitol River; 44.950459, -93.096462
        centerOfNeighbor.push([44.950459, -93.096462]);
        L.marker([44.950459, -93.096462]).addTo(mymap).bindPopup(commited[16]+' crimes commited').openPopup();
        
        // latlng in box after pan
        mymap.on("moveend", function() {
            
            tem = {};
            
            if (app.addressDiv === true) {
                var centerLatLng = mymap.getCenter();
                $.getJSON('https://nominatim.openstreetmap.org/reverse?format=json&lat='+ centerLatLng.lat +'&lon='+centerLatLng.lng+'&zoom=18&addressdetails=1', (data) => {
                    document.getElementsByName('box2')[0].placeholder = data.address.house_number + ', ' + data.address.road + ', ' + data.address.city;
                });
            }
            else {
                document.getElementsByName('boxlat')[0].placeholder = 'Lat: ' + mymap.getCenter().lat;
                document.getElementsByName('boxlng')[0].placeholder = 'Lng: ' + mymap.getCenter().lng;
            }
            
            for (var key in data) {
                
                var nei_lat = centerOfNeighbor[data[key].neighborhood_number-1][0];
                var nei_lng = centerOfNeighbor[data[key].neighborhood_number-1][1];
                var viwe_bounds = mymap.getBounds();
                if (insideArea(viwe_bounds, nei_lat, nei_lng)) {
                    tem[key] = data[key];
                }
            }
            app.stpaulcrimes = tem;
        });
    });
    
    //$.getJSON('http://cisc-dean.stthomas.edu:8036/codes', (codes)=> {
    $.getJSON(crime_api_url+'/codes', (codes)=> {
    	app.Codes = codes;
    });
    
    //$.getJSON('http://cisc-dean.stthomas.edu:8036/neighborhoods', (neighborhoods)=> {
    $.getJSON(crime_api_url+'/neighborhoods', (neighborhoods)=> {
        app.Neighborhoods = neighborhoods;
    });
    
}

function insideArea(viewBounds, point_lat, point_lng) {
    
    var bound_lat = [viewBounds._southWest.lat, viewBounds._northEast.lat];
    var bound_lng = [viewBounds._southWest.lng, viewBounds._northEast.lng];
    
    if (point_lat > bound_lat[0] && point_lat < bound_lat[1] && point_lng > bound_lng[0] && point_lng < bound_lng[1]) {
        return true;
    }
    else {
        return false;
    }
}

function Search(event) {
	var queryNominatim = 'https://nominatim.openstreetmap.org/search?';
    
	if (app.searchType === 'select' || app.searchType === 'address') {
		var street = app.inputSearch.split(' ');
		var streetName;
		for (var i = 0; i < street.length; i++) {
			if (i == 0) {
				streetName = street[0];
			} else {
				streetName = streetName + '%20' + street[i];
			}
		}

		let request = {
	        url: queryNominatim + 'street='+ streetName +'&city=St%20Paul&state=MN&format=json',
	        dataType: "json",
	        success: setNominatim
	    };

	    $.ajax(request).then(() => {
	    	latlng = L.latLng(addressLat, addressLng);
			//mymap.flyTo(latlng, 18);
			mymap.setView(latlng, 18);
	    });
	}

	if (app.searchType === 'latlong') {
		/*if ((app.userLat>=44.888027 && app.userLat<=44.992017) 
			&& (app.userLng>=-93.208156 && app.userLng<=-93.004975)) {*/
			latlng = L.latLng(app.userLat, app.userLng);
			//mymap.flyTo(latlng, 18);

			mymap.setView(latlng, 18)
		//}
	}
	
}

function SearchUpper (event) {
    
    //var stpaulapi = 'http://cisc-dean.stthomas.edu:8000/incidents?';
    //var stpaulapi = crime_api_url+'/incidents?';
    var tem2 = {};
    var tem1 = {};
    var tem = app.stpaulcrimes;
    var nei_num = [];
    
    if (app.searchStartDate !== '' || app.searchEndDate !== '') {
        if (app.searchStartDate !== '') {
            stpaulapi += 'start_date=' + app.searchStartDate + '&';
        }
        
        if (app.searchEndDate !== '') {
            stpaulapi += 'end_date=' + app.searchEndDate + '&';
        }
        
        $.getJSON(stpaulapi, (newDateData)=> {
            app.stpaulcrimes = newDateData;
        });
    }
    
    if (app.searchStartTime !== '' || app.searchEndTime !== '') {
        
        var startH = parseInt(app.searchStartTime.split(':')[0]),
            startM = parseInt(app.searchStartTime.split(':')[1]),
            endH = parseInt(app.searchEndTime.split(':')[0]),
            endM = parseInt(app.searchEndTime.split(':')[1]);
        // 12:00 AM => 0:00 
        
        for (var key in app.stpaulcrimes) {
            
            var keyH = parseInt(tem[key].time.split(':')[0]),
                keyM = parseInt(tem[key].time.split(':')[1]);
            
            if (keyH > startH && keyH < endH) {
                tem[key] = app.stpaulcrimes[key];
            } 
            else if (keyH === startH || keyH === endH) {
                if (keyM > startM && keyM < endM) {
                    tem[key] = app.stpaulcrimes[key];
                }
                else if (keyM === startM || keyM === endM) {
                    tem[key] = app.stpaulcrimes[key];
                }
            }
        }
    }
    else {
        tem = app.stpaulcrimes;
    }
    
    for (let k = 0; k < app.neighSelected.length; k++) {
        nei_num.push(parseInt(app.neighSelected[k], 10));
    }
    
    if (app.crimeSelected.length > 0) {
        for (var key in tem) {
            for (let i = 0; i < app.crimeSelected.length; i++) {
                if (tem[key].incident.includes(app.crimeSelected[i])) {
                    tem1[key] = tem[key];
                }
            }
        }
    }
    else {
        tem1 = tem;
    }
    
    for (var keys in tem1) {
        for (let j = 0; j < nei_num.length; j++) {
            if (parseInt(tem1[keys].neighborhood_number, 10) === nei_num[j]) {
                tem2[keys] = tem1[keys];
            }
        }
    }
    
    app.stpaulcrimes = tem2;    
    
    
    
    
    
    
    
    /*
	var stpaulapi = 'http://localhost:8000/incidents?';
	if (app.crimeSelected.length > 0) {
		stpaulapi += 'code=';
		for (let i = 0; i < app.crimeSelected.length; i++) {
			if (i == app.crimeSelected.length-1) { // is last
				stpaulapi += app.crimeSelected[i] + '&';
			} else {
				stpaulapi += app.crimeSelected[i] + ',';
			}
		}
	} 

	if (app.neighSelected.length > 0) {
		stpaulapi += 'id=';
		for (let i = 0; i < app.neighSelected.length; i++) {
			if (i == app.neighSelected.length-1) { // is last
				stpaulapi += app.neighSelected[i] + '&';
			} else {
				stpaulapi += app.neighSelected[i] + ',';
			}
		}
	} 

	if (app.searchStartDate !== '') {
		stpaulapi += 'start_date='+app.searchStartDate+'&';
	} 

	if (app.searchEndDate !== '') {
		stpaulapi += 'end_date='+app.searchEndDate+'&';
	}
	console.log(stpaulapi);
	// Get The Search done !
	$.getJSON(stpaulapi, (data)=> {   
        
        var temporary = {};
        //console.log(app.searchTime);
        if (app.searchStartTime !== '' && app.searchEndTime !== '') {
            // adjusting time
            startArr =app.searchStartTime.split(':');
            endArr =app.searchEndTime.split(':');
            if(startArr.length == 2) {
                //app.searchStartTime += ':00';
                app.searchStartTime = startArr[0] + startArr[1] + '00';
                parseInt(app.searchStartTime);
            }
            if(startArr.length == 0) {
                app.searchStartTime = startArr[0] + '0000';
                parseInt(app.searchStartTime);
            }
            if(endArr.length == 2) {
                //app.searchStartTime += ':00';
                app.searchEndTime = endArr[0] + endArr[1] + '00';
                parseInt(app.searchEndTime);
            }
            if(endArr.length == 0) {
                app.searchEndTime = endArr[0] + '0000';
                parseInt(app.searchEndTime);
            }

            for (var key in data) {
                let timeData = data[key].time.split('.');
                var ti = timeData[0];
                if (ti >= app.searchStartTime && ti<=app.searchEndTime) {
                    temporary[key] = data[key];
                }
            }
            
            app.stpaulcrimes = temporary;
        } else {
            console.log(data);
            app.stpaulcrimes = data;

        }
    });
    */
}

function getLatLng(address) {
	var queryNominatim = 'https://nominatim.openstreetmap.org/search?';
	var street = address.split(' ');
	var streetName;
	for (var i = 0; i < street.length; i++) {
		if (i == 0) {
			streetName = street[0];
		} else {
			streetName = streetName + '%20' + street[i];
		}
	}

    $.getJSON(queryNominatim + 'street='+ streetName +'&city=St%20Paul&state=MN&format=json', (data)=> {
    	addressLat = data[0].lat;
		addressLng = data[0].lon;
		return Promise.resolve();
    });
	
}

function setNominatim(data){
	addressLat = data[0].lat;
	addressLng = data[0].lon;
}

function Visualize(event, address, date, time, incident) {

	var queryNominatim = 'https://nominatim.openstreetmap.org/search?';
	var street = address.split(' ');
	var streetName;

	if (street[0].includes('X') && !isNaN(street[0].charAt(0))) {
		street[0] = street[0].replace('X', '0');
	}
	
	for (var i = 0; i < street.length; i++) {
		if (i == 0) {
			streetName = street[0];
		} else {
			streetName = streetName + '%20' + street[i];
		}
	}

    $.getJSON(queryNominatim + 'street='+ streetName +'&city=St%20Paul&state=MN&format=json', (data)=> {
    	addressLat = data[0].lat;
		addressLng = data[0].lon;
		latlng = L.latLng(addressLat, addressLng);
		mymap.flyTo(latlng, 18); // should it fly to ?
		var mark = L.marker(latlng).addTo(mymap).bindPopup(address + ', ' + date + ' at ' + time + ',\ntype : ' + incident).openPopup();
		mark.on('mouseover', function(e) { mymap.removeLayer(mark); });
    });


}
