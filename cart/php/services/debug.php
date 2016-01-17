<?php
require_once("../services/require.php");
set_time_limit(1200);

error_reporting(E_ALL);
ini_set('display_errors', '1');

// Add "library" folder to include path
set_include_path(get_include_path() . PATH_SEPARATOR . 'library');

require_once '../classes/Kohut/Printer.php';


if(isset($_POST["ip"])){
	$ip = $_POST["ip"];
}else{
	$ip = "10.103.210.202";
}
echo "<pre>";

$typ = "";
$hersteller= "";
$vendor = "";
$seriennummer = "";
$toner_schwarz = 0;
$toner_cyan = 0;
$toner_magenta = 0;
$toner_yellow = 0;
$trommelstand = 0;
$gedruckteSeiten = 0;
$patronentyp_schwarz = "";
$patronentyp_cyan = "";
$patronentyp_magenta = "";
$patronentyp_yellow = "";


//	$id = $ips[$i]["id"];
	$printer = new Kohut_SNMP_Printer($ip);  
	$printer->setMaxTimeout(60);  

	if($printer->getBlackTonerLevel() !== 0){
		if ($printer->isColorPrinter()){
			$typ = 'CO';}
		elseif ($printer->isMonoPrinter()){ 
			$typ = 'SW';
		} 
		$hersteller = $printer->getFactoryId();
		$vendor = $printer->getVendorName();
		$seriennummer = $printer->getSerialNumber(); 
		$toner_schwarz = round($printer->getBlackTonerLevel(), 2); 
		if ($printer->isColorPrinter()){
			$toner_cyan = round($printer->getCyanTonerLevel(), 2);
			$toner_magenta = round($printer->getMagentaTonerLevel(), 2);
			$toner_yellow = round($printer->getYellowTonerLevel(), 2);
		}
		
		$trommelstand = $printer->getDrumLevel();
		$gedruckteSeiten = $printer->getNumberOfPrintedPapers();
			
		$patronentyp_schwarz = $printer->getBlackCatridgeType();
		$patronentyp_cyan =  $printer->getCyanCatridgeType(); 
		$patronentyp_magenta =  $printer->getMagentaCatridgeType();
		$patronentyp_yellow =  $printer->getYellowCatridgeType();

		$ajax->trageEin($ip,"dummy",$typ,$hersteller,$vendor,$seriennummer,$toner_schwarz,$toner_cyan,$toner_magenta,$toner_yellow,$trommelstand,$gedruckteSeiten,$patronentyp_schwarz,$patronentyp_cyan,$patronentyp_magenta,$patronentyp_yellow,true);
	}