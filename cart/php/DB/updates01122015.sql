CREATE TABLE IF NOT EXISTS `statistik` (
  `drucker_id` int(11) NOT NULL,
  `gedruckte_seiten` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
CREATE TABLE IF NOT EXISTS `historie` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Beschreibung` text COLLATE utf8_unicode_ci NOT NULL,
  `Datum` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Patrone` varchar(254) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;