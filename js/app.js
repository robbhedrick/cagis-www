/*
 * File:        app.js
 * Version:     1.0
 * Author:      Robb HedricK 
 *
 */
 
// GLOBAL VARS
var server = 'cagis.pluto.dev';
var service = "http://" + server + "/jsonp.php?callback=?";
var loader = '<img src="images/loader.png" width="36" height="36" />';

// GEO CALLBACK
function success_callback(p){
	//alert('lat='+p.coords.latitude.toFixed(2)+';lon='+p.coords.longitude.toFixed(2));
	//$(':input[name=latitude]').val(p.coords.latitude.toFixed(3));
	//$(':input[name=longitude]').val(p.coords.longitude.toFixed(3));
	//geo_position_js.showMap(p.coords.latitude.toFixed(2),p.coords.longitude.toFixed(2));
	$('#results-title').html("You're latitude is [" + p.coords.latitude.toFixed(2) + "] and your longitude is [" + p.coords.longitude.toFixed(2) +"]");
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
	
	// Dialog Links for Cagis
	$('a.cagis').on('click', function(){
		var parcel_id = $(this).attr('rel');
		var wWidth = $(window).width();
        var dWidth = wWidth * 0.9;
        var wHeight = $(window).height();
        var dHeight = wHeight * 0.9;
        var cagis = '<iframe class="cagis-map" src="http://cagisonline.hamilton-co.org/CagisOnline/index.html?pid='+parcel_id+'"></iframe>';
		var $dialog = $( "#map-dialog" )
			.html(cagis)
			.dialog({
				autoOpen: false,
				modal: true,
				title: 'PARCEL No. '+parcel_id,
				modal: { opacity: 0.1, background: "black" },
				width: dWidth,
				height: dHeight,
				draggable: false,
                resizable: false
		});
		$dialog.dialog('open');
		return false;
	});
	
	
	// launch cagis map dialog window.
	$('a.google').on('click', function(){
		var address = $(this).attr('rel');
		var wWidth = $(window).width();
        var dWidth = wWidth * 0.9;
        var wHeight = $(window).height();
        var dHeight = wHeight * 0.9;
        var google = '<iframe class="google-map" src="https://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q='+address;
        	google = google + '&amp;aq=&amp;t=h&amp;ie=UTF8&amp;hq=&amp;hnear='+address;
        	google = google + '&amp;z=19&amp;output=embed"></iframe>';
		var $dialog = $( "#map-dialog" )
			.html(google)
			.dialog({
				autoOpen: false,
				modal: true,
				title: address,
				modal: { opacity: 0.1, background: "black" },
				width: dWidth,
				height: dHeight,
				draggable: false,
                resizable: false
		});
		$dialog.dialog('open');
		return false;
	});
	
	
	// Scrolls page back to search results header.
	$.fn.scrollToPageTitle = function() {
		$('html, body').animate({
			scrollTop: $("#page-title").offset().top
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
	
	// Return value of an objects key name
	$.fn.getValueByKey = function(obj, key) {
		var res = false;
		$.each(obj, function (i, item) {
			if(item.Name == key){
				res = item.Value;
			}
		});
		return res;
	};
					
	// determing 
	$.fn.search = function(url) {
		return this.click(function(){
			// some initial varibles for function.
			var action, parcel_id, location, x_coord, y_coord, coord_str;
			
			// get id of what button user clicked.
			action = $(this).attr('class');
			
			// load preloader.
			$('#results-map').html('');
			$('#results-title').html('Searching...');
			$('#results-table').html(loader);
			
			// build api call based on user action.
			switch(action){
				case "btn-parcel":
					parcel_id = $(':input[name=parcel]').val();
					$.fn.getAddressesByParcelID(parcel_id);
					break;
				case "btn-address":
					location = $(':input[name=address]').val();
					$.fn.geoCodeLocator(location);	
					break;
				case "btn-coords":
					x_coord = $(':input[name=latitude]').val();
					y_coord = $(':input[name=longitude]').val();
					coord_str = 'x='+x_coord+'&y='+y_coord;
					$.fn.getPropertyReport(coord_str);
					break;
				default:
					parcel_id = $(':input[name=parcel]').val();
			}
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
		
		// Set stage
		$('#results-title').html('Loading...');
		$('#results-map').html('');
		$('#results-table').html(loader);
		$('#map-dialog').html('');
		
		$.getJSON(service,{action: 'getPropertyReport', x: coords[0], y: coords[1]}, function(data){
			if(data.locationReportResult){
				
				$.fn.scrollToPageTitle();
					
				$(':input[name=parcel]').val(data.locationReportResult.ParcelQueryData.SelectedParcelID);
				$(':input[name=address]').val(data.locationReportResult.AddressQueryData.AddressLocation);
				$(':input[name=latitude]').val(data.locationReportResult.LocationQueryData.X_Coord);
				$(':input[name=longitude]').val(data.locationReportResult.LocationQueryData.Y_Coord);
					
				var parcel_attributes = data.locationReportResult.ParcelQueryData.AudParcelAttributes.ParcelAttributes.ParcelAttribute;
				var zoning_attributes = data.locationReportResult.ZoningQueryData.ZoningAttributes.ZoningAttribute;
				
				var parcel_desired = ["OWNNM1","OWNNM2","OWNAD1","OWNAD2","MKTLND","MKTIMP","MKT_TOTAL_VAL","ANNUAL_TAXES"];
				var zoning_desired = ["PHONE","BND_NAME","ADDRESS","ZONING","zoning_codedescription"];
					
				$.each(parcel_attributes, function (i, item) {
					
					if($.inArray(item.Name,parcel_desired) != -1){
						var item_label = item.Label;
						var item_value = "";
						if(item.Value){
							item_value = item.Value;
						}
						results.parcel.push([
							item_label,
							item_value
						]);
					}
					
				});
					
				$.each(zoning_attributes, function (i, item) {
					if($.inArray(item.Name,zoning_desired) != -1){
						var item_label = item.Label;
						var item_value = "";
						if(item.Value){
							item_value = item.Value;
						}
						results.zoning.push([
							item_label,
							item_value
						]);
					}
				});
										
				var table_1 = '<div class="column one"><h2>Property Info</h2><table class="display" id="property-data-table-1"></table></div>';
				var table_2 = '<div class="column two"><h2>Zoning and Development Info</h2><table class="display" id="property-data-table-2"></table></div>';
					
				$('#results-title').html(data.locationReportResult.AddressQueryData.AddressLocation);
				$('#results-map').html(
					
					$.fn.createMaps(
							true,
							data.locationReportResult.AddressQueryData.AddressAttributes.addressWCity,
							data.locationReportResult.ParcelQueryData.SelectedParcelID
						)
					);
					
					$('#results-table').html(table_1+table_2);
					
					$('#property-data-table-1').dataTable({
				        "aaData": results.parcel,
				        "aoColumns": [{"sTitle": "Title" },{ "sTitle": "Value" }],
				        "bPaginate": false,
				    	"bLengthChange": false,
				    	"bFilter": true,
				    	"bSort": false,
				    	"bInfo": false,
				    	"bAutoWidth": false
				    });
				    
				    $('#property-data-table-2').dataTable({
				        "aaData": results.zoning,
				        "aoColumns": [{"sTitle": "Title" },{ "sTitle": "Value" }],
				        "bPaginate": false,
				    	"bLengthChange": false,
				    	"bFilter": true,
				    	"bSort": false,
				    	"bInfo": false,
				    	"bAutoWidth": false
				    });
				    
			}else{
				$('#results-title').html('No records found.');
				$('#results-table').html('');
			} 
		});
	};

	// geoCodeLocator
	$.fn.geoCodeLocator = function(location) {
		
		var results = {"records":[]};
		var parcel_id, x_coords, y_coords, xml, markup, coord_str;
		
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
		        	$(xml).find('AddressList').each(function(){
		        		coord_str = 'x='+$(this).find('X_COORD').text()+'&y='+$(this).find('Y_COORD').text();
		        		results.records.push([
		        			$(this).find('ADDRESS').text(),
		        			$(this).find('BND_NAME').text(),
		        			$(this).find('STATE').text(),
		        			$(this).find('ZIPCODE').text(),
		        			'<a href="#" rel="'+coord_str+'" class="report">View Report</a>'
		        			]);
		        	});
		        	
		        	$('#results-title').html('<h3>'+result_count+' Records Found</h3>');
		        	$('#results-map').html("");
					$('#results-table').html('<table class="display" id="property-data-table"></table>');
					
				    $('#property-data-table').dataTable( {
				    	"sPaginationType": "full_numbers",
				        "aaData": results.records,
				        "aoColumns": [
				            { "sTitle": "Address" },
				            { "sTitle": "City" },
				            { "sTitle": "State" },
				            { "sTitle": "Zipcode" },
				            { "sTitle": "" }
				        ]
				    });
				}
			}else{
				$('#results-title').html('No records found.');
				$('#results-table').html('');
			} 
		});
	};
		
	// set all inputs.
	$(':input').clear();
		
	// set all buttons.
	$(':button').search();

	// ------------------------------------------------------------------------------------------------------------------------------------------------/
}

if(geo_position_js.init()) {
	geo_position_js.getCurrentPosition(success_callback,error_callback,{enableHighAccuracy:true});
}else{
	alert("Functionality not available");
}

// Call DOM READY FUNCTION
$(domReady);
