<?php
set_time_limit(120);
require '../classes/PHPMailer-master/class.phpmailer.php';
require '../classes/PHPMailer-master/PHPMailerAutoload.php';
require '../classes/PHPMailer-master/class.smtp.php'; // Optional, wenn du SMTP benutzen möchtest
require '../classes/PHPMailer-master/language/phpmailer.lang-de.php'; // Optional, wenn du deutsche Fehlermeldungen ausgeben möchtest
$mail = new PHPMailer;
$config = $ajax->getEinzeilig("SELECT * FROM `config_mail`");
$mail->IsSMTP(); 
//$mail->SMTPDebug  = 3;
$mail->Host = $config["host"];
//$mail->Host = 'posteo.de';
//$mail->Port = 465;
$mail->Port = $config["port"]; 
$mail->SMTPSecure = $config["SMTPSecure"];
$mail->Username = $config["username"];
$mail->Password = $config["password"];
$mail->SMTPAuth = true;
$mail->Timeout =   60;
$mail->SMTPKeepAlive = true; 

$mail->From = $config["from"];
$mail->FromName = $config["FromName"];
$mail->addAddress($config["addAddress"];);     // Der Name ist dabei optional
//$mail->addReplyTo('info@beispiel.de', 'Information'); // Antwortadresse festlegen
//$mail->addCC('cc@beispiel.de'); 
//$mail->addBCC('bcc@beispiel.de');
 
$mail->isHTML(true);                                  // Mail als HTML versenden
 
$mail->Subject = $config["subject"];
$mail->Body    = $config["body"];
$mail->AltBody = $config["altbody"];
if(!$mail->send()) {
    echo 'Mail wurde nicht abgesendet';
    echo 'Fehlermeldung: ' . $mail->ErrorInfo;
} else {
    echo 'Nachricht wurde abgesendet.';
}
$mail->SmtpClose();