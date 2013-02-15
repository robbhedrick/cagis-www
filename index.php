<!DOCTYPE html>
<html>
	<head>
		<title>Cincinnati Area GIS</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="apple-mobile-web-app-capable" content="yes" />
		
		<!-- CSS Libraries: -->
		<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
		<link href="css/bootstrap-responsive.min.css" rel="stylesheet" media="screen">
		
		<!-- CSS Custom: -->
		<link href="css/custom.css" rel="stylesheet">
		
		<!-- JS Libraries: -->
		<script type="text/javascript" src="js/lib/jquery.js"></script>
		<script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/lib/geo.js"  charset="utf-8"></script>


		<!-- JS Custom: -->		
		<script type="text/javascript" src="js/app.js"></script>
	</head>
	<body>
		<div class="row-fluid">
			<div class="span12">
				<h1>Cincinnati GIS</h1>
				<div class="row-fluid">
					<div class="box span6">
						 <form class="form-search">
						 	<input type="text" class="input-medium search-query" name="location"  value="Enter Street Address">
							<button type="submit" class="btn">Search</button>
							<img src="/img/loader.gif" class="loader"  style="display:none;"/ >
						</form>
						<div id="results"></div>
					</div>
					<div class="box span6">
						<div id="details"></div>
					 	<div id="map_canvas" style="width: 274px; height: 274px"></div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
