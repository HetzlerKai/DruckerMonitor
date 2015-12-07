<?php
CLASS AJAX{

	private $db;

	public function __construct($db) {
		$this->db = $db;
	}

	public function DoSomething(){
		if(isset($_POST['post'])){
			switch ($_POST['post']) {    
	/*			case 'holeAlleDruckerDaten':
				   return $this->holeAlleDruckerDaten();
				break;		
				case 'holeDruckerMitIp':
				   return $this->holeDruckerMitIp($_POST['ip']);
				break;				*/
				case 'schreibeHistorie':
				   return 
				   $this->schreibeHistorie($_POST['id'],$_POST['kommentar'],$_POST['patrone']);
				break;						
				case 'getStatistik':
				   return 
				   $this->getStatistik($_POST['id']);
				break;				
				case 'login':
				   return $this->login($_POST['name'],$_POST['passwort']);
				break;				
				case 'getHistorie':
				   return $this->getHistorie($_POST['id']);
				break;				
				case 'alleDruckerAlsPdf':
				   return $this->DruckerToPdf();
				break;				
				case 'DruckerAlsPdf':
				   return $this->DruckerToPdf($_POST["ip"]);
				break;
				default :
					echo("UNBEKANNT");
				break;
			}	
		}
	}

	private function login($name,$passwort){
		$q = "SELECT `id` FROM `benutzer` WHERE `name` = '".$name."' AND `passwort` = '".$passwort."'";	
		$abfrage = $this->db->getEinzeilig($q);
		if ($abfrage){
			echo $this->holeAlleDruckerDaten();
		}else{
			echo "false";
		}
	}
	private function schreibeHistorie($id,$beschr,$patrone){
		$q = "INSERT INTO `historie` (`id`,`kommentar`,`Patrone`) VALUES ('".$id."','".$beschr."','".$patrone."')";
		$return = $this->db->fuehreAus($q);
		return $return;
	}
	private function getHistorie($id){
		$q = "SELECT * FROM `historie` WHERE `id` = ".$id."";
		$return = $this->db->getMehrzeilig($q);
		echo json_encode($return);
	}
	
	
	public function holeAlleIPs(){
		$q = "SELECT `ip`,`id` FROM `drucker`";
		$return = $this->db->getMehrzeilig($q);
		return $return;
	}

	private function holeAlleDruckerDaten(){
		$q = "SELECT * FROM `drucker` WHERE `typ` != ''";
		$return = $this->db->getMehrzeilig($q);
		echo json_encode($return);
	}
	public function holeDruckerMitIp($ip){
		$q = "SELECT * FROM `drucker` WHERE `ip` = '".$ip."'";
	//	echo $q;
		$return = $this->db->getEinzeilig($q);
		return $return;
	}	
	public function holeDruckerMitId($id){
		$q = "SELECT * FROM `drucker` WHERE `ip` = '".$id."'";
		$return = $this->db->getEinzeilig($q);
		return $return;
	}
	
	private function pruefeStand($id,$typ,$toner_schwarz,$toner_magenta,$toner_cyan,$toner_yellow){
		$q = "SELECT * FROM `krit_mail` WHERE `ip` = '".$id."'";
		$critArray = $this->db->getEinzeilig($q);		
		if($typ === "CO"){
			if($toner_schwarz < $critArray["schwarz"] || $toner_magenta < $critArray["magenta"] || $toner_cyan < $critArray["cyan"] || $toner_yellow < $critArray["gelb"] && $critArray["gesendet"] === 0){
				$q = "UPDATE `krit_mail` SET `gesendet` = 1 WHERE `id` = ".$id."";
				$this->db->fuehreAus($q);		
				require_once("../services/sendMail.php");
			}
		}elseif($typ === "SW"){
			if($toner_schwarz < $critArray["schwarz"] && $critArray["gesendet"] === 0){
				$q = "UPDATE `krit_mail` SET `gesendet` = 1 WHERE `id` = ".$id."";
				$this->db->fuehreAus($q);	
				require_once("../services/sendMail.php");				
			}		
		}
		return;
	}
		
	private function DruckerToPdf($druckerip=false){

		require_once("../services/require.php");
//		$pdf->header('Content-type: application/pdf');

		$pdf=new FPDF();
		$pdf->AddPage();
		$pdf->SetFont('Arial','B',16);
		$pdf->Cell(0,0,'HSS DRUCKER MONITORING',0,1,'C');
		$pdf->Cell(0,10,"",0,1);
		$pdf->SetFont('Arial','B',8);
		if($druckerip === false){	
			
			$ips = $this->holeAlleIPs();
			for($i = 0; $i<count($ips);$i++){
				$drucker = $this->holeDruckerMitIp($ips[$i]['ip']);
			//	var_dump($drucker);
				foreach($drucker as $key => $value){
					$string = "".$key.": ".$value;
				//	var_dump($string);
					$pdf->Cell(0,5,$string,0,1);
				}
				$pdf->Cell(0,5,"",0,1); 
			}
		}else{
				$drucker = $this->holeDruckerMitIp($druckerip);
				if($drucker === false){
					echo "IP nicht vergeben";
				}
				foreach($drucker as $key => $value){
					$string = "".$key.": ".$value;
					$pdf->Cell(0,5,$string,0,1);
				}
				$pdf->Cell(0,5,"",0,1); 	
		}
	//	echo $pdf->Output();
		$pfad = "././pdf/Monitoring.pdf";	
		if(!(is_dir("././pdf/"))){
			mkdir ("././pdf/",0777,true); 
		}
		$out = $pdf->Output("","S");
		$handlePDF = fopen($pfad,"w+");
		fwrite($handlePDF,$out);
		fclose($handlePDF);
		echo "./services/pdf/Monitoring.pdf";
	}	
	private function getStatistik(){
		$q = "SELECT * FROM `statistik` ORDER BY `datum` DESC LIMIT 12";		
		$return = $this->db->getMehrzeilig($q);
		echo json_encode($return);
		
	}
	
	
	public function trageEin($ip,$id,$typ,$hersteller,$vendor,$seriennummer,$toner_schwarz,$toner_cyan,$toner_magenta,$toner_yellow,$trommelstand,$gedruckteSeiten,$patronentyp_schwarz,$patronentyp_cyan,$patronentyp_magenta,$patronentyp_yellow){
		$q ="
			UPDATE 
				`drucker`
			SET
				`ip` = '".$ip."', `typ` = '".$typ."', `hersteller` = '".trim(str_replace("STRING:","",$hersteller))."', 
				`vendor` = '".trim(str_replace("STRING:","",$vendor))."', `seriennummer` = '".trim(str_replace("STRING:","",$seriennummer))."', `toner_schwarz` = ".$toner_schwarz.", 
				`toner_cyan` = ".$toner_cyan.", `toner_magenta` = ".$toner_magenta.", `toner_gelb` = ".$toner_yellow.", 
				`trommelstand` = ".intval($trommelstand).", `gedruckteSeiten` = ".intval($gedruckteSeiten).", 
				`patronentyp_schwarz` = '".trim(str_replace("STRING:","",$patronentyp_schwarz))."', `patronentyp_cyan` = '".trim(str_replace("STRING:","",$patronentyp_cyan))."',
				`patronentyp_magenta` = '".trim(str_replace("STRING:","",$patronentyp_magenta))."',`patronentyp_gelb` = '".trim(str_replace("STRING:","",$patronentyp_yellow))."'
			WHERE 
				`id` = ".$id."
			
		";
	//	var_dump($q);
		$q2 = "DELETE FROM `statistik` WHERE MONTH(NOW()) AND `drucker_id` = ".$id."";
		$q3 = "INSERT INTO `statistik`(`drucker_id`, `gedruckte_seiten`) VALUES (".$id.",".intval($gedruckteSeiten).")
			
		";
	//	var_dump($q2);		
	//	$this->pruefeStand($id,$typ,$toner_schwarz,$toner_magenta,$toner_cyan,$toner_yellow);
		$this->db->fuehreAus($q);
		$this->db->fuehreAus($q2);
		$this->db->fuehreAus($q3);
	//	echo json_encode($return);	
	}	
	
}	