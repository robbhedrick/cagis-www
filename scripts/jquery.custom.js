/*
 * File:        cagis.jquery.custom.js
 * Version:     1.0
 * Author:      Robb HedricK (Senior Develoer) at The Creative Deparment
 *
 * 
 * This source file is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 */
var loader = '<img src="images/loader.png" width="75" height="75" />';

// set all property links.
$('a.property').live('click', function(){
	var parcel_id = $(this).attr('rel');
	$.fn.fethCagisProperyInfoByParcel(parcel_id);	
});

// Custom function to clear and repopulate default value of input fields.
$.fn.clearOnFocus = function() {
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
				
// get cagis stuff
$.fn.fetchCagis = function(url) {
	return this.click(function(){
		// some initial varibles for function.
		var action, parcel_id, location;
		
		// determine if page has rendered a map by class on html tag
		/* 
		var map = $('#map-results').hasClass('success');
		*/
		
		// if map is true then run function to remove cagis scripts
		/*
		if(map){
			$('#map-results').html("");
			//$.fn.removeCagisScripts();
		}
		*/
		
		// get id of what button user clicked.
		action = $(this).attr('class');
		
		// load preloader.
		$('#results-title').html('Searching...');
		$('#results-table').html(loader);
		
		// build api call based on user action.
		switch(action){
			case "btn-parcel":
				parcel_id = $(':input[name=parcel]').val();
				$.fn.fetchCagisGeometry(parcel_id);
				break;
			case "btn-address":
				location = $(':input[name=address]').val();
				$.fn.searchCagisByLocation(location);	
				break;
			default:
				parcel_id = $(':input[name=parcel]').val();
		}
	});
};

$.fn.fetchCagisGeometry = function(parcel_id) {
	var x,y;
	// make cagis ajax call to cagis.
	$.ajax({
	    type: 'POST',
	    url: "http://cagisonline.hamilton-co.org/ArcGIS/rest/services/Countywide_Layers/Cagis_Map_Labels/MapServer/0/query?where=PARCELID='"+parcel_id+"'&returnGeometry=true&f=json",
	    async: false,
	    cache: false,
	    crossDomain: true,
	    dataType: 'jsonp',
	    error: function( xhr,err ) {
	        console.log( 'Sample of error data:', err );
	        console.log("readyState: "+xhr.readyState+"\nstatus: "+xhr.status+"\nresponseText: "+xhr.responseText);
	    },
	    success: function( data, status ) {
	        if (console && console.log) {
	            //console.log( 'data count:', data.query.results.json.json.length );
	            //$('#result-count').html( JSON.stringify(data.features[0].geometry.x) );
	           x = parseInt(data.features[0].geometry.x);
	           y = parseInt(data.features[0].geometry.y);
	           
	        }
	    },
	    jsonpCallback: 'swatCallback'
	})
	.done(function() { 
		$(':input[name=latitude]').val(x);
		$(':input[name=longitude]').val(y);
		//
		//$.fn.fetchCagisMapView(pid);
		$.fn.fethCagisProperyInfoByParcel(parcel_id);	
	})	
	.fail(function() { alert("error"); }); 	
};

				// load cagis property info.
$.fn.searchCagisByLocation = function(location) {
	var results = {"records":[]};
	var parcel_id, x_coords, y_coords, xml, markup;
	// make cagis ajax call to cagis.
	$.ajax({
	    type: 'GET',
	    url: "api.php?action=findProperties&location="+location,
	    async: false,
	    cache: false,
	    crossDomain: true,
	    dataType: 'json',
	    error: function( xhr,err ) {
	        console.log( 'Sample of error data:', err );
	        console.log("readyState: "+xhr.readyState+"\nstatus: "+xhr.status+"\nresponseText: "+xhr.responseText);
	    },
	    success: function( data, status ) {
	        if (console && console.log) {
	        	result_count = parseInt(data.GeoCodeLocatorResult.ResultsCount);
	        	xml = data.GeoCodeLocatorResult.ResultsSet.any;
	        }
	    },
	    jsonpCallback: 'swatCallback'
	})
	.done(function() {
		if(result_count >= 1){
			if(result_count == 1){
				parcel_id = $(xml).find('PARCELID').text();
				x_coords = $(xml).find('X_COORD').text();
				y_coords = $(xml).find('Y_COORD').text();
				$(':input[name=parcel]').val(parcel_id);
				$(':input[name=latitude]').val(x_coords);
				$(':input[name=longitude]').val(y_coords);
				$.fn.fethCagisProperyInfoByParcel(parcel_id);	
			}else{
	        	$(xml).find('AddressList').each(function(){
	        		results.records.push([
	        			'<a href="#" rel="'+$(this).find('PARCELID').text()+'" class="property">'+$(this).find('ADDRESS').text()+'</a>',
	        			$(this).find('BND_NAME').text(),
	        			$(this).find('STATE').text(),
	        			$(this).find('ZIPCODE').text(),
	        			$(this).find('PARCELID').text(),
	        			'<a href="#" rel="'+$(this).find('X_INTP').text()+'-'+$(this).find('Y_INTP').text()+' class="property">View Map</a>'
	        			
	        			]);
	        	});
	        	$('#results-title').html('<h3>'+result_count+' Records Found</h3>');
				$('#results-table').html('<table class="display" id="property-data-table"></table>');
			    $('#property-data-table').dataTable( {
			    	"sPaginationType": "full_numbers",
			        "aaData": results.records,
			        "aoColumns": [
			            { "sTitle": "Address" },
			            { "sTitle": "City" },
			            { "sTitle": "State" },
			            { "sTitle": "Zipcode" },
			            { "sTitle": "Parcel ID" },
			            { "sTitle": "" }
			        ]
			    });
			}
		}else{
			$('#results-title').html('No records found.');
			$('#results-table').html('');
		}
	})	
	.fail(function() { alert("error"); }); 
};

// load cagis property info.
$.fn.fethCagisProperyInfoByParcel = function(parcel_id) {
	var results = {"records":[]};
	
	// create new property array
	var parcelAttributes;
	
	// make cagis ajax call to cagis.
	$.ajax({
	    type: 'GET',
	    url: "api.php?action=getPropertyInfo&parcel_id="+parcel_id,
	    async: false,
	    cache: false,
	    crossDomain: true,
	    dataType: 'json',
	    error: function( xhr,err ) {
	        console.log( 'Sample of error data:', err );
	        console.log("readyState: "+xhr.readyState+"\nstatus: "+xhr.status+"\nresponseText: "+xhr.responseText);
	    },
	    success: function( data, status ) {
	        if (console && console.log) {
	       	    parcelAttributes = data.GetParcelInfoByParcelIDResult.ParcelData.AudParcelAttributes.ParcelAttributes.ParcelAttributes;
	        }
	    },
	    jsonpCallback: 'swatCallback'
	})
	.done(function() {
		$.each(parcelAttributes, function (i, item) {
			var item_label = item.Label;
			var item_value = "";
			if(item.Value){
				item_value = item.Value;
			}
			results.records.push([
				item_label,
				item_value
			]);
		});
		var title = $.fn.getValueByKey(parcelAttributes, 'OWNAD1') + ' ' +  $.fn.getValueByKey(parcelAttributes, 'OWNAD2');
		$('#results-title').html(title);
		$('#results-table').html( '<table class="display" id="property-data-table"></table>' );
	    $('#property-data-table').dataTable( {
	        "aaData": results.records,
	        "aoColumns": [
	            { "sTitle": "Name" },
	            { "sTitle": "Value" }
	        ]
	    });	
	})	
	.fail(function() { alert("error"); }); 
};

// load cagis map
$.fn.fetchCagisMapView = function(pid) {
	// make cagis ajax call to cagis.
	$.ajax({
		url: "map.php?pid="+pid,
		async: false,
		cache: false,
		success: function(data) {
			$('#map-results').html(data).addClass('success');
		}
	});
};

// remove cagis script tags
$.fn.removeCagisScripts = function(){
	$('script').each(function(){
		if($(this).attr('charset')=='utf-8'){
			$(this).remove();
		}
	});
};