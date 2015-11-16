<?php
require_once("../services/require.php");


error_reporting(E_ALL);
ini_set('display_errors', '1');

// Add "library" folder to include path
set_include_path(get_include_path() . PATH_SEPARATOR . 'library');

require_once '../classes/Kohut/Printer.php';

// IP address of printer in network

$ips = $ajax->holeAlleIPs();

for($i = 0; $i<count($ips);$i++){

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



//	$ip = '10.103.109.201';
	$ip = $ips[$i]["ip"];
	$id = $ips[$i]["id"];
	$printer = new Kohut_SNMP_Printer($ip);  
	echo "<pre>";
//	var_dump($printer);

	print_r($output);
	echo "<br>";
	echo $printer."<br>";
	echo "TONERLEVEL :".$printer->getBlackTonerLevel()."!<br>";
	echo "</pre>";
		if ($printer->isColorPrinter()){
			$typ = 'farbdrucker';}
		elseif ($printer->isMonoPrinter()){ 
			$typ = 'schwarzweiss';
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

		$ajax->trageEin($ip,$id,$typ,$hersteller,$vendor,$seriennummer,$toner_schwarz,$toner_cyan,$toner_magenta,$toner_yellow,$trommelstand,$gedruckteSeiten,$patronentyp_schwarz,$patronentyp_cyan,$patronentyp_magenta,$patronentyp_yellow);
}