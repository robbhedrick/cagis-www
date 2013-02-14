<?php
////////////////////////////////////////////////////////////////////////////////
//  COPYRIGHT 2012 THE CREATIVE DEPARTMENT.
//
//     NOTICE: 
//
//    Program: cagis.php
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
        public $parcel_id;
        public $xcoords;
        public $ycoords;
        public $location;
        public $owner;
        public $res;

        function __construct() {        	
        	// Define the SOAP client
        	$this->client1 = new SoapClient("http://cagisonline.hamilton-co.org/CagisGeoWebServicesV6/GeoParcelDataQueries.asmx?wsdl",array('trace' => 1));
        	$this->client2 = new SoapClient("http://cagisonline.hamilton-co.org/CagisGeoWebServicesV2010/GeoLocator.asmx?wsdl",array('trace' => 1));
        	$this->client3 = new SoapClient("http://cagisonline.hamilton-co.org/CagisGeoWebServicesV2010/GeoParcelDataQueries.asmx?wsdl",array('trace' => 1));
        	
        	// Does action parame exist
        	if(isset($_GET['action'])){
        		$this->action = $_GET['action'];
        		switch ($this->action){
        			case 'findProperties':
					  $this->location = $_GET['location'];
                        $this->res = $this->client2->GeoCodeLocator(array('Location' =>  $this->location, 'StreetMatchMode' => 'Wildcard'));
					  break;
					case 'getPropertyInfo':
					  $this->parcel_id = $_GET['parcel_id'];
					  $this->res = $this->client1->GetParcelInfoByParcelID(array('ParcelID' =>  $this->parcel_id, 'needShape' => false));
					  break;
					case 'getPropertyMap':
					  $this->xcoords = $_GET['xcoords'];
					  $this->ycoords = $_GET['ycoords'];
					  break;
					case 'ownerLastName':
					  $this->owner = $_GET['owner'];
					  $this->res = $this->client3->SearchPropertyBy_OwnerLastName(array('OwnerLastName' =>  $this->owner, 'pagingIndex' => '1'));
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
header("Content-type: application/json");
echo(json_encode($mycagis->res));
?>
               