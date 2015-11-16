-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 15. Nov 2015 um 17:53
-- Server Version: 5.6.16
-- PHP-Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `druckermonitoring`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `benutzer`
--

CREATE TABLE IF NOT EXISTS `benutzer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `passwort` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Daten für Tabelle `benutzer`
--

INSERT INTO `benutzer` (`id`, `name`, `passwort`) VALUES
(1, 'admin', 'admin');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `config_mail`
--

CREATE TABLE IF NOT EXISTS `config_mail` (
  `Port` int(11) NOT NULL DEFAULT '587' COMMENT 'SMTP Port',
  `SMTPSecure` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'tls' COMMENT 'SMTP Protokoll',
  `Username` varchar(254) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Benutzername',
  `Password` varchar(254) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Passwort',
  `From` varchar(254) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Sender (email)',
  `FromName` varchar(254) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'HSS DruckerMonitoring' COMMENT 'Sender (name)',
  `addAddress` varchar(254) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Empfänger',
  `Subject` varchar(254) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Betreff',
  `Body` text COLLATE utf8_unicode_ci NOT NULL COMMENT 'E-Mail Inhalt (HTML)',
  `AltBody` text COLLATE utf8_unicode_ci NOT NULL COMMENT 'E-Mail Inhalt (nicht HTML-fähig)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `drucker`
--

CREATE TABLE IF NOT EXISTS `drucker` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `raum` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `mac` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `typ` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `hersteller` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `vendor` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `seriennummer` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `toner_schwarz` int(11) NOT NULL,
  `toner_cyan` int(11) NOT NULL,
  `toner_magenta` int(11) NOT NULL,
  `toner_gelb` int(11) NOT NULL,
  `trommelstand` int(11) NOT NULL,
  `gedruckteSeiten` int(11) NOT NULL,
  `patronentyp_schwarz` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `patronentyp_magenta` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `patronentyp_cyan` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `patronentyp_gelb` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=36 ;

--
-- Daten für Tabelle `drucker`
--

INSERT INTO `drucker` (`id`, `ip`, `raum`, `name`, `mac`, `typ`, `hersteller`, `vendor`, `seriennummer`, `toner_schwarz`, `toner_cyan`, `toner_magenta`, `toner_gelb`, `trommelstand`, `gedruckteSeiten`, `patronentyp_schwarz`, `patronentyp_magenta`, `patronentyp_cyan`, `patronentyp_gelb`) VALUES
(1, '10.103.109.201', '', '', '', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(2, '10.100.207.221', 'ps', 'a207-ps', '00:00:b4:ce:30:78', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(3, '10.102.107.201', 'c107', 'c107-okic5600', '00:11:6b:40:51:b7', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(4, '10.102.107.202', 'c107', 'c107-hpM476dn', 'fc:15:b4:78:f7:53', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(5, '10.102.107.203', 'c107', 'c107-hpM425dn', 'd0:bf:9c:36:f8:09', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(6, '10.102.204.221', 'ps', 'c204-ps', '00:11:6b:40:28:5e', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(7, '10.100.209.201', 'a209', 'a209-hp8620', '34:64:a9:5e:46:99', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(8, '10.100.212.201', 'a212', 'a212-hp8500', 'b4:99:ba:2c:12:ea', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(9, '10.101.7.201', 'a307', 'a307-okib6200', '08:00:37:7f:8d:f7', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(10, '10.102.205.201', 'c205', 'c205-okib4600', '00:80:87:1b:1e:63', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(11, '10.102.205.202', 'c205', 'c205-hpCM2320', '3c:d9:2b:a2:48:1c', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(12, '10.102.204.201', 'c204', 'c204-hpljpro200', '2c:44:fd:06:14:6e', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(13, '10.102.206.201', 'c206', 'c206-okib6200', '08:00:37:7f:8d:c0', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(14, '10.102.207.201', 'c207', 'c207-okib6200', '08:00:37:7f:89:82', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(15, '10.102.114.201', 'c114', 'c114-hl2070', '00:80:77:8d:73:52', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(16, '10.102.114.202', 'c114', 'c114-hpM476dn', '8c:dc:d4:5b:6a:37', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(17, '10.102.114.203', 'c114', 'c114-okib432dn', '00:25:36:0e:13:b7', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(18, '10.103.3.201', 'd003', 'd003-hp8500', '1c:c1:de:44:32:17', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(19, '10.103.6.201', 'd006', 'd006-hp8500', '1c:c1:de:44:32:ea', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(20, '10.103.7.201', 'd007', 'd007-hp8500', '1c:c1:de:44:52:0c', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(21, '10.103.8.201', 'd008', 'd008-hp8500', '1c:c1:de:44:32:ed', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(22, '10.103.106.202', 'd106', 'd106-okib4600', '00:80:87:1b:1e:3d', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(23, '10.103.106.201', 'd106', 'd106-hp2320', '78:e3:b5:f9:00:bb', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(24, '10.103.109.201', 'd109', 'd109-okib512', '00:25:36:8e:c0:1f', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(25, '10.103.110.221', 'd110', 'd110-ps01', '00:40:01:24:12:6a', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(26, '10.103.111.201', 'd111', 'd111-okib512', '00:25:36:8e:c0:af', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(27, '10.103.114.201', 'd114', 'd114-okib4600', '00:80:87:1b:9e:ca', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(28, '10.103.202.201', 'd202', 'd202-hp7500a', '2c:41:38:ff:8d:c5', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(29, '10.103.202.203', 'd202', 'd202-hpM476dn', 'fc:15:b4:78:f7:95', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(30, '10.103.208.201', 'd208', 'd208-hp8500', '1c:c1:de:44:22:99', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(31, '10.103.209.201', 'd209', 'd209-brhl2070', '00:80:77:8d:73:63', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(32, '10.103.210.201', 'd210', 'd210-hp8500', 'b4:99:ba:2c:12:f7', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(33, '10.103.210.202', 'd210', 'd210-okic5750', '00:80:87:9b:42:70', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(34, '10.103.211.201', 'd211', 'd211-okib411', '00:80:87:f2:7c:20', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', ''),
(35, '10.104.104.201', 'e104', 'e104-okib411', '00:80:87:f2:da:14', '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', '', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `historie`
--

CREATE TABLE IF NOT EXISTS `historie` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eintrag` text COLLATE utf8_unicode_ci NOT NULL,
  `Datum` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `krit_mail`
