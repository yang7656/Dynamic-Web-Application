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
var crimeURL;
var mrker_list = [];

//function Init(crime_api_url) {
function Init(crime_api_url) {
    
    crimeURL = crime_api_url;
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
            stpaulcrimes: {},
            stpaulcrimesBackup: {},
            Codes: [],
            Neighborhoods: [],
            currentCoordinate: [],
            commited: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            searchStartDate: "",
            searchEndDate: "",
            searchStartTime: "",
            searchEndTime: ""
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
	        },
            clickAllNeighbor: function() {
                if ($(".select_all_neighbor")[0].checked) {
                    for (let i = 0; i < $(".neighbor_option").length; i++) {
                        $(".neighbor_option")[i].checked = true;
                    }
                }
                else {
                    for (let i = 0; i < $(".neighbor_option").length; i++) {
                        $(".neighbor_option")[i].checked = false;
                    }
                }
            },
            clickAllCrime: function() {
                if ($(".select_all_crimes")[0].checked) {
                    for (let i = 0; i < $(".crime_option").length; i++) {
                        $(".crime_option")[i].checked = true;
                    }
                }
                else {
                    for (let i = 0; i < $(".crime_option").length; i++) {
                        $(".crime_option")[i].checked = false;
                    }
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
    $.getJSON(crime_api_url + '/incidents?start_date=2019-10-01&end_date=2019-10-31', (data)=> {
        
        app.stpaulcrimes = data;
        app.stpaulcrimesBackup = data;
        var centerOfNeighbor = [];
        
        for (var key in data) {
            app.commited[data[key].neighborhood_number-1]++;
            
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
        var marker1 = L.marker([44.956758, -93.015139]).addTo(mymap).bindPopup(app.commited[0]+' crimes commited in Conway').openPopup();
        // 2|Greater East Side; 44.977519, -93.025290
        centerOfNeighbor.push([44.977519, -93.025290]);
        var marker2 = L.marker([44.977519, -93.025290]).addTo(mymap).bindPopup(app.commited[1]+' crimes commited in Greater East Side').openPopup();
        // 3|West Side; 44.931369, -93.082249
        centerOfNeighbor.push([44.931369, -93.082249]);
        var marker3 = L.marker([44.931369, -93.082249]).addTo(mymap).bindPopup(app.commited[2]+' crimes commited in West Side').openPopup();
        // 4|Dayton's Bluff; 44.957164, -93.057100
        centerOfNeighbor.push([44.957164, -93.057100]);
        var marker4 = L.marker([44.957164, -93.057100]).addTo(mymap).bindPopup(app.commited[3]+" crimes commited in Dayton's Bluff").openPopup();
        // 5|Payne/Phalen; 44.978208, -93.069673
        centerOfNeighbor.push([44.978208, -93.069673]);
        var marker5 = L.marker([44.978208, -93.069673]).addTo(mymap).bindPopup(app.commited[4]+' crimes commited in Payne/Phalen').openPopup();
        // 6|North End; 44.977405, -93.110969
        centerOfNeighbor.push([44.977405, -93.110969]);
        var marker6 = L.marker([44.977405, -93.110969]).addTo(mymap).bindPopup(app.commited[5]+' crimes commited in North End').openPopup();
        // 7|Thomas/Dale(Frogtown); 44.960265, -93.118686
        centerOfNeighbor.push([44.960265, -93.118686]);
        var marker7 = L.marker([44.960265, -93.118686]).addTo(mymap).bindPopup(app.commited[6]+' crimes commited in Thomas/Dale(Frogtown)').openPopup();
        // 8|Summit/University; 44.948581, -93.128205
        centerOfNeighbor.push([44.948581, -93.128205]);
        var marker8 = L.marker([44.948581, -93.128205]).addTo(mymap).bindPopup(app.commited[7]+' crimes commited in Summit/University').openPopup();
        // 9|West Seventh; 44.931735, -93.119224
        centerOfNeighbor.push([44.931735, -93.119224]);
        var marker9 = L.marker([44.931735, -93.119224]).addTo(mymap).bindPopup(app.commited[8]+' crimes commited in West Seventh').openPopup();
        // 10|Como; 44.982860, -93.150844
        centerOfNeighbor.push([44.982860, -93.150844]);
        var marker10 = L.marker([44.982860, -93.150844]).addTo(mymap).bindPopup(app.commited[9]+' crimes commited in Como').openPopup();
        // 11|Hamline/Midway; 44.962891, -93.167436
        centerOfNeighbor.push([44.962891, -93.167436]);
        var marker11 = L.marker([44.962891, -93.167436]).addTo(mymap).bindPopup(app.commited[10]+' crimes commited in Hamline/Midway').openPopup();
        // 12|St. Anthony; 44.973546, -93.195991
        centerOfNeighbor.push([44.973546, -93.195991]);
        var marker12 = L.marker([44.973546, -93.195991]).addTo(mymap).bindPopup(app.commited[11]+' crimes commited in St. Anthony').openPopup();
        // 13|Union Park; 44.948401, -93.174050
        centerOfNeighbor.push([44.948401, -93.174050]);
        var marker13 = L.marker([44.948401, -93.174050]).addTo(mymap).bindPopup(app.commited[12]+' crimes commited in Union Park').openPopup();
        // 14|Macalester-Groveland; 44.934301, -93.175363
        centerOfNeighbor.push([44.934301, -93.175363]);
        var marker14 = L.marker([44.934301, -93.175363]).addTo(mymap).bindPopup(app.commited[13]+' crimes commited in Macalester-Groveland').openPopup();
        // 15|Highland; 44.911489, -93.172075
        centerOfNeighbor.push([44.911489, -93.172075]);
        var marker15 = L.marker([44.911489, -93.172075]).addTo(mymap).bindPopup(app.commited[14]+' crimes commited in Highland').openPopup();
        // 16|Summit Hill; 44.937493, -93.136353
        centerOfNeighbor.push([44.937493, -93.136353]);
        var marker16 = L.marker([44.937493, -93.136353]).addTo(mymap).bindPopup(app.commited[15]+' crimes commited in Summit Hill').openPopup();
        // 17|Capitol River; 44.950459, -93.096462
        centerOfNeighbor.push([44.950459, -93.096462]);
        var marker17 = L.marker([44.950459, -93.096462]).addTo(mymap).bindPopup(app.commited[16]+' crimes commited in Capitol River').openPopup();
        
        // list contain all markers
        mrker_list.push(marker1);
        mrker_list.push(marker2);
        mrker_list.push(marker3);
        mrker_list.push(marker4);
        mrker_list.push(marker5);
        mrker_list.push(marker6);
        mrker_list.push(marker7);
        mrker_list.push(marker8);
        mrker_list.push(marker9);
        mrker_list.push(marker10);
        mrker_list.push(marker11);
        mrker_list.push(marker12);
        mrker_list.push(marker13);
        mrker_list.push(marker14);
        mrker_list.push(marker15);
        mrker_list.push(marker16);
        mrker_list.push(marker17);
        
        // latlng in box after pan
        mymap.on("moveend", function() {
            
            var tem = {};
            var newCommited = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            
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
            
            // new number commit in neighborhoods
            for (var key in app.stpaulcrimes) {
                newCommited[app.stpaulcrimes[key].neighborhood_number-1]++;
            }
            // marker1.dragging._marker._popup._content
            for (let i = 0; i < mrker_list.length; i++) {
                var content = mrker_list[i].dragging._marker._popup._content.split(' ');
                var newContent = '' + newCommited[i] + ' ';
                for (let j = 1; j < content.length; j++) {
                    newContent += content[j] + ' ';
                }
                mrker_list[i].dragging._marker._popup._content = newContent;
            }
            
        });
    });
    
    $.getJSON(crime_api_url+'/codes', (codes)=> {
    	app.Codes = codes;
    });
    
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
			mymap.setView(latlng, 18);
	    });
	}

	if (app.searchType === 'latlong') {
        latlng = L.latLng(app.userLat, app.userLng);
        mymap.setView(latlng, 18)
	}
	
}

