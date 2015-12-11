<?php
set_time_limit(120);
require_once("require.php");
require '../classes/PHPMailer-master/class.phpmailer.php';
require '../classes/PHPMailer-master/PHPMailerAutoload.php';
require '../classes/PHPMailer-master/class.smtp.php'; // Optional, wenn du SMTP benutzen möchtest
require '../classes/PHPMailer-master/language/phpmailer.lang-de.php'; // Optional, wenn du deutsche Fehlermeldungen ausgeben möchtest
$mail = new PHPMailer;
$config = $db->getEinzeilig("SELECT * FROM `config_mail`");
echo "<pre>";
$mail->IsSMTP(); 
$mail->SMTPDebug  = 5;
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
$mail->addAddress($config["addAddress"]);    // Der Name ist dabei optional
$mail->isHTML(true);                                  // Mail als HTML versenden
$mail->Subject = $config["Subject"];
$mail->Body    = $config["Body"];
$mail->AltBody = $config["AltBody"];
if(!$mail->send()) {
    echo 'Mail wurde nicht abgesendet';
    echo 'Fehlermeldung: ' . $mail->ErrorInfo;
} else {
    echo 'Nachricht wurde abgesendet.';
}
$mail->SmtpClose();