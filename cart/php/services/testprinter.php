<?php
require_once("../services/require.php");
set_time_limit(1200);

error_reporting(E_ALL);
ini_set('display_errors', '1');

// Add "library" folder to include path
//set_include_path(get_include_path() . PATH_SEPARATOR . 'library');

require_once '../classes/Kohut/Printer.php';

$ips = $ajax->holeAlleIPs();



// setzte Default-Werte
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

// Ip zum Testen
	$ip = '10.103.109.201';
	$id = 24;
	$printer = new Kohut_SNMP_Printer($ip);  
	$printer->setMaxTimeout(60);  
	// Falls der schwarze Toner nicht null ist, denn dann ist davon auszugehen, dass der Drucker nicht antwortet,
	// werden die restlichen Daten geholt und in die Datenbank geschrieben
	$typ = $printer->getTypeOfPrinter();	
	if($typ !== "unerreichbar"){
		$hersteller = $printer->getFactoryId();
		$vendor = $printer->getVendorName();
		$seriennummer = $printer->getSerialNumber(); 
		
		$toner_schwarz = round($printer->getBlackTonerLevel(), 2); 	
		if ($typ === "CO"){
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

echo "Ende des Skriptes erreicht; Job ausgeführt";