--

CREATE TABLE IF NOT EXISTS `krit_mail` (
  `drucker_id` int(11) unsigned NOT NULL,
  `schwarz` smallint(11) NOT NULL DEFAULT '15',
  `magenta` smallint(11) NOT NULL DEFAULT '15',
  `cyan` smallint(11) NOT NULL DEFAULT '15',
  `gelb` smallint(11) NOT NULL DEFAULT '15',
  `gesendet` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`drucker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='kritische Stände und Mail versendet';

--
-- Daten für Tabelle `krit_mail`
--

INSERT INTO `krit_mail` (`drucker_id`, `schwarz`, `magenta`, `cyan`, `gelb`, `gesendet`) VALUES
(1, 15, 15, 15, 15, 0),
(2, 15, 15, 15, 15, 0),
(3, 15, 15, 15, 15, 0),
(4, 15, 15, 15, 15, 0),
(5, 15, 15, 15, 15, 0),
(6, 15, 15, 15, 15, 0),
(7, 15, 15, 15, 15, 0),
(8, 15, 15, 15, 15, 0),
(9, 15, 15, 15, 15, 0),
(10, 15, 15, 15, 15, 0),
(11, 15, 15, 15, 15, 0),
(12, 15, 15, 15, 15, 0),
(13, 15, 15, 15, 15, 0),
(14, 15, 15, 15, 15, 0),
(15, 15, 15, 15, 15, 0),
(16, 15, 15, 15, 15, 0),
(17, 15, 15, 15, 15, 0),
(18, 15, 15, 15, 15, 0),
(19, 15, 15, 15, 15, 0),
(20, 15, 15, 15, 15, 0),
(21, 15, 15, 15, 15, 0),
(22, 15, 15, 15, 15, 0),
(23, 15, 15, 15, 15, 0),
(24, 15, 15, 15, 15, 0),
(25, 15, 15, 15, 15, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
