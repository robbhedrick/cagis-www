<!DOCTYPE html>
<html>
	<head>
		<title>Cincinnati Area GIS</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
		<meta name="apple-mobile-web-app-capable" content="yes" />
		
		<!-- CSS Libraries: -->
		<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
		<link href="css/bootstrap-responsive.min.css" rel="stylesheet" media="screen">
		
		<!-- CSS Custom: -->
		<link href="css/custom.css" rel="stylesheet">
		
		<!-- JS Libraries: -->
		<script type="text/javascript" src="js/lib/jquery.js"></script>
		<script type="text/javascript" src="js/lib/bootstrap.js"></script>
		<script type="text/javascript" src="js/lib/geo.js"  charset="utf-8"></script>


		<!-- JS Custom: -->		
		<script type="text/javascript" src="js/app.js"></script>
	</head>
	<body>
	    <div class="navbar">
		    <div class="navbar-inner">
			    <div class="container">
			     
				    <!-- .btn-navbar is used as the toggle for collapsed navbar content -->
				    <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
				    <span class="icon-bar"></span>
				    <span class="icon-bar"></span>
				    <span class="icon-bar"></span>
				    </a>
				     
				    <!-- Be sure to leave the brand out there if you want it shown -->
				    <a class="brand" href="#">CAGIS</a>
				    <!-- Everything you want hidden at 940px or less, place within here -->
				    <div class="nav-collapse collapse">
					    <form class="navbar-search pull-right">
							<input type="text" class="input-medium search-query" name="location"  value="Enter Street Address">
							<button type="submit" class="btn">Search</button>
							<img src="/img/loader.gif" class="loader"  style="display:none;"/ >
						</form>
				    </div>
			     
			    </div>
		    </div>
	    </div>
		<div class="row-fluid">
			<div class="span12">
						
				<div class="row-fluid">
					<div class="box span6">
						<div id="results"></div>
					</div>
					<div class="box span6 hidden-phone">
						<div id="details"></div>
					 	<div id="map_canvas"></div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