function SearchUpper(event) {
    
    var stpaulapi = crimeURL+'/incidents?';
    var tem = {};
    var tem1 = {};
    var tem2 = {};
    var nei_num = [];
    var crimeSelected = [];
    var neighSelected = [];
    var newCommited = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    // what crimes are selected
    for (let i = 0; i < $('.crime_option').length; i++) {
        if ($('.crime_option')[i].checked) {
            crimeSelected.push($('.crime_option')[i].value);
        }
    }
    // what neighborhoods are selected
    for (let j = 0; j < $('.neighbor_option').length; j++) {
        if ($('.neighbor_option')[j].checked) {
            neighSelected.push($('.neighbor_option')[j].value);
        }
    }
    
    if (app.searchStartDate !== '' || app.searchEndDate !== '') {
        if (app.searchStartDate !== '') {
            stpaulapi += 'start_date=' + app.searchStartDate + '&';
        }
        
        if (app.searchEndDate !== '') {
            stpaulapi += 'end_date=' + app.searchEndDate + '&';
        }
        console.log(stpaulapi);
        $.getJSON(stpaulapi, (data)=> {
            
            if (app.searchStartTime !== '' || app.searchEndTime !== '') {
            
                var startH = parseInt(app.searchStartTime.split(':')[0]),
                    startM = parseInt(app.searchStartTime.split(':')[1]),
                    endH = parseInt(app.searchEndTime.split(':')[0]),
                    endM = parseInt(app.searchEndTime.split(':')[1]);
                // 12:00 AM => 0:00 
            
                for (var key in data) {
                    
                    var keyH = parseInt(data[key].time.split(':')[0]),
                        keyM = parseInt(data[key].time.split(':')[1]);
                    
                    if (keyH > startH && keyH < endH) {
                        tem[key] = data[key];
                    }
                    if (keyH === startH) {
                        if (keyM >= startM) {
                            tem[key] = data[key];
                        }
                    }
                    if (keyH === endH) {
                        if (keyM <= endM) {
                            tem[key] = data[key];
                        }
                    }
                }
                
                for (var key in tem) {
                    if (tem[key].incident.includes("Homicide") || tem[key].incident.includes("Rape") || tem[key].incident.includes("Assault") || tem[key].incident.includes("Asasult") || tem[key].incident.includes("Discharge")) {
                        tem[key].color = '#d9d366';
                    }
                    else if (tem[key].incident.includes("Robbery") || tem[key].incident.includes("Theft") || tem[key].incident.includes("Burglary") || tem[key].incident.includes("Arson") || tem[key].incident.includes("Vandalism") || tem[key].incident.includes("Graffiti") || tem[key].incident.includes("Narcotics")) {
                        tem[key].color = '#d6a7a7';
                    }
                    else if (tem[key].incident.includes("Police") || tem[key].incident.includes("Community")) {
                        tem[key].color = '#66a9d9';
                    }
                }
            }
            else {
                tem = data;
                
                for (var key in tem) {
                    if (tem[key].incident.includes("Homicide") || tem[key].incident.includes("Rape") || tem[key].incident.includes("Assault") || tem[key].incident.includes("Asasult") || tem[key].incident.includes("Discharge")) {
                        tem[key].color = '#d9d366';
                    }
                    else if (tem[key].incident.includes("Robbery") || tem[key].incident.includes("Theft") || tem[key].incident.includes("Burglary") || tem[key].incident.includes("Arson") || tem[key].incident.includes("Vandalism") || tem[key].incident.includes("Graffiti") || tem[key].incident.includes("Narcotics")) {
                        tem[key].color = '#d6a7a7';
                    }
                    else if (tem[key].incident.includes("Police") || tem[key].incident.includes("Community")) {
                        tem[key].color = '#66a9d9';
                    }
                }
            }
            
            for (let k = 0; k < neighSelected.length; k++) {
                nei_num.push(parseInt(neighSelected[k], 10));
            }
            
            if (crimeSelected.length > 0) {
                for (var key in tem) {
                    for (let i = 0; i < crimeSelected.length; i++) {
                        if (tem[key].incident.includes(crimeSelected[i])) {
                            tem1[key] = tem[key];
                        }
                    }
                }
            }
            else if (crimeSelected.length === 0) {
                tem1 = {};
            }
            
            if (nei_num.length > 0) {
                for (var keys in tem1) {
                    for (let j = 0; j < nei_num.length; j++) {
                        if (parseInt(tem1[keys].neighborhood_number, 10) === nei_num[j]) {
                            tem2[keys] = tem1[keys];
                        }
                    }
                }
            }
            else if (nei_num.length === 0) {
                tem2 = {};
            }
            app.stpaulcrimes = tem2;
            
            // new number commit in neighborhoods
            for (var key in app.stpaulcrimes) {
                newCommited[app.stpaulcrimes[key].neighborhood_number-1]++;
            }
            // marker1.dragging._marker._popup._content
            for (let i = 0; i < mrker_list.length; i++) {
                var content = mrker_list[i].dragging._marker._popup._content.split(' ');
                var newContent = '' + newCommited[i] + ' ';
                for (let j = 1; j < content.length; j++) {
                    newContent += content[j] + ' ';
                }
                mrker_list[i].dragging._marker._popup._content = newContent;
            }
            
        });
    }
    else if (app.searchStartDate === '' && app.searchEndDate === '') {
        // no date change filter
        if (app.searchStartTime !== '' || app.searchEndTime !== '') {
            
            var startH = parseInt(app.searchStartTime.split(':')[0]),
                startM = parseInt(app.searchStartTime.split(':')[1]),
                endH = parseInt(app.searchEndTime.split(':')[0]),
                endM = parseInt(app.searchEndTime.split(':')[1]);
            // 12:00 AM => 0:00 
        
            for (var key in app.stpaulcrimesBackup) {
                
                var keyH = parseInt(app.stpaulcrimesBackup[key].time.split(':')[0]),
                    keyM = parseInt(app.stpaulcrimesBackup[key].time.split(':')[1]);
                
                if (keyH > startH && keyH < endH) {
                    tem[key] = app.stpaulcrimesBackup[key];
                }
                if (keyH === startH) {
                    if (keyM >= startM) {
                        tem[key] = app.stpaulcrimesBackup[key];
                    }
                }
                if (keyH === endH) {
                    if (keyM <= endM) {
                        tem[key] = app.stpaulcrimesBackup[key];
                    }
                }
            }
        }
        else {
            tem = app.stpaulcrimesBackup;
        }
        
        for (let k = 0; k < neighSelected.length; k++) {
            nei_num.push(parseInt(neighSelected[k], 10));
        }
        
        if (crimeSelected.length > 0) {
            for (var key in tem) {
                for (let i = 0; i < crimeSelected.length; i++) {
                    if (tem[key].incident.includes(crimeSelected[i])) {
                        tem1[key] = tem[key];
                    }
                }
            }
        }
        else if (crimeSelected.length === 0) {
            tem1 = {};
        }
        
        if (nei_num.length > 0) {
            for (var keys in tem1) {
                for (let j = 0; j < nei_num.length; j++) {
                    if (parseInt(tem1[keys].neighborhood_number, 10) === nei_num[j]) {
                        tem2[keys] = tem1[keys];
                    }
                }
            }
        }
        else if (nei_num.length === 0) {
            tem2 = {};
        }
        app.stpaulcrimes = tem2;
    }
    
    // new number commit in neighborhoods
    for (var key in app.stpaulcrimes) {
        newCommited[app.stpaulcrimes[key].neighborhood_number-1]++;
    }
    // marker1.dragging._marker._popup._content
    for (let i = 0; i < mrker_list.length; i++) {
        var content = mrker_list[i].dragging._marker._popup._content.split(' ');
        var newContent = '' + newCommited[i] + ' ';
        for (let j = 1; j < content.length; j++) {
            newContent += content[j] + ' ';
        }
        mrker_list[i].dragging._marker._popup._content = newContent;
    }
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
