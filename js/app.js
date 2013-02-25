/**
  * File:		app.js
  * Desc:		 
  * Version:	1.0
  * Author:		Robb HedricK 
  *
*/
 
// GLOBAL VARS & FUNCTIONS
var server = 'www.robbhedrick.com/projects/web/cagis';
var service = "http://" + server + "/jsonp.php?callback=?";
var latitude, longitude, latLng;
var directionsSservice, directionsDisplay, geocoder, infowindow, map;
var properties, property;


/**
  * Desc: Success call back function for geo positioning.
  * Para: [p] - Current position object.
*/
function geoSuccessCallback(p){
	latitude = p.coords.latitude.toFixed(6);
	longitude = p.coords.longitude.toFixed(6);
	gMapLoadScript(); // Call function to load Google Maps APIs.
}

/**
  * Desc: Error call back function for geo positioning.
  * Para: [p] - Current position object.
*/
function geoErrorCallback(p) {
	alert('error='+p.code);
}

/**
  * Desc: Create new script element for Google Maps APIs.
  * Note: Callback [gMapInitialize]
*/
function gMapLoadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAG-2qJnw4jka8jrjXLWpRqd2qz5fHgxFo&sensor=false&callback=gMapInitialize";
  document.body.appendChild(script);
}

/**
  * Desc: Create new Google Map objects and service intances.
*/
function gMapInitialize() {
  
  // New instance of GM LatLng object.
  latLng = new google.maps.LatLng(latitude, longitude);
  
  // Set GM options
  var options = { zoom: 8, mapTypeId: google.maps.MapTypeId.ROADMAP, center: latLng};
  
  // New instance of og Googe Maps.
  map = new google.maps.Map(document.getElementById("map_canvas"), options);
  
  // Create new instances of GM InfoWindow and Geocoder 
  infowindow = new google.maps.InfoWindow();
  geocoder = new google.maps.Geocoder();
  
  // Create new instances of GM direction services and set current map.
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  
  // Reverse geo code function
  gMapCodeLatLng(latLng);
}

/**
  * Desc: 
*/
function gMapCalcRoute() {
  var location = document.getElementById("location").value;
  var selectedMode = document.getElementById("mode").value;
  var request = {
      origin: latLng,
      destination: location,
      travelMode: google.maps.TravelMode[selectedMode]
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

/**
  * Desc: GM geo code by latitude and longitude
*/
function gMapCodeLatLng(latlng) {
	geocoder.geocode({'latLng': latlng}, function(results, status) {
	  if (status == google.maps.GeocoderStatus.OK) {
	    if (results[1]) {
	      map.setZoom(18);
	      marker = new google.maps.Marker({
	          position: latlng,
	          map: map
	      });
	      //infowindow.setContent(results[1].formatted_address);
	      //infowindow.open(map, marker);
	    }
	  } else {
	    alert("Geocoder failed due to: " + status);
	  }
	});
}

/**
  * Desc: GM geo code by address.
*/
function gMapCodeAddress(address) {
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			/*map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
        		map: map,
        		position: results[0].geometry.location
        	});*/
        	document.getElementById("location").value = results[0].geometry.location;
        	gMapCalcRoute();
        } else {
    		alert("Geocode was not successful for the following reason: " + status);
    	}
    });
}


/** Runtime ------------------------------------------------------------------------------------------
  *
*/
if (navigator.userAgent.match(/IEMobile\/10\.0/)) { // Meta viewport if IE moible 10 browser
	var msViewportStyle = document.createElement("style");
	msViewportStyle.appendChild(
		document.createTextNode("@-ms-viewport{width:auto!important}")
	);
	document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}

if(geo_position_js.init()) { // Initiate geo positioning services.
	geo_position_js.getCurrentPosition(geoSuccessCallback,geoErrorCallback,{enableHighAccuracy:true});
}else{
	alert("Functionality not available");
}
 
