<?php
////////////////////////////////////////////////////////////////////////////////
//  COPYRIGHT 2013 THE CREATIVE DEPARTMENT.
//
//     NOTICE: 
//
//    Program: jsonp.php
// Written By: Robb Hedrick
//       Date: 
//    Comment: 
//
////////////////////////////////////////////////////////////////////////////////

/*  ==============================================
    CLASS: 
    ==============================================  */
    class cagis {
        public $client;
        public $action;
        public $client1;
        public $client2;
        public $parcel_id;
        public $xcoord;
        public $ycoord;
        public $location;
        public $res;

        function __construct() {        	
        	// Define the SOAP client
        	$this->client1 = new SoapClient("http://cagisonline.hamilton-co.org/CagisGeoWebServicesV6/GeoParcelDataQueries.asmx?wsdl",array('trace' => 1));
        	$this->client2 = new SoapClient("http://cagisonline.hamilton-co.org/CagisGeoWebServicesV2010/GeoLocator.asmx?wsdl",array('trace' => 1));
        	
        	// Does action parame exist
        	if(isset($_GET['action'])){
        		$this->action = $_GET['action'];
        		switch ($this->action){
        			case 'geoCodeLocator':
					  $this->location = $_GET['location'];
                        $this->res = $this->client2->GeoCodeLocator(array('Location' =>  $this->location, 'StreetMatchMode' => 'Wildcard'));
					  break;
					case 'getAddressesByParcelID':
					  $this->parcel_id = $_GET['parcel_id'];
					  $this->res = $this->client2->GetAddressesByParcelID(array('ParcelID' =>  $this->parcel_id));
					  break;
					case 'getParcelInfoByParcelID':
					  $this->parcel_id = $_GET['parcel_id'];
					  $this->res = $this->client1->GetParcelInfoByParcelID(array('ParcelID' =>  $this->parcel_id, 'needShape' => false));
					  break;
					case 'getPropertyReport':
					  $this->xcoord = $_GET['x'];
					  $this->ycoord = $_GET['y'];
					  $this->res = $this->client2->locationReport(array('xcoord' =>  $this->xcoord, 'ycoord' =>  $this->ycoord));
					  break;
					default:
					  $this->parcel_id = $_GET['parcel_id'];
					  $this->res = $this->client1->GetParcelInfoByParcelID(array('ParcelID' =>  $this->parcel_id, 'needShape' => false));
					  break;
				}
             }
        }     
}
$mycagis = new cagis();
//header("Content-type: application/json");
echo $_GET['callback'] . '(' . json_encode($mycagis->res) . ')';
?>
               