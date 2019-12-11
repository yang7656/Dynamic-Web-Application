// Luca and Shijun
// Scripts for Vue and Leaflet
var app;
var lat =44.949642;
var lng =-93.093124;
var mymap;
var latlng;
var addressLat;
var addressLng;

function Init() {
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
            Neighborhoods: []
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
	mymap.setMaxBounds(mymap.getBounds());
    
    /*
	// marker
    var marker = L.marker([44.954445, -93.091301]).addTo(mymap);
	// latlng in box
	document.getElementsByName('box')[0].placeholder = new L.LatLng(44.954445, -93.091301);
	// latlng in box after click
	mymap.on('click', onMapClick => {
		marker.setLatLng(onMapClick.latlng);
		document.getElementsByName('box')[0].placeholder = onMapClick.latlng;
	});
    */
    
	// latlng in box after pan
	mymap.on("moveend", function() {
        console.log(mymap.getBounds());
        document.getElementsByName('box')[0].placeholder = mymap.getCenter().toString();
        
        
	});
    
    // 17 neighborhoods
    // 1|Conway/Battlecreek/Highwood; southWest = L.latLng(44.951419, -93.025237); northEast = L.latLng(44.963058, -93.004910); 44.956758, -93.015139
    L.marker([44.956758, -93.015139]).addTo(mymap);
    // 2|Greater East Side; southWest = L.latLng(44.963233, -93.045952); northEast = L.latLng(44.991986, -93.005088); 44.977519, -93.025290
    L.marker([44.977519, -93.025290]).addTo(mymap);
    // 3|West Side; southWest = L.latLng(44.919771, -93.128445); northEast = L.latLng(44.942021, -93.057143); 44.931369, -93.082249
    L.marker([44.931369, -93.082249]).addTo(mymap);
    // 4|Dayton's Bluff; 44.957164, -93.057100
    L.marker([44.957164, -93.057100]).addTo(mymap);
    // 5|Payne/Phalen; 44.978208, -93.069673
    L.marker([44.978208, -93.069673]).addTo(mymap);
    // 6|North End; 44.977405, -93.110969
    L.marker([44.977405, -93.110969]).addTo(mymap);
    // 7|Thomas/Dale(Frogtown); 44.960265, -93.118686
    L.marker([44.960265, -93.118686]).addTo(mymap);
    // 8|Summit/University; 44.948581, -93.128205
    L.marker([44.948581, -93.128205]).addTo(mymap);
    // 9|West Seventh; 44.931735, -93.119224
    L.marker([44.931735, -93.119224]).addTo(mymap);
    // 10|Como; 44.982860, -93.150844
    L.marker([44.982860, -93.150844]).addTo(mymap);
    // 11|Hamline/Midway; 44.962891, -93.167436
    L.marker([44.962891, -93.167436]).addTo(mymap);
    // 12|St. Anthony; 44.973546, -93.195991
    L.marker([44.973546, -93.195991]).addTo(mymap);
    // 13|Union Park; 44.948401, -93.174050
    L.marker([44.948401, -93.174050]).addTo(mymap);
    // 14|Macalester-Groveland; 44.934301, -93.175363
    L.marker([44.934301, -93.175363]).addTo(mymap);
    // 15|Highland; 44.911489, -93.172075
    L.marker([44.911489, -93.172075]).addTo(mymap);
    // 16|Summit Hill; 44.937493, -93.136353
    L.marker([44.937493, -93.136353]).addTo(mymap);
    // 17|Capitol River; 44.950459, -93.096462
    L.marker([44.950459, -93.096462]).addTo(mymap);
    
	//DATA FOR TABLE
    $.getJSON('http://localhost:8000/incidents?start_date=2019-10-01&end_date=2019-10-31', (data)=> {
    	app.stpaulcrimes = data;
    });
    $.getJSON('http://localhost:8000/codes', (codes)=> {
    	app.Codes = codes;
    });
    $.getJSON('http://localhost:8000/neighborhoods', (neighborhoods)=> {
    	app.Neighborhoods = neighborhoods;
    });
    // https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=-34.44076&lon=-58.70521 latlng to address
    // https://nominatim.openstreetmap.org/?addressdetails=1&q=bakery+in+berlin+wedding&format=json&limit=1 address to latlng
    
}

function Search(event) {
	/*
	QUERY : https://nominatim.openstreetmap.org/search?<params>
		street=<housenumber> <streetname>
		city=<city>
		county=<county>
		state=<state>
		country=<country>
		postalcode=<postalcode>
	*/
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
			mymap.flyTo(latlng, 18);
	    });
	}

	if (app.searchType === 'latlong') {
		if ((app.userLat>=44.888027 && app.userLat<=44.992017) 
			&& (app.userLng>=-93.208156 && app.userLng<=-93.004975)) {
			latlng = L.latLng(app.userLat, app.userLng);
			mymap.flyTo(latlng, 18);
		}
	}
	
}

function setNominatim(data){
	addressLat = data[0].lat;
	addressLng = data[0].lon;
}

