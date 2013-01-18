<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
		<script type="text/javascript" src="scripts/jquery.data-tables.min.js"></script>
		<script type="text/javascript" src="scripts/jquery.custom.js"></script>
		<script type="text/javascript">
			$(document).ready(function() {
				
				// set all inputs.
				$(':input').clearOnFocus();
				
				// set all buttons.
				$(':button').fetchCagis();
				
			});
		</script>
		<style type="text/css" title="currentStyle">
			@import "styles/data-table.css";
		</style>
	</head>
	<body>
		<div class="boxes">
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
		<hr />
		<h2 id="results-title"></h2>
		<div id="results-table"></div>
	</body>
</html>
