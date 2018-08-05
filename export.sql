-- MySQL dump 10.13  Distrib 5.7.22, for Linux (x86_64)
--
-- Host: localhost    Database: ci_web_db
-- ------------------------------------------------------
-- Server version	5.7.22-0ubuntu18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `ci_web_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `ci_web_db` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `ci_web_db`;

--
-- Table structure for table `d_b_article`
--

DROP TABLE IF EXISTS `d_b_article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `d_b_article` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `summary` varchar(200) DEFAULT NULL,
  `creationDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `isPublic` tinyint(4) NOT NULL,
  `authorId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_01658142722604cf4b0ca102cf9` (`authorId`),
  CONSTRAINT `fk_01658142722604cf4b0ca102cf9` FOREIGN KEY (`authorId`) REFERENCES `d_b_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d_b_article`
--

LOCK TABLES `d_b_article` WRITE;
/*!40000 ALTER TABLE `d_b_article` DISABLE KEYS */;
INSERT INTO `d_b_article` VALUES ('a','a','','','2018-05-20 22:22:38.033000','2018-05-20 22:22:38.033000',0,397),('annuncio','Italian Championship 2018','<p style=\"box-sizing: border-box; margin-bottom: 25px; line-height: 28px;\">Salve a tutti!</p><p style=\"box-sizing: border-box; margin-bottom: 25px; line-height: 28px;\"></p><div style=\"\">Come molti di voi sapranno, lo scorso ottobre abbiamo avuto la possibilità di svolgere l\'Italian Open 2017 in una venue d\'eccezione, la sala congressi dell\'Hotel Midas di Roma.</div><div style=\"\">La straordinaria disponibilità dei proprietari della struttura ci ha convinto a chiedere ancora una volta di poter organizzare una grande manifestazione in loco.</div><p></p><p style=\"box-sizing: border-box; margin-bottom: 25px; line-height: 28px;\"></p><div style=\"\">Per questo motivo, in accordo tra i delegati italiani, abbiamo deciso di non annunciare il bando per l\'italian Championship 2018, assegnando la manifestazione direttamente a Roma. La manifestazione si svolgerà nella<br></div><div style=\"\"> suddetta venue nei giorni dal&nbsp;<span style=\"box-sizing: border-box;\">2 al 4 novembre 2018</span><span style=\"box-sizing: border-box;\">.</span></div><div style=\"\">Riteniamo che, e chi era presente ad ottobre può confermarlo, la location sia perfetta sotto ogni aspetto e in grado di accogliere anche un numero altissimo di partecipanti.</div><p></p><p style=\"box-sizing: border-box; margin-bottom: 25px; line-height: 28px;\">Visto che abbiamo deciso di assegnare la sede del campionato italiano 2018 senza aprire il bando, cogliamo l\'occasione per aprire direttamente il bando per il 2019. A breve verranno fornite tutte le informazioni necessarie.</p><p style=\"box-sizing: border-box; margin-bottom: 25px; line-height: 28px;\"></p><div style=\"\">Buone feste,</div><div style=\"box-sizing: border-box;\"><span style=\"box-sizing: border-box;\">Lo Staff di Cubing Italy</span></div><p></p>','L\'Italian Championship 2018 si svolgerà dal 2 al 4 Novembre a Roma.\nPer tutte le informazioni visita il sito!','2018-05-15 20:14:51.927000','2018-05-19 22:52:43.310000',1,454),('dipoiodpas','Bando Italian Championship 2019','<p style=\"box-sizing: border-box; margin-bottom: 25px; line-height: 28px; font-size: 16px; color: rgb(85, 85, 85); font-family: Montserrat, sans-serif;\">Cari cubers italiani,<br style=\"box-sizing: border-box;\">come bene sapete la location degli Italian Championship 2018 è già stata confermata (<a href=\"https://cubingitaly.org/annuncio-ic18\" style=\"box-sizing: border-box; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; color: rgb(47, 47, 47); text-decoration-line: none; word-wrap: break-word; transition: color 0.1s ease-in, background 0.1s ease-in;\">link</a>), quindi siamo lieti di informarvi che è aperto il bando per l\'organizzazione degli Italian Championship 2019.<br style=\"box-sizing: border-box;\">Come già successo nel 2017 sarete voi a dover presentare un progetto concreto e successivamente una commissione provvederà a valutare e scegliere l\'opzione migliore.</p><h2 style=\"box-sizing: border-box; font-family: Montserrat, sans-serif; line-height: 1.1; color: rgb(51, 51, 51); margin-top: 20px; margin-bottom: 10px; font-size: 30px;\"><br></h2><h2 style=\"box-sizing: border-box; font-family: Montserrat, sans-serif; line-height: 1.1; color: rgb(51, 51, 51); margin-top: 20px; margin-bottom: 10px; font-size: 30px;\">Commissioni</h2><ol style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 10px; color: rgb(85, 85, 85); font-family: Montserrat, sans-serif; font-size: 14px;\"><li style=\"box-sizing: border-box;\">I membri della commissione saranno 7.</li><li style=\"box-sizing: border-box;\">I membri della commissione non devono essere coinvolti in nessun progetto.</li><li style=\"box-sizing: border-box;\">I membri della commissione saranno i membri del CI Board e i Team Leader di CI.</li><li style=\"box-sizing: border-box;\">Se uno dei membri dell\'attuale commissione decidesse di voler proporre un progetto verrà sostituito da uno dei membri dei team di Cubing Italy, scelto dal CI Board.</li></ol><p style=\"box-sizing: border-box; margin-bottom: 25px; line-height: 28px; font-size: 16px; color: rgb(85, 85, 85); font-family: Montserrat, sans-serif;\"></p><h2 style=\"box-sizing: border-box; font-family: Montserrat, sans-serif; line-height: 1.1; color: rgb(51, 51, 51); margin-top: 20px; margin-bottom: 10px; font-size: 30px;\">Progetto</h2><ol style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 10px; color: rgb(85, 85, 85); font-family: Montserrat, sans-serif; font-size: 14px;\"><li style=\"box-sizing: border-box;\">Il progetto necessita di un team organizzativo composto da una o più persone.</li><li style=\"box-sizing: border-box;\">L’organizzazione della competizione spetterà agli organizzatori, i quali saranno supportati da tutti i Delegati WCA.</li><li style=\"box-sizing: border-box;\">La scelta della data e del numero di giorni della competizione spetta all’organizzatore.</li><li style=\"box-sizing: border-box;\">La scelta della location e del numero limite di partecipanti spetta all’organizzatore. La proposta dovrà contenere una descrizione della location.</li><li style=\"box-sizing: border-box;\">L’organizzatore dovrà fornire un prospetto delle spese previste per la competizione.</li><li style=\"box-sizing: border-box;\">I costi di iscrizione saranno scelti dall’organizzatore in base ai costi di affitto della sala e al costo di eventuali spese extra (gadget, t-shirt, welcome bag, ecc…).</li><li style=\"box-sizing: border-box;\">Per l’Italian Championship non è previsto il pagamento di alcuna tassa di affitto per le postazioni, ma il profitto della gara finirà interamente nelle casse di CubingItaly e sarà utilizzato per finanziare le competizioni future.</li><li style=\"box-sizing: border-box;\">La proposta del progetto dovrà contenere informazioni riguardo i collegamenti che permettono di raggiungere la città scelta.</li><li style=\"box-sizing: border-box;\">La proposta del progetto dovrà contenere informazioni riguardo eventuali/possibili convenzioni con hotel.</li><li style=\"box-sizing: border-box;\">La proposta del progetto dovrà contenere informazioni riguardo la realizzazione del sito web.</li><li style=\"box-sizing: border-box;\">Eventuali richieste, informazioni aggiuntive o domande rilevanti per l’organizzazione della competizione dovranno essere inviate insieme alla candidatura.</li><li style=\"box-sizing: border-box;\">L\'elenco completo delle informazioni e dei dettagli da fornire alla commissione sarà fornito dalla stessa.</li></ol><p style=\"box-sizing: border-box; margin-bottom: 25px; line-height: 28px; font-size: 16px; color: rgb(85, 85, 85); font-family: Montserrat, sans-serif;\"></p><h2 style=\"box-sizing: border-box; font-family: Montserrat, sans-serif; line-height: 1.1; color: rgb(51, 51, 51); margin-top: 20px; margin-bottom: 10px; font-size: 30px;\">Bando per il campionato italiano 2019</h2><ol style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 10px; color: rgb(85, 85, 85); font-family: Montserrat, sans-serif; font-size: 14px;\"><li style=\"box-sizing: border-box;\">Il periodo di candidatura per il campionato italiano 2019 aprirà mercoledì 25 aprile 2018.</li><li style=\"box-sizing: border-box;\">Il periodo di candidatura per il campionato italiano 2019 chiuderà domenica 30 settembre 2018.</li><li style=\"box-sizing: border-box;\">Per potersi candidare è necessario compilare questo form Google (<a href=\"https://docs.google.com/forms/d/10q8zL2OY-FIAckXv0VzJq85p1AqM4rRhnzGhiA1PSco/edit\" style=\"box-sizing: border-box; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; color: rgb(47, 47, 47); text-decoration-line: none; word-wrap: break-word; transition: color 0.1s ease-in, background 0.1s ease-in;\"><b style=\"box-sizing: border-box; font-weight: bold;\">link</b></a>) il prima possibile.</li><li style=\"box-sizing: border-box;\">La commissione contatterà chiunque invierà il form in modo da accordarsi per la sottomissione delle informazioni dettagliate del progetto.</li><li style=\"box-sizing: border-box;\">I progetti inviati saranno resi pubblici domenica 7 ottobre 2018.</li><li style=\"box-sizing: border-box;\">La commissione valuterà i progetti e l’ufficializzazione avverrà domenica 4 novembre 2018 agli IC18.</li><li style=\"box-sizing: border-box;\">Membri della commissione 2019:<ol style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 0px;\"><li style=\"box-sizing: border-box;\">Gianluca Placenti</li><li style=\"box-sizing: border-box;\">Matteo Provasi</li><li style=\"box-sizing: border-box;\">Lorenzo Vigani Poli</li><li style=\"box-sizing: border-box;\">Simone Cantarelli</li><li style=\"box-sizing: border-box;\">Marco Belotti</li><li style=\"box-sizing: border-box;\">Matteo Colombo</li><li style=\"box-sizing: border-box;\">(vacante)</li></ol></li></ol>','È aperto il bando per l\'organizzazione dell\'italian championship 2019! \nNel bando sono presenti tutte le procedure organizzative','2018-05-18 18:39:08.711000','2018-05-18 23:39:25.292000',1,397),('fdgarwr','fdgarwr','<p>DSFSDF</p>','dsffsdfd','2018-06-11 23:24:30.621000','2018-06-11 23:24:30.621000',0,397);
/*!40000 ALTER TABLE `d_b_article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d_b_article_categories_d_b_article_category`
--

DROP TABLE IF EXISTS `d_b_article_categories_d_b_article_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `d_b_article_categories_d_b_article_category` (
  `dBArticleId` varchar(255) NOT NULL,
  `dBArticleCategoryId` int(11) NOT NULL,
  PRIMARY KEY (`dBArticleId`,`dBArticleCategoryId`),
  KEY `fk_ae3d66ca092da324338cce0b77c` (`dBArticleCategoryId`),
  CONSTRAINT `fk_13ef49b5eed5d5ffdcfd0ab04e0` FOREIGN KEY (`dBArticleId`) REFERENCES `d_b_article` (`id`),
  CONSTRAINT `fk_ae3d66ca092da324338cce0b77c` FOREIGN KEY (`dBArticleCategoryId`) REFERENCES `d_b_article_category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d_b_article_categories_d_b_article_category`
--

LOCK TABLES `d_b_article_categories_d_b_article_category` WRITE;
/*!40000 ALTER TABLE `d_b_article_categories_d_b_article_category` DISABLE KEYS */;
INSERT INTO `d_b_article_categories_d_b_article_category` VALUES ('annuncio',1),('dipoiodpas',1),('annuncio',3),('dipoiodpas',3),('dipoiodpas',4);
/*!40000 ALTER TABLE `d_b_article_categories_d_b_article_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d_b_article_category`
--

DROP TABLE IF EXISTS `d_b_article_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `d_b_article_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d_b_article_category`
--

LOCK TABLES `d_b_article_category` WRITE;
/*!40000 ALTER TABLE `d_b_article_category` DISABLE KEYS */;
INSERT INTO `d_b_article_category` VALUES (1,'Annunci','#7fc435'),(2,'Notizie','#f4b042'),(3,'Tutorial','#533696'),(4,'Interviste','#31b2b0');
/*!40000 ALTER TABLE `d_b_article_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d_b_role`
--

DROP TABLE IF EXISTS `d_b_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `d_b_role` (
  `leader` tinyint(4) NOT NULL,
  `memberId` int(11) NOT NULL,
  `teamId` varchar(255) NOT NULL,
  PRIMARY KEY (`memberId`,`teamId`),
  KEY `fk_020a8376f0ca31f7d313f14036f` (`teamId`),
  CONSTRAINT `fk_020a8376f0ca31f7d313f14036f` FOREIGN KEY (`teamId`) REFERENCES `d_b_team` (`id`),
  CONSTRAINT `fk_3c2ef0b926b2211078db922d580` FOREIGN KEY (`memberId`) REFERENCES `d_b_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d_b_role`
--

LOCK TABLES `d_b_role` WRITE;
/*!40000 ALTER TABLE `d_b_role` DISABLE KEYS */;
INSERT INTO `d_b_role` VALUES (1,280,'citc'),(1,397,'admin'),(0,454,'citi');
/*!40000 ALTER TABLE `d_b_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d_b_team`
--

DROP TABLE IF EXISTS `d_b_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `d_b_team` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d_b_team`
--

LOCK TABLES `d_b_team` WRITE;
/*!40000 ALTER TABLE `d_b_team` DISABLE KEYS */;
INSERT INTO `d_b_team` VALUES ('admin','Admin'),('board','Cubing Italy Board'),('citc','Cubing Italy Team Comunicazione'),('citi','Cubing Italy Team Informatico'),('citq','Cubing Italy Team Qualità');
/*!40000 ALTER TABLE `d_b_team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d_b_user`
--

DROP TABLE IF EXISTS `d_b_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `d_b_user` (
  `id` int(11) NOT NULL,
  `wca_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `delegate_status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d_b_user`
--

LOCK TABLES `d_b_user` WRITE;
/*!40000 ALTER TABLE `d_b_user` DISABLE KEYS */;
INSERT INTO `d_b_user` VALUES (280,'2007POLI01','Lorenzo Vigani Poli','delegate'),(397,'2009COLO03','Matteo Colombo',NULL),(454,'2012CANT02','Simone Cantarelli','candidate_delegate');
/*!40000 ALTER TABLE `d_b_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-07-07 20:59:05
