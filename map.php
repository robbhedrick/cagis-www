<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>CAGIS Map</title>
	<script type="text/javascript" src="http://cagismaps.hamilton-co.org/cagisCustom/widgets/embeddedWebMap/customHelper.js"></script>
	<script type="text/javascript" src="http://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.0"></script>
	<script type="text/javascript" src="http://cagismaps.hamilton-co.org/cagisCustom/widgets/embeddedWebMap/AuditorBootStrap.js"></script>
	<script type="text/javascript">
	require(
		[ "dojo/topic", "dojo/_base/lang"],
		function(dTopic,dLang){dTopic.subscribe("cagis.geosearch.ParcelIdSelected",dLang.hitch(this, function (evt) {dTopic.publish("cagis.geosearch.showParcel",evt);}));
	});
	</script>
	<script type="text/javascript">
		require(
			[ "dojo/topic", "dojo/_base/lang"],function(dTopic,dLang){dTopic.subscribe("cagis.map.mapLoaded",dLang.hitch(this, function (evt){
				var ParcelIdAsString = '<?php print($_GET['p']); ?>'
				if (ParcelIdAsString != ''){
					dTopic.publish("cagis.geosearch.showParcel",ParcelIdAsString);
				}
			})); 
		});       
	</script>
</head>
<body class="claro"><div id="cagMapViewPort" class="cagMapViewPort"></div>        
</body>
</html>