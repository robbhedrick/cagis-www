<!DOCTYPE html>
<html>
	<head>
		<title>Cincinnati Area GIS</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
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
		<div class="container-fluid">
			<div class="row-fluid">
				
				 <div class="box span4">
					 <form id="search-form">
						 <input type="text" name="location" value="Enter Street Address" />
						 <button>Search</button>
					</form>
				 </div>
				 
				 <div class="box span6">
					 <div id="results"></div>
				 </div>
				 
				 <div class="box span2">
					 <div id="details"></div>
				 </div>
				 
			</div>
		</div>
	</body>
</html>
