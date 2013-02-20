/*
 * File:        app.js
 * Version:     1.0
 * Author:      Robb HedricK 
 *
 */
 
// GLOBAL VARS
var server = 'robbhedrick.com/projects/web/cagis';
var service = "http://" + server + "/jsonp.php?callback=?";
var my_latitude = "";
var my_longitude = "";
var geocoder;
var directionsService;
var directionsDisplay;
var map;
var current;
var oceanBeach;


// GEO CALLBACK
function success_callback(p){
	my_latitude = p.coords.latitude.toFixed(5);
	my_longitude = p.coords.longitude.toFixed(5);
	loadGooglMapScript();
}

// GOOGLE MAPS API
function initialize() {
  geocoder = new google.maps.Geocoder();
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  current = new google.maps.LatLng(my_latitude, my_longitude);
  var mapOptions = {
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: current
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  directionsDisplay.setMap(map);
}

function calcRoute(location) {
  var selectedMode = document.getElementById("mode").value;
  var request = {
      origin: current,
      destination: location,
      travelMode: google.maps.TravelMode[selectedMode]
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

function codeAddress(address) {
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			/*map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
        		map: map,
        		position: results[0].geometry.location
        	});*/
        	calcRoute(results[0].geometry.location);
        } else {
    		alert("Geocode was not successful for the following reason: " + status);
    	}
    });
}


function loadGooglMapScript(coords) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAG-2qJnw4jka8jrjXLWpRqd2qz5fHgxFo&sensor=false&callback=initialize";
  document.body.appendChild(script);
}


// GEO CALLBACK ERROR
function error_callback(p) {
	alert('error='+p.code);
}
 
// Change meta viewport if IE moible 10 browser
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
	var msViewportStyle = document.createElement("style");
	msViewportStyle.appendChild(
		document.createTextNode("@-ms-viewport{width:auto!important}")
	);
	document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}

if(geo_position_js.init()) {
	geo_position_js.getCurrentPosition(success_callback,error_callback,{enableHighAccuracy:true});
}else{
	alert("Functionality not available");
}
 
// jQuery
$(function() {
		
	// View Report Links
	$("body").on("click", "a.report", function(){
		var title = $(this).text();
		var coord_str = $(this).attr("rel");
		
		$('#modal div.modal-header h3').text(title);
		$("#modal").modal("show");
		
		$.fn.getPropertyReport(coord_str);
		
		return false;
	});

	// popover details
	$("body").on("click", "a.btn-popover", function(){
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
	
	$('body').on("click", "#report-tabs a", function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
	
	// droppable area for address
	$("#droppable").droppable({
	  drop: function( event, ui ) {
	  	  var address = ui.draggable.attr("alt");
	      $(this).find(".placeholder").text(address);
	       codeAddress(address);
	  }
	});
			
	// Scrolls page back to search results header.
	$.fn.scrollTo = function(ele) {
		$('html, body').animate({
			scrollTop: $(ele).offset().top
		}, 200);
	};

	// Custom function to clear and repopulate default value of input fields.
	$.fn.clear = function() {
		return this.focus(function(){
			var v = $(this).val();
			$(this).val( v === this.defaultValue ? '' : v );
		}).blur(function(){
			var v = $(this).val();
			$(this).val( v.match(/^\s+$|^$/) ? this.defaultValue : v );
		});	
	};
	
	// return value of an objects key name
	$.fn.getValueByKey = function(obj, key) {
		var res = false;
		$.each(obj, function (i, item) {
			if(item.Name == key){
				res = item.Value;
			}
		});
		return res;
	};
	
	// set loader icon
	$.fn.loader = function(s) {
		if(s){
			$(':button').hide();	
			$('img.loader').show();
		}else{
			$('img.loader').hide();
			$(':button').show();	
		}
	};
	
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
			
			// get value of field in search form.
			var location = $(':input[name=location]').val();
			
			// set loading true...
			$.fn.loader(true);
			
			// calling this function will determine one or many results.
			$.fn.geoCodeLocator(location);	
			
			return false;
		});
	};
	
	// getPropertyReport
	$.fn.getPropertyReport = function(strCoords) {
		
		var results = {"parcel":[],"zoning":[],};
		var coords = strCoords.split(",");
		var parcel_attributes, parcel_desired;
				
		$('#modal div.modal-body').html('<h3 class="loader">Loading...<h3/>');

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
					$('#modal div.modal-body').html(tabs+'<div class="tab-content">'+tab1+tab2+tab3+'</div>');
					
					$('#report-tabs a:first').tab('show');
					
					// Update a.map element with proper background image. Total hack but works.
					$("#map_carousel a.map").each(function(){
						var src = $(this).attr("href");
						$(this).attr("style", "background-image:url('"+src+"')");
					});
									    
				}else{
					$('#modal div.modal-body').html('<h3>No records found.</h3>');
				}
			});
	};

	// geoCodeLocator
	$.fn.geoCodeLocator = function(location) {
		
		var results, title, block, parcel_id, x_coords, y_coords, xml, coord_str, popover_str, full_address_str;
		
		// call jsonp
		$.getJSON(service,{action: 'geoCodeLocator', location: location}, function(data){
			
			// check if results
			if(data.GeoCodeLocatorResult){
				result_count = parseInt(data.GeoCodeLocatorResult.ResultsCount);
				 xml = data.GeoCodeLocatorResult.ResultsSet.any;
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
					block = block + '<th>Address</th>';
					block = block + '<th class="hidden-phone">City</th>';
					block = block + '<th class="hidden-phone hidden-tablet">State</th>';
					block = block + '<th class="hidden-phone">Zipcode</th>';
					block = block + '<th class="hidden-phone">&nbsp;</th>';
					block = block + '</tr></thead><tbody>';
					
		        	$(xml).find('AddressList').each(function(){
		        		// get cagis x & y coordianants for propery query
		        		coord_str = $(this).find('X_COORD').text() + ',' + $(this).find('Y_COORD').text();
		        		popover_str = $(this).find('BND_NAME').text() + ", " + $(this).find('STATE').text() + " " + $(this).find('ZIPCODE').text();
		        		full_address_str = $(this).find('ADDRESS').text() + " " + $(this).find('BND_NAME').text() + ", " + $(this).find('STATE').text() + " " + $(this).find('ZIPCODE').text();
		        		
		        		// build display block
		        		block = block + '<tr class="drag">';
		        		block = block + '<td class="data-address"><a href="#" rel="' + coord_str + '" class="report">' + $(this).find('ADDRESS').text() + '</a>';
		        		block = block + '<span class="more-info-popover visible-phone hidden-desktop hidden-tablet">';
		        		block = block + '<a class="btn btn-popover" href="#"\
		        		data-title="' + $(this).find('ADDRESS').text() + '"\
		        		data-content="' + popover_str + '"\
		        		data-placement="left">';
		        		block = block + '<i class="icon-info-sign"></i></a></span></td>';
		        		block = block + '<td class="data-city hidden-phone">' + $(this).find('BND_NAME').text() + '</td>';
		        		block = block + '<td class="data-state hidden-phone hidden-tablet">' + $(this).find('STATE').text() + '</td>';
		        		block = block + '<td class="data-zipcode hidden-phone">' + $(this).find('ZIPCODE').text() + '</td>';
		        		block = block + '<td class="drag-drop hidden-phone"><a class="btn btn-move" href="#" alt="' + full_address_str + '" ><i class="icon-move"></i></a></td>';
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
	$(".navbar-search").search();
});

