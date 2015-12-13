<?php
//  Datenbankklasse einbinden und Verbindung aufbauen
require_once("../classes/DB.php");
$host = "localhost";
$database = "DruckerMonitoring";
$user = "root";
$pass = "";
$db = new DB($host,$database,$user,$pass);

// AJAX-Klasse instanziieren und die Switch-Case Funktion aufrufen
// Es wird das Datenbankobjekt übergeben
require_once("../classes/Ajax.php");
$ajax = new AJAX($db);

// fpdf eibinden um PDFs schreiben zu können
require('../classes/fpdf/fpdf.php');