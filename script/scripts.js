// Luca and Shijun

var app;

function Init() {
	
	var map = L.map('map').setView([44.954445, -93.091301], 11);
	L.tileLayer("https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=IBQRTgg4PbevBpCDSJFF", {
		attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
		maxZoom: 18,
		minZoom: 11
	}).addTo(map);
	
	var marker = L.marker([44.954445, -93.091301]).addTo(map);
	
	document.getElementsByName('search')[0].placeholder = new L.LatLng(44.954445, -93.091301);
	
	map.on('click', onMapClick => {
		marker.setLatLng(onMapClick.latlng);
		document.getElementsByName('search')[0].placeholder = onMapClick.latlng;
	});
	
	map.on("moveend", function() {
	  document.getElementsByName('search')[0].placeholder = map.getCenter().toString();
	});
	
	console.log(document.getElementById("search").values);
	
	
	
	
	
	
	
	var app = new Vue({
		el: '#app',
		data: {
	    	message: 'Hello Vue!'
		}
	});
}

function onMapClick(e) {
	return e.latlng;
}
