<?php
CLASS AJAX{

	private $db;

	public function __construct($db) {
		//baue Datenbankanbindung auf
		$this->db = $db;
	}

	// wird über Ajax-Request abgerufen und wertet die POST-Parameter aus
	
	public function DoSomething(){
		if(isset($_POST['post'])){
			switch ($_POST['post']) {    
				case 'schreibeHistorie':
				   return $this->schreibeHistorie($_POST['id'],$_POST['kommentar'],$_POST['patrone']);
				break;						
				case 'getStatistik':
				   return $this->getStatistik($_POST['drucker_id']);
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
		echo json_encode($return);
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
		$q = "SELECT * FROM `drucker` WHERE `typ` != '' AND `typ` != 'unerreichbar'";
		$return = $this->db->getMehrzeilig($q);
		echo json_encode($return);
	}
	public function holeDruckerMitIp($ip){
		$q = "SELECT * FROM `drucker` WHERE `ip` = '".$ip."'";
		$return = $this->db->getEinzeilig($q);
		return $return;
	}	
	public function holeDruckerMitId($id){
		$q = "SELECT * FROM `drucker` WHERE `ip` = '".$id."'";
		$return = $this->db->getEinzeilig($q);
		return $return;
	}
	
	private function pruefeStand($id,$typ,$toner_schwarz,$toner_magenta,$toner_cyan,$toner_yellow,$debugmode=false){
		$q = "SELECT `kritisch`, `gesendet` FROM `drucker` WHERE `id` = '".$id."'";
		$critArray = $this->db->getEinzeilig($q);		
		$sendmail = false;
		if($typ === "CO"){	// Falls Farbdrucker
			if($toner_schwarz < 10 || $toner_magenta < 10 || $toner_cyan < 10 || $toner_yellow < 10){
				$q = "UPDATE `drucker` SET `kritisch` = 1 WHERE `id` = ".$id."";
				$this->db->fuehreAus($q);	
				if($critArray["gesendet"] == 0){	
					$sendmail = true;
				}
			}else{
				$q = "UPDATE `drucker` SET `kritisch` = 0 WHERE `id` = ".$id."";
				$this->db->fuehreAus($q);	
				$sendmail = false;					
			}
		}elseif($typ === "SW"){ // FALLS Schwarz/Weißdrucker
			if($toner_schwarz < 10){
				$q = "UPDATE `drucker` SET `kritisch` = 1 WHERE `id` = ".$id."";
				$this->db->fuehreAus($q);	
				if($critArray["gesendet"] == 0){				
					$sendmail = true;	
				}
				
			}else{
				$q = "UPDATE `drucker` SET `kritisch` = 0 WHERE `id` = ".$id."";
				$this->db->fuehreAus($q);	
				$sendmail = false;
			}		
		}
		// Wenn sendmail true ist, hat eine der Patronen des Druckers einen kritischen Stand erreicht UND Es wurde noch keine Mail versendet. Eine E-Mail muss gesendet werden
		if($sendmail){
			set_time_limit(120);
			if (!class_exists("phpmailer")) {
			require_once("require.php");
			require_once '../classes/PHPMailer-master/class.phpmailer.php';
			require_once '../classes/PHPMailer-master/PHPMailerAutoload.php';
			require_once '../classes/PHPMailer-master/class.smtp.php'; // Optional, wenn du SMTP benutzen möchtest
			require_once '../classes/PHPMailer-master/language/phpmailer.lang-de.php'; // Optional, wenn du deutsche Fehlermeldungen ausgeben möchtest
			}	
			$mail = new PHPMailer;	
			$config = $this->db->getEinzeilig("SELECT * FROM `config_mail`");
			echo "<pre>";
			$mail->IsSMTP(); 
			if($debugmode){
				$mail->SMTPDebug  = 5;
			}	
			$mail->Host = $config["host"];
			$mail->Port = $config["Port"]; 
			$mail->SMTPSecure = $config["SMTPSecure"];
			$mail->Username = $config["Username"];
			$mail->Password = $config["Password"];
			$mail->SMTPAuth = true;
			$mail->Timeout =   120;
			#$mail->SMTPKeepAlive = true;
			$mail->SMTPAutoTLS = false;
			$mail->From = $config["From"];
			$mail->FromName = $config["FromName"];
			$mail->addAddress($config["addAddress"]);    
			$mail->isHTML(true);                                  // Mail als HTML versenden
			$mail->Subject = $config["Subject"];
			$mail->Body    = "Der Drucker ".$id." hat mindestens einen kritischen Stand! Diese Mail wird nicht erneut versendet!";
			$mail->AltBody = "Der Drucker ".$id." hat mindestens einen kritischen Stand! Diese Mail wird nicht erneut versendet!";
			if(!$mail->send()) {
				echo 'Mail wurde nicht abgesendet';
				echo 'Fehlermeldung: ' . $mail->ErrorInfo;
				$q = "UPDATE `drucker` SET `gesendet` = 0 WHERE `id` = ".$id."";
				$this->db->fuehreAus($q);						
			} else {
				echo 'Nachricht wurde abgesendet.';
				$q = "UPDATE `drucker` SET `gesendet` = 1 WHERE `id` = ".$id."";
				$this->db->fuehreAus($q);					
			}
			$mail->SmtpClose();
		}
		return;
	}
	// Falls eine IP übergeben wird, zeigt die PDF nur die Daten dieses Druckers.
	// Falls die Funktion ohne Parameter aufgerufen wird, zeigt sie alle Drucker an.	
	private function DruckerToPdf($druckerip=false){

		
		require_once("../services/require.php");
//		$pdf->header('Content-type: application/pdf');
		$pdf=new FPDF();
		$pdf->AddPage();
		$pdf->SetFont('Arial','B',16);
		$pdf->Cell(0,0,'HSS DRUCKER MONITORING',0,1,'C');
		$pdf->Cell(0,10,"",0,1);
		$pdf->Cell(0,1,"",1,1);
		$pdf->SetFont('Arial','',8);
		$pdf->Cell(0,4,"",0,1);
		if($druckerip === false){	
			
			$ips = $this->holeAlleIPs();
			for($i = 0; $i<count($ips);$i++){
				$drucker = $this->holeDruckerMitIp($ips[$i]['ip']);
				foreach($drucker as $key => $value){
					if($value === ""){
						$value = "-";
					}
					$string = "".$key.": ".$value;
					$pdf->Cell(0,4,$key,0,1);
					$pdf->SetFont('Arial','B',8);
					$pdf->Cell(0,4,$value,0,1);
					$pdf->SetFont('Arial','',8);
					$pdf->Cell(0,3,"",0,1); 
					
				}
				if($i !== (count($ips)-1)){
					$pdf->AddPage();
					$pdf->Cell(0,10,"",0,1); 
					$pdf->Cell(0,1,"",1,1);					
				}

				
			}
		}else{
				$drucker = $this->holeDruckerMitIp($druckerip);
				if($drucker === false){
					echo "IP nicht vergeben";
				}
				foreach($drucker as $key => $value){
					if($value === ""){
						$value = "-";
					}
					$string = "".$key.": ".$value;
					$pdf->Cell(0,4,$key,0,1);
					$pdf->SetFont('Arial','B',8);
					$pdf->Cell(0,4,$value,0,1);
					$pdf->SetFont('Arial','',8);
					$pdf->Cell(0,3,"",0,1); 
				}

		}

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
	private function getStatistik($drucker_id){
		$q = "SELECT `drucker_id`, `gedruckte_seiten` , UNIX_TIMESTAMP(`datum`)*1000 as `datum` FROM  `statistik` WHERE `drucker_id` = '".$drucker_id."' ORDER BY UNIX_TIMESTAMP(`datum`) DESC LIMIT 12";
		$return = $this->db->getMehrzeilig($q);

		sort($return);

		echo json_encode($return);
	}
	
	
	public function trageEin($ip,$id,$typ,$hersteller,$vendor,$seriennummer,$toner_schwarz,$toner_cyan,$toner_magenta,$toner_yellow,$trommelstand,$gedruckteSeiten,$patronentyp_schwarz,$patronentyp_cyan,$patronentyp_magenta,$patronentyp_yellow,$debugmode = false){
	
	// Eintrag in die Drucker Tabelle
	
		$q = "
			UPDATE 
				`drucker`
			SET
				`ip` = '".$ip."', `typ` = '".$typ."', `hersteller` = '".trim(str_replace("STRING:","",$hersteller))."', 
				`vendor` = '".trim(str_replace("STRING:","",$vendor))."', `seriennummer` = '".trim(str_replace("STRING:","",$seriennummer))."', `toner_schwarz` = ".$toner_schwarz.", 
				`toner_cyan` = ".$toner_cyan.", `toner_magenta` = ".$toner_magenta.", `toner_gelb` = ".$toner_yellow.", 
				`trommelstand` = ".intval($trommelstand).", `gedruckteSeiten` = ".intval($gedruckteSeiten).", 
				`patronentyp_schwarz` = '".trim(str_replace("STRING:","",$patronentyp_schwarz))."', `patronentyp_cyan` = '".trim(str_replace("STRING:","",$patronentyp_cyan))."',
				`patronentyp_magenta` = '".trim(str_replace("STRING:","",$patronentyp_magenta))."',`patronentyp_gelb` = '".trim(str_replace("STRING:","",$patronentyp_yellow))."',
				`aktualisiert` = NOW()
			WHERE 
				`id` = ".$id."
			
		";
		
		
	// Eintrag in die Statistik. Um die Statistik nicht zu überladen, wird nur ein Wert pro Monat angezeigt. Dieser sollte der aktuellste Wert sein.	
		
		$q2 = "DELETE FROM `statistik` WHERE MONTH(NOW()) AND `drucker_id` = ".$id."";
		$q3 = "INSERT INTO `statistik`(`drucker_id`, `gedruckte_seiten`) VALUES (".$id.",".intval($gedruckteSeiten).")
			
		";	
		if($debugmode){
			echo "<pre>";
			echo $q."<br>";
			echo $q2."<br>";
			echo $q3."<br>";
			$this->pruefeStand($id,$typ,$toner_schwarz,$toner_magenta,$toner_cyan,$toner_yellow,true);			
			echo "END OF DEBUG!";
			exit;	
		}
		// Prüfe auf kritischen Tintenstand und sende Mail falls erreicht
		$this->pruefeStand($id,$typ,$toner_schwarz,$toner_magenta,$toner_cyan,$toner_yellow);
		$this->db->fuehreAus($q);
		$this->db->fuehreAus($q2);
		$this->db->fuehreAus($q3);
	}	
	
}	
