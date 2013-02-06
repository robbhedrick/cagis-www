<!DOCTYPE html>
<html>
	<head>
		
		<!-- CSS Libraries: -->
		<link rel="stylesheet" href="http://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.0/themes/vader/jquery-ui.css">
		<link rel="stylesheet" href="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/css/jquery.dataTables.css">
		
		<!-- JS Libraries: -->
		<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1.min.js"></script>
		<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.0/jquery-ui.min.js"></script>
		<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/jquery.dataTables.min.js"></script>
		
		<!-- JS Custom: -->
		<script type="text/javascript" src="js/geo.js"  charset="utf-8"></script>
		<script type="text/javascript" src="js/app.js"></script>

		<!-- CSS Custom: -->
		<link rel="stylesheet" href="css/custom.css">
		
	</head>
	<body>
		
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
		
		<div id="results-map"></div>
		<h2 id="results-title"></h2>
		<div id="results-table"></div>
		
	</body>
</html>
