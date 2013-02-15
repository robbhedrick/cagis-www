/*
 * File:        app.js
 * Version:     1.0
 * Author:      Robb HedricK 
 *
 */
 
// GLOBAL VARS
var server = 'cagis.pluto.dev';
var service = "http://" + server + "/jsonp.php?callback=?";
var my_latitude = "";
var my_longitude = "";

// GEO CALLBACK
function success_callback(p){
	//alert('lat='+p.coords.latitude.toFixed(2)+';lon='+p.coords.longitude.toFixed(2));
	//$(':input[name=latitude]').val(p.coords.latitude.toFixed(3));
	//$(':input[name=longitude]').val(p.coords.longitude.toFixed(3));
	//geo_position_js.showMap(p.coords.latitude.toFixed(2),p.coords.longitude.toFixed(2));
	my_latitude = p.coords.latitude.toFixed(3);
	my_longitude = p.coords.longitude.toFixed(3);
	$('#details').html("You're latitude is [" + p.coords.latitude.toFixed(3) + "] and your longitude is [" + p.coords.longitude.toFixed(3) +"]");
	loadGooglMapScript();
}

// GOOGLE MAPS
function initialize() {
  var mapOptions = {
    zoom: 18,
    center: new google.maps.LatLng(my_latitude, my_longitude),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
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
 
// DOM READY FUNCTION
function domReady() {
		
	// View Report Links
	$("a.report").on("click", function(){
		var coord_str = $(this).attr("rel");
		$.fn.getPropertyReport(coord_str);
		return false;
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
	
	$.fn.createMaps = function(google, address, parcel_id) {
		var maps = '';
			if(google){
				// Google Satellite View
				maps = maps + '<div class="map"><a class="google satellite" href="#" rel="'+address+'"><img src="http://maps.googleapis.com/maps/api/staticmap?center='+address;
				maps = maps + '&markers=size:mid|color:red|'+address;
				maps = maps + '&zoom=19&size=215x215&maptype=satellite&sensor=true"></a></div>';
				
				// Google Basic Map View
				maps = maps + '<div class="map"><a class="google basic" href="#" rel="'+address+'"><img src="http://maps.googleapis.com/maps/api/staticmap?center='+address;
				maps = maps + '&markers=size:mid|color:red|'+address;
				maps = maps + '&zoom=18&size=215x215&sensor=true"></a></div>';
				
				// Google Street View
				maps = maps + '<div class="map"><a class="google steeet" href="#" rel="'+address+'"><img src="http://maps.googleapis.com/maps/api/streetview?size=215x215&location='+address;
				maps = maps + '&sensor=false"></a></div>';
			}
			// Dialog Link To Cagis Flash Maps
			maps = maps + '<div class="cagis-msg">Click <a href="#" class="cagis" rel="'+parcel_id+'">here</a> to view the CAGIS interative map. Requires Adobe Flash player.</div>';	
		
		return maps;
	};

	// getPropertyReport
	$.fn.getPropertyReport = function(strCoords) {
		
		var results = {"parcel":[],"zoning":[],};
		var coords = strCoords.split(",");
				
		title = '<h3>Loading...</h3>';
		$('#results').html(title + loader);

		$.getJSON(service,{action: 'getPropertyReport', x: coords[0], y: coords[1]}, function(data){
			if(data.locationReportResult){
				
				$.fn.scrollToPageTitle();
					
				var parcel_attributes = data.locationReportResult.ParcelQueryData.AudParcelAttributes.ParcelAttributes.ParcelAttribute;
				var zoning_attributes = data.locationReportResult.ZoningQueryData.ZoningAttributes.ZoningAttribute;
				
				var parcel_desired = ["OWNNM1","OWNNM2","OWNAD1","OWNAD2","MKTLND","MKTIMP","MKT_TOTAL_VAL","ANNUAL_TAXES"];
				var zoning_desired = ["PHONE","BND_NAME","ADDRESS","ZONING","zoning_codedescription"];
				
				
				// block 1: basic property information					
				var block1 = '<div class="column one"><h2>Property Info</h2><table class="table" id="property-data-table-1">';
					block1 = block1 + '<tbody><tr><th>Label</th><th>Value</th></tr>';
					
					$.each(parcel_attributes, function (i, item) {
						
						if($.inArray(item.Name,parcel_desired) != -1){
							var item_label = item.Label;
							var item_value = "";
							if(item.Value){
								item_value = item.Value;
							}
							block1 = block1 + '<tr><td>' + item_label+ '</td><td>' + item_value+ '</td></tr>';
						}
						
					});
					
					block1 = block1 + '</tbody></table></div>';
				
				// block 2: property zoning and development information
				var block2 = '<div class="column two"><h2>Zoning and Development Info</h2><table class="display" id="property-data-table-2">';
					
					$.each(zoning_attributes, function (i, item) {
						
						if($.inArray(item.Name,parcel_desired) != -1){
							var item_label = item.Label;
							var item_value = "";
							if(item.Value){
								item_value = item.Value;
							}
							block1 = block1 + '<tr><td>' + item_label+ '</td><td>' + item_value+ '</td></tr>';
						}
						
					});
					
					block2 = block2 = '</table></div>';
					
				$('#results-title').html(data.locationReportResult.AddressQueryData.AddressLocation);
				$('#results-map').html(
					$.fn.createMaps(
						true,
						data.locationReportResult.AddressQueryData.AddressAttributes.addressWCity,
						data.locationReportResult.ParcelQueryData.SelectedParcelID
					)
				);
				
				// add blocks to page	
				$('#results').html(block1+block2);
				    
			}else{
				$('#results').html('<h3>No records found.</h3>');
			} 
		});
	};

	// geoCodeLocator
	$.fn.geoCodeLocator = function(location) {
		
		var results, title, block, parcel_id, x_coords, y_coords, xml, coord_str;
		
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
					coord_str = 'x='+$(xml).find('X_COORD').text()+'&y='+$(xml).find('Y_COORD').text();
					$.fn.getPropertyReport(coord_str);
				}else{
					title = '<h3>'+result_count+' Records Found</h3>';
					block = '<table class="table table-striped"><thead><tr>';
					block = block + '<th>Address</th>';
					block = block + '<th>City</th>';
					block = block + '<th>State</th>';
					block = block + '<th>Zipcode</th>';
					block = block + '</tr></thead><tbody>';
					
		        	$(xml).find('AddressList').each(function(){
		        		// get cagis x & y coordianants for propery query
		        		coord_str = 'x='+$(this).find('X_COORD').text()+'&y='+$(this).find('Y_COORD').text();
		        		
		        		// build display block
		        		block = block + '<tr>';
		        		block = block + '<td><a href="#" rel="' + coord_str + '" class="report">' + $(this).find('ADDRESS').text() + '</a></td>';
		        		block = block + '<td>' + $(this).find('BND_NAME').text() + '</td>';
		        		block = block + '<td>' + $(this).find('STATE').text() + '</td>';
		        		block = block + '<td>' + $(this).find('ZIPCODE').text() + '</td>';
		        		block = block + '</tr>';
		        	});
		        	
		        	block = block + '</tbody></table>';
		        	
		        	results = title + block;
					$('#results').html(results);
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
	$(".form-search").search();

	// ------------------------------------------------------------------------------------------------------------------------------------------------/
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

// Call DOM READY FUNCTION
$(domReady);
