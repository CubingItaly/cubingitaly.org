/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: article_category_entity
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `article_category_entity` (
  `id` varchar(255) NOT NULL,
  `name` varchar(15) NOT NULL,
  `color` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: article_entity
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `article_entity` (
  `id` varchar(255) NOT NULL,
  `title` varchar(120) NOT NULL,
  `content` text,
  `publishDate` datetime DEFAULT NULL,
  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `summary` varchar(250) DEFAULT NULL,
  `isPublic` tinyint(4) NOT NULL DEFAULT '0',
  `authorId` int(11) DEFAULT NULL,
  `lastEditorId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_d84d3caa203db7cf1725b95b0c4` (`authorId`),
  KEY `FK_44271fe7ab529398c23d8fe4df8` (`lastEditorId`),
  CONSTRAINT `FK_44271fe7ab529398c23d8fe4df8` FOREIGN KEY (`lastEditorId`) REFERENCES `user_entity` (`id`),
  CONSTRAINT `FK_d84d3caa203db7cf1725b95b0c4` FOREIGN KEY (`authorId`) REFERENCES `user_entity` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: article_entity_categories_article_category_entity
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `article_entity_categories_article_category_entity` (
  `articleEntityId` varchar(255) NOT NULL,
  `articleCategoryEntityId` varchar(255) NOT NULL,
  PRIMARY KEY (`articleEntityId`, `articleCategoryEntityId`),
  KEY `FK_4b0c5955c05382d3ced4dd2456f` (`articleCategoryEntityId`),
  CONSTRAINT `FK_4b0c5955c05382d3ced4dd2456f` FOREIGN KEY (`articleCategoryEntityId`) REFERENCES `article_category_entity` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_dbd3746150d522b59d2788d14bc` FOREIGN KEY (`articleEntityId`) REFERENCES `article_entity` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: page_collection_entity
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `page_collection_entity` (
  `id` varchar(255) NOT NULL,
  `title` varchar(100) NOT NULL,
  `isSinglePage` tinyint(4) NOT NULL,
  `pagesNumber` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: role_entity
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `role_entity` (
  `isLeader` tinyint(4) NOT NULL,
  `userId` int(11) NOT NULL,
  `teamId` varchar(5) NOT NULL,
  PRIMARY KEY (`userId`, `teamId`),
  KEY `FK_d229a8f9eb05066f1cc64fa83e2` (`teamId`),
  CONSTRAINT `FK_6b7dbf5da4f72695f2585774f43` FOREIGN KEY (`userId`) REFERENCES `user_entity` (`id`),
  CONSTRAINT `FK_d229a8f9eb05066f1cc64fa83e2` FOREIGN KEY (`teamId`) REFERENCES `team_entity` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: article_category_entity
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: article_entity
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: article_entity_categories_article_category_entity
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: page_collection_entity
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: role_entity
# ------------------------------------------------------------


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
