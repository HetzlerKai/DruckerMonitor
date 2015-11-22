<?php
CLASS AJAX{

	private $db;

	public function __construct($db) {
		$this->db = $db;
	}

	public function doTheShit(){
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
				   $this->schreibeHistorie($_POST['eintrag']);
				break;				
				case 'login':;
				   return $this->login($_POST['name'],$_POST['passwort']);
				break;				
				case 'getHistorie':;
				   return $this->getHistorie();
				break;				
				case 'alleDruckerAlsPdf':;
				   return $this->DruckerToPdf();
				break;				
				case 'DruckerAlsPdf':;
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
	private function schreibeHistorie($eintrag){
		$q = "INSERT INTO `historie` (`eintrag`) VALUES '".$eintrag."'";
		$return = $this->db->fuehreAus($q);
		return $return;
	}	
	private function getHistorie(){
		$q = "SELECT * FROM `historie`";
		$return = $this->db->getMehrzeilig($q);
		return $return;
	}
	
	
	public function holeAlleIPs(){
		$q = "SELECT `ip`,`id` FROM `drucker`";
		$return = $this->db->getMehrzeilig($q);
		return $return;
	}	

	private function holeAlleDruckerDaten(){
		$q = "SELECT * FROM `drucker`";
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
		if($typ === "farbdrucker"){
			if($toner_schwarz < $critArray["schwarz"] || $toner_magenta < $critArray["magenta"] || $toner_cyan < $critArray["cyan"] || $toner_yellow < $critArray["gelb"] && $critArray["gesendet"] === 0){
				$q = "UPDATE `krit_mail` SET `gesendet` = 1 WHERE `id` = ".$id."";
				$this->db->fuehreAus($q);		
				require_once("../services/sendMail.php");
			}
		}elseif($typ === "schwarzweiss"){
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
	//	header('Content-type: application/pdf');

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
					return "IP nicht vergeben";
				}
				foreach($drucker as $key => $value){
					$string = "".$key.": ".$value;
					$pdf->Cell(0,5,$string,0,1);
				}
				$pdf->Cell(0,5,"",0,1); 	
		}
	//	echo $pdf->Output();
		$handelPDF = fopen("Monitoring.pdf","w+");
		fwrite($handlePDF,$pdf->Output());
		fclose($handlePDF);
		
	}	
	
	
	
	public function trageEin($ip,$id,$typ,$hersteller,$vendor,$seriennummer,$toner_schwarz,$toner_cyan,$toner_magenta,$toner_yellow,$trommelstand,$gedruckteSeiten,$patronentyp_schwarz,$patronentyp_cyan,$patronentyp_magenta,$patronentyp_yellow){
		$q ="
			UPDATE 
				`drucker`
			SET
				`ip` = '".$ip."', `typ` = '".$typ."', `hersteller` = '".$hersteller."', `vendor` = '".$vendor."', `seriennummer` = '".$seriennummer."', `toner_schwarz` = ".$toner_schwarz.", `toner_cyan` = ".$toner_cyan.", `toner_magenta` = ".$toner_magenta.", `toner_gelb` = ".$toner_yellow.", `trommelstatus` = ".intval($trommelstand).", `gedruckteSeiten` = ".intval($gedruckteSeiten).", `patronentyp_schwarz` = '".$patronentyp_schwarz."', `patronentyp_cyan` = '".$patronentyp_cyan."',`patronentyp_magenta` = '".$patronentyp_magenta."',`patronentyp_gelb` = '".$patronentyp_yellow."',
			WHERE 
				`id` = ".$id."
			
		";
		var_dump($q);
		$this->pruefeStand($id,$typ,$toner_schwarz,$toner_magenta,$toner_cyan,$toner_yellow);
		$return = $this->db->fuehreAus($q);
	//	echo json_encode($return);	
	}	
	
}	