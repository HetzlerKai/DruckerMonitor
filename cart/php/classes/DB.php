<?php
class DB {
	private $connection;
	private $host;
	private $database;
	private $user;
	public function __construct($host,$database,$user,$pass) {
		$this->connection = new PDO('mysql:host='.$host.';dbname='.$database,$user,$pass,array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
		$this->connection->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_SILENT);
		$this->host = $host;
		$this->database = $database;
		$this->user = $user;
	}
	public function getEizelnerWert($query) {
		$result = $this->getRow($query,true);
		return (count($result) === 0) ? false : $result[0];
	}	
	public function getEinzeilig($query) {
	/*	$ex = $this->connection->query($query);
		$ex->setFetchMode(PDO::FETCH_ASSOC);
		$result = $ex->fetch();
		
		return ($result === false) ? array() : $result; */
		$rows = $this->getMehrzeilig($query);
		if(isset($rows[0])){
			return $rows[0];
		}else{
			return false;
		}
		
	}
	public function getMehrzeilig($query) {
		$ex = $this->connection->query($query);
		$ex->setFetchMode(PDO::FETCH_ASSOC);
		$rows = array();
		foreach($ex as $row) {
			$rows[] = $row;
		}
		return $rows;
	}	
	public function fuehreAus($query) {
		$rows = $this->connection->exec($query);
		return (preg_match('/insert/i',$query)) ? $this->connection->lastInsertId() : $rows;
	}
}