<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>CAGIS Map</title>
	<script type="text/javascript" src="http://cagismaps.hamilton-co.org/cagisCustom/widgets/embeddedWebMap/customHelper.js"></script>
	<script type="text/javascript" src="http://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.0"></script>
	<script type="text/javascript" src="http://cagismaps.hamilton-co.org/cagisCustom/widgets/embeddedWebMap/AuditorBootStrap.js"></script>
	<!--script type="text/javascript" src="AuditorBootStrap.js"></script-->
	<script type="text/javascript">
	var ids = ["navToolbar"];
	dijit.registry.forEach(function(w){ 
		//if(dojo.indexOf(ids,1)){ // 1 will be yourid it will get destroy
        	w.destroyRecursive();
        //}
    });
	</script>
	<script type="text/javascript">
        require([ "dojo/topic", "dojo/_base/lang"],function(dTopic,dLang){
             //sample to listen for ParcelNumber from map
             dTopic.subscribe("cagis.geosearch.ParcelIdSelected",
             dLang.hitch(this, function (evt) {
             dTopic.publish("cagis.geosearch.showParcel",evt);
             }));       
           });       
    </script>
    <script type="text/javascript">
		//sample to use a parcel number and zoom to it on the map
		require([ "dojo/topic", "dojo/_base/lang"],function(dTopic,dLang){
			//sample to listen for ParcelNumber from map
			    var ParcelIdAsString = <?php echo( $_GET['pid']); ?>  //'59000810511' '07900010128'           
				dTopic.subscribe("cagis.map.mapLoaded",
				dLang.hitch(this, function (evt) {                      
					if (ParcelIdAsString != ''){
						dTopic.publish("cagis.geosearch.showParcel",ParcelIdAsString);
					}
				})); 
			});       
    </script>
</head>
 
<body id="claro">
<div style="width:500px;height:500px;" id="cagMapViewPort" class="cagMapViewPort" ></div>                   
</body>
</html>