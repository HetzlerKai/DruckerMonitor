<?php
class DB {
	private $connection;
	private $host;
	private $database;
	private $user;
	public function __construct($host,$database,$user,$pass) {
	
		// erstelle ein PDO Objekt, mit den Zugangsdaten der Datenbank
		
		$this->connection = new PDO('mysql:host='.$host.';dbname='.$database,$user,$pass,array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
		$this->connection->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_SILENT);
		$this->host = $host;
		$this->database = $database;
		$this->user = $user;
	}
	// gibt nur den ERSTEN Eintrag der Query zurück, auch wenn SQL multiple Ergebnise zurückgeben würde
	public function getEizelnerWert($query) {
		$result = $this->getRow($query,true);
		return (count($result) === 0) ? false : $result[0];
	}	
	// gibt nur die erste Zeile zuück, auch wenn SQL multiple Ergebnise zurückgeben würde
	public function getEinzeilig($query) {
		$rows = $this->getMehrzeilig($query);
		if(isset($rows[0])){
			return $rows[0];
		}else{
			return false;
		}
		
	}
	// Liefert das SQL-Ergebnis als Array
	public function getMehrzeilig($query) {
		$ex = $this->connection->query($query);
		$ex->setFetchMode(PDO::FETCH_ASSOC);
		$rows = array();
		foreach($ex as $row) {
			$rows[] = $row;
		}
		return $rows;
	}	
	// führt eine Query aus und liefert bei einem Insert die ID zurück.
	public function fuehreAus($query) {
		$rows = $this->connection->exec($query);
		return (preg_match('/insert/i',$query)) ? $this->connection->lastInsertId() : $rows;
	}
}