/** jQuery --------------------------------------------------------------------------------------------
  *
*/
$(function() {
		
	$("body").on("click", "a.report", function() {  // Event: Propery Report Dialog Window
		var title = $(this).text();
		var coord_str = $(this).attr("rel");
		
		$('#modal div.modal-header h3').text(title);
		$("#modal").modal("show");
		
		$.fn.getPropertyReport(coord_str);
		
		return false;
	});

	$("body").on("click", "a.btn-popover", function() { // Event: Phone View Popovers
		var ele = $(this);
		var elems = $("a.btn-popover"), count = elems.length;
		if(count >= 1) {
			$(elems).each(function(){
				$(this).popover("destroy");
				if (!--count) $(ele).popover("show");
			});
		} else {
			$(ele).popover("show");
		}
		return false;
	});
	
	$('body').on("click", "#report-tabs a", function (e) { // Event: Tabs Toggle on Property Report Modal Window
		e.preventDefault();
		$(this).tab('show');
	});
	
	$("#droppable").droppable( { // Event: jQuery UI Droppable Area For GM Directions.
	  drop: function( event, ui ) {
	  	  var address = ui.draggable.attr("alt");
	      $(this).find(".placeholder").text(address);
	       gMapCodeAddress(address);
	  }
	});
	
	$.fn.googleImageMap = function(locaion, type) {
		var src = 'http://maps.googleapis.com/maps/api/';
		
		switch(type){
			case 'satellite':
				src = src + 'staticmap?center='+locaion;
				src = src + '&markers=size:mid|color:red|'+locaion;
				src = src + '&zoom=19&size=640x640&maptype=satellite&sensor=false';
				break;
			case 'standard':
				src = src + 'staticmap?center='+locaion;
				src = src + '&markers=size:mid|color:red|'+locaion;
				src = src + '&zoom=18&size=640x640&sensor=false';
				break;
			case 'streetview':
				src = src + 'streetview?size=640x640&location='+locaion+'&sensor=false';
				break;
		}
			
		var map = '<a class="map" href="'+src+'"><img src="'+src+'" /></a>';

		return map;
	};
					
	// this function will do some basic things to set and get the stage for search result. 
	$.fn.search = function() {
		return this.submit(function(event){
			event.preventDefault();
			
			// get value of hidden field in  form.
			var phone = $(this).find(':hidden[name=phone]').val();
			
			// get value of field in search form.
			var location = $(this).find(':input[name=location]').val();
			
			// set loading true...
			$.fn.loader(true);
			
			// calling this function will determine one or many results.
			$.fn.geoCodeLocator(phone, location);	
			
			return false;
		});
	};
	
	// getPropertyReport
	$.fn.getPropertyReport = function(strCoords) {
		
		var results = {"parcel":[],"zoning":[],};
		var coords = strCoords.split(",");
		var parcel_attributes, parcel_desired;
		
		var ele = $('#modal div.modal-body');
		 	ele.html('<h3 class="loader">Loading...<h3/>');

		$.getJSON(service,{action: 'getPropertyReport', x: coords[0], y: coords[1]}, function(data){
			if(data.locationReportResult.ParcelQueryData){
				
				var location = data.locationReportResult.AddressQueryData.AddressAttributes.addressWCity;
				
				if(data.locationReportResult.ParcelQueryData.isCondoProperty){
					parcel_attributes = data.locationReportResult.ParcelQueryData.CondoParcelData.ListCondoUnits.CGParcelAttributes[2];
					parcel_desired = ["OWNNM1","OWNNM2","OWNAD1","OWNAD2","MKTLND","MKTIMP","MKT_TOTAL_VAL","ANNUAL_TAXES"];
				}else{
					parcel_attributes = data.locationReportResult.ParcelQueryData.AudParcelAttributes.ParcelAttributes.ParcelAttribute;
					parcel_desired = ["OWNNM1","OWNNM2","OWNAD1","OWNAD2","MKTLND","MKTIMP","MKT_TOTAL_VAL","ANNUAL_TAXES"];
				}
				
				var zoning_attributes = data.locationReportResult.ZoningQueryData.ZoningAttributes.ZoningAttribute;
				var zoning_desired = ["PHONE","BND_NAME","ADDRESS","ZONING","zoning_codedescription"];
				
				// add tabs:
				var tabs = '<ul id="report-tabs" class="nav nav-tabs">';
					tabs = tabs + '<li><a href="#tab1" data-toggle="tab">Parcel Info</a></li>';
					tabs = tabs + '<li><a href="#tab2" data-toggle="tab">Zoning Info</a></li>';
					tabs = tabs + '<li><a href="#tab3" data-toggle="tab">Maps</a></li>';
					tabs = tabs + "</ul>";
					
				// tab1: basic property information					
				var tab1 = '<div class="tab-pane active" id="tab1">';
					tab1 = tab1 + '<table class="table">';
					tab1 = tab1 + '<thead><tr><th>Label</th><th>Value</th></tr></thead>';
					tab1 = tab1 + '<tbody>';
					
					$.each(parcel_attributes, function (i, item) {
						
						if($.inArray(item.Name,parcel_desired) != -1){
							var item_label = item.Label;
							var item_value = "";
							if(item.Value){
								item_value = item.Value;
							}
							tab1 = tab1 + '<tr><td>' + item_label+ '</td><td>' + item_value+ '</td></tr>';
						}
						
					});
					
					tab1 = tab1 + '</tbody></table></div>';
				
				// tab2: basic property information					
				var tab2 = '<div class="tab-pane" id="tab2">';
					tab2 = tab2 + '<table class="table">';
					tab2 = tab2 + '<thead><tr><th>Label</th><th>Value</th></tr></thead>';
					tab2 = tab2 + '<tbody>';
					
					$.each(zoning_attributes, function (i, item) {
						
						if($.inArray(item.Name,zoning_desired) != -1){
							var item_label = item.Label;
							var item_value = "";
							if(item.Value){
								item_value = item.Value;
							}
							tab2 = tab2 + '<tr><td>' + item_label+ '</td><td>' + item_value+ '</td></tr>';
						}
						
					});
					
					tab2 = tab2 + '</tbody></table></div>';
				
				// tab3: google maps
				var tab3 = '<div class="tab-pane" id="tab3">';
					tab3 = tab3 + '<div id="map_carousel" class="carousel slide">';
					tab3 = tab3 + '<ol class="carousel-indicators">';
					tab3 = tab3 + '<li data-target="#map_carousel" data-slide-to="0" class="active"></li>';
					tab3 = tab3 + '<li data-target="#map_carousel" data-slide-to="1"></li>';
					tab3 = tab3 + '<li data-target="#map_carousel" data-slide-to="2"></li>';
					tab3 = tab3 + '</ol>';
					tab3 = tab3 + '<div class="carousel-inner">';
					tab3 = tab3 + '<div class="active item">' + $.fn.googleImageMap(location, 'satellite') + '</div>';
					tab3 = tab3 + '<div class="item">' + $.fn.googleImageMap(location, 'streetview') + '</div>';
					tab3 = tab3 + '<div class="item">' + $.fn.googleImageMap(location, 'standard') + '</div>';
					tab3 = tab3 + '</div>';
					tab3 = tab3 + ' <a class="carousel-control left" href="#map_carousel" data-slide="prev">&lsaquo;</a>';
					tab3 = tab3 + '<a class="carousel-control right" href="#map_carousel" data-slide="next">&rsaquo;</a>';
					tab3 = tab3 + '</div>';
					tab3 = tab3 + '</div><!-- /Close Tab3 -->';
					
				// add tabs to modal body	
				ele.html(tabs+'<div class="tab-content">'+tab1+tab2+tab3+'</div>');
				
				$('#report-tabs a:first').tab('show');
				
				// Update a.map element with proper background image. Total hack but works.
				$("#map_carousel a.map").each(function(){
					var src = $(this).attr("href");
					$(this).attr("style", "background-image:url('"+src+"')");
				});
								    
			}else{
				ele.html('<h3>No records found.</h3>');
			}
		});
	};

	// geoCodeLocator
	$.fn.geoCodeLocator = function(phone, location) {
		// vars
		var result_count, title, block, parcel_id, x_coords, y_coords, xml, coord_str, popover_str, full_address_str, json;
		
		$.getJSON(service,{action: 'geoCodeLocator', location: location}, function(data){ // call jsonp
			
			if(data.GeoCodeLocatorResult){ // check if results
				result_count = parseInt(data.GeoCodeLocatorResult.ResultsCount);
				xml = data.GeoCodeLocatorResult.ResultsSet.any;
	        	properties = [];
	        	$(xml).find('AddressList').each(function(){ // build properties object
	        		json = $.xml2json(this);
	        		properties.push(json);
	        	});
			}else{
				 result_count = 0;
			}
			
			if(result_count >= 1){
				if(result_count == 1){							
					coord_str = $(xml).find('X_COORD').text()+','+$(xml).find('Y_COORD').text();
					$.fn.getPropertyReport(coord_str);
					$('#modal div.modal-header h3').text(location);
					$("#modal").modal("show");
				}else{
					title = '<h3>'+result_count+' Records Found</h3>';
					block = '<table class="table table-striped"><thead><tr>';
					block = block + '<th class="hidden-phone">&nbsp;</th>';
					block = block + '<th>Address</th>';
					block = block + '<th class="hidden-phone">City</th>';
					block = block + '<th class="hidden-phone hidden-tablet">State</th>';
					block = block + '<th class="hidden-phone hidden-tablet">Zipcode</th>';
					block = block + '<th class="hidden-phone hidden-tablet">Condo</th>';
					block = block + '</tr></thead><tbody>';
					
					$.each(properties, function (i, property) {
						coord_str = property.x_coord + ',' + property.y_coord;
						popover_str = property.bnd_name + ", " + property.state + " " + property.zipcode;
						full_address_str = property.address + " " + property.bnd_name + ", " + property.state + " " + property.zipcode;
						
						var condo = "No";
						if(property.condoflg == "Y"){
							condo = "Yes";
						}

		        		block = block + '<tr>';
		        		block = block + '<td class="drag-drop hidden-phone"><a class="btn btn-move" href="#" alt="' + full_address_str + '" ><i class="icon-move"></i></a></td>';
		        		block = block + '<td class="data-address"><a href="#" rel="' + coord_str + '" class="report">' + property.address + '</a>';
		        		block = block + '<span class="more-info-popover visible-phone hidden-desktop hidden-tablet">';
		        		block = block + '<a class="btn btn-popover" href="#"\
		        		data-title="' + property.address  + '"\
		        		data-content="' + popover_str + '"\
		        		data-placement="left">';
		        		block = block + '<i class="icon-info-sign"></i></a></span></td>';
		        		block = block + '<td class="data-city hidden-phone">' + property.bnd_name + '</td>';
		        		block = block + '<td class="data-state hidden-phone hidden-tablet">' + property.state  + '</td>';
		        		block = block + '<td class="data-zipcode hidden-phone hidden-tablet">' + property.zipcode  + '</td>';
		        		block = block + '<td class="data-zipcode hidden-phone hidden-tablet">' + condo  + '</td>';
		        		block = block + '</tr>';
						
					});
		        	
		        	block = block + '</tbody></table>';
		        	
		        	results = title + block;
					
					$('#results').html(results);
					
					$("#advanced-map-controls").show();
					$("a.btn-move").draggable({appendTo: "body",helper: "clone"});
				}
			}else{
				$('#results').html('<h3>No records found.</h3>');
			}
			
			// set loading false...
			$.fn.loader(false);
					
			// scroll to results
			$.fn.scrollTo("h3");
		});
	};
	
	// set all inputs.
	$(':input').clear();
		
	// set all buttons.
	$("form.search").search();
});

