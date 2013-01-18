<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
		<script type="text/javascript" src="scripts/jquery.data-tables.min.js"></script>
		<script type="text/javascript" src="scripts/jquery.custom.js"></script>
		<script type="text/javascript" src="scripts/geo.js"  charset="utf-8"></script>
		<script type="text/javascript">
			$(document).ready(function() {
				
				if(geo_position_js.init()){
					geo_position_js.getCurrentPosition(success_callback,error_callback,{enableHighAccuracy:true});
				}
				else{
					alert("Functionality not available");
				}
		
				function success_callback(p)
				{
					//alert('lat='+p.coords.latitude.toFixed(2)+';lon='+p.coords.longitude.toFixed(2));
					$(':input[name=latitude]').val(p.coords.latitude.toFixed(3));
					$(':input[name=longitude]').val(p.coords.longitude.toFixed(3));
					//geo_position_js.showMap(p.coords.latitude.toFixed(2),p.coords.longitude.toFixed(2));
				}
				
				function error_callback(p)
				{
					alert('error='+p.code);
				}
				
				// set all inputs.
				$(':input').clearOnFocus();
				
				// set all buttons.
				$(':button').fetchCagis();
				
			});
		</script>
		<style type="text/css" title="currentStyle">
			@import "styles/data-table.css";
			@import "styles/custom.css";
		</style>
	</head>
	<body>
		<div class="search-boxes">
			<div class="box">
				<label>Search By Address</label>
				<input type="text" name="address" value="Enter Street Address" />
				<button class="btn-address">Button</button>
			</div>
			<div class="box">
				<label>Search By Parcel</label>
				<input type="text" name="parcel" value="Enter Parcel Id" />
				<button class="btn-parcel">Button</button>
			</div>
			<div class="box">
				<label>Search By Coordinates</label>
				<input type="text" name="latitude" value="Enter Latitude" />
				<input type="text" name="longitude" value="Enter Longitude" />
				<button class="btn-coords">Button</button>
			</div>
		</div>
		<h2 id="results-title"></h2>
		<div id="results-table"></div>
		<div id="results-map"></div>
	</body>
</html>
