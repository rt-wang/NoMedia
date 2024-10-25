-- MySQL dump 10.13  Distrib 9.0.1, for macos14 (arm64)
--
-- Host: localhost    Database: NoMedia
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Feedback`
--

DROP TABLE IF EXISTS `Feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Feedback` (
  `feedback_id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('Pending','Reviewed','Resolved') DEFAULT 'Pending',
  `submitted_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`feedback_id`),
  KEY `feedback_ibfk_1` (`user_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Feedback`
--

LOCK TABLES `Feedback` WRITE;
/*!40000 ALTER TABLE `Feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `Feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Keyword`
--

DROP TABLE IF EXISTS `Keyword`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Keyword` (
  `keyword_id` int NOT NULL AUTO_INCREMENT,
  `keyword` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`keyword_id`),
  UNIQUE KEY `keyword` (`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Keyword`
--

LOCK TABLES `Keyword` WRITE;
/*!40000 ALTER TABLE `Keyword` DISABLE KEYS */;
/*!40000 ALTER TABLE `Keyword` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Like`
--

DROP TABLE IF EXISTS `Like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Like` (
  `like_id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `post_id` bigint NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`like_id`),
  UNIQUE KEY `unique_like` (`user_id`,`post_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `like_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `like_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `Post` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Like`
--

LOCK TABLES `Like` WRITE;
/*!40000 ALTER TABLE `Like` DISABLE KEYS */;
/*!40000 ALTER TABLE `Like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Post`
--

DROP TABLE IF EXISTS `Post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Post` (
  `post_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `content` text,
  `title` varchar(255) DEFAULT NULL,
  `post_format` enum('Original','Repost','Quote','Comment') NOT NULL DEFAULT 'Original',
  `topic_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `like_count` int DEFAULT '0',
  `username` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `topic_id` (`topic_id`),
  KEY `post_ibfk_1` (`user_id`),
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `post_ibfk_4` FOREIGN KEY (`topic_id`) REFERENCES `Topic` (`topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Post`
--

LOCK TABLES `Post` WRITE;
/*!40000 ALTER TABLE `Post` DISABLE KEYS */;
/*!40000 ALTER TABLE `Post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PostComment`
--

DROP TABLE IF EXISTS `PostComment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PostComment` (
  `post_id` bigint NOT NULL,
  `parent_post_id` bigint NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `parent_post_id` (`parent_post_id`),
  CONSTRAINT `postcomment_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `Post` (`post_id`),
  CONSTRAINT `postcomment_ibfk_2` FOREIGN KEY (`parent_post_id`) REFERENCES `Post` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PostComment`
--

LOCK TABLES `PostComment` WRITE;
/*!40000 ALTER TABLE `PostComment` DISABLE KEYS */;
/*!40000 ALTER TABLE `PostComment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PostKeyword`
--

DROP TABLE IF EXISTS `PostKeyword`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PostKeyword` (
  `post_id` bigint NOT NULL,
  `keyword_id` int NOT NULL,
  PRIMARY KEY (`post_id`,`keyword_id`),
  KEY `keyword_id` (`keyword_id`),
  CONSTRAINT `postkeyword_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `Post` (`post_id`),
  CONSTRAINT `postkeyword_ibfk_2` FOREIGN KEY (`keyword_id`) REFERENCES `Keyword` (`keyword_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PostKeyword`
--

LOCK TABLES `PostKeyword` WRITE;
/*!40000 ALTER TABLE `PostKeyword` DISABLE KEYS */;
/*!40000 ALTER TABLE `PostKeyword` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PostRepost`
--

DROP TABLE IF EXISTS `PostRepost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PostRepost` (
  `post_id` bigint NOT NULL,
  `original_post_id` bigint NOT NULL,
  `post_format` enum('Repost','Quote') NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `original_post_id` (`original_post_id`),
  CONSTRAINT `postrepost_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `Post` (`post_id`),
  CONSTRAINT `postrepost_ibfk_2` FOREIGN KEY (`original_post_id`) REFERENCES `Post` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PostRepost`
--

LOCK TABLES `PostRepost` WRITE;
/*!40000 ALTER TABLE `PostRepost` DISABLE KEYS */;
/*!40000 ALTER TABLE `PostRepost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Recommendation`
--

DROP TABLE IF EXISTS `Recommendation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Recommendation` (
  `user_id` bigint NOT NULL,
  `post_id` bigint NOT NULL,
  `score` float NOT NULL,
  `generated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`post_id`),
  KEY `post_id` (`post_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `recommendation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `recommendation_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `Post` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Recommendation`
--

LOCK TABLES `Recommendation` WRITE;
/*!40000 ALTER TABLE `Recommendation` DISABLE KEYS */;
/*!40000 ALTER TABLE `Recommendation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Topic`
--

DROP TABLE IF EXISTS `Topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Topic` (
  `topic_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `restricted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`topic_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Topic`
--

LOCK TABLES `Topic` WRITE;
/*!40000 ALTER TABLE `Topic` DISABLE KEYS */;
/*!40000 ALTER TABLE `Topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `bio` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `UKhl4ga9r00rh51mdaf20hmnslt` (`email`),
  UNIQUE KEY `UK5c856itaihtmi69ni04cmpc4m` (`username`),
  UNIQUE KEY `UKt7gueymdut91qb606y2pyjpq0` (`email`),
  UNIQUE KEY `UKtey54ensfdq86nixhse54i7wq` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (5,'jesse','jesse@yahoo.com','$2a$10$0LS5sUXIMSp7hKXXnNHge.KzaHfpoV4O467vIKDWHxF.3pS.Hwi3i','2024-09-27 22:52:20','2024-09-27 23:40:13','Sdfkjsndfkjsbfkjsbdkjfas','Jesse Pinkman');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_Follow`
--

DROP TABLE IF EXISTS `User_Follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_Follow` (
  `follower_id` bigint NOT NULL,
  `followed_id` bigint NOT NULL,
  `followed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`follower_id`,`followed_id`),
  KEY `followed_id` (`followed_id`),
  CONSTRAINT `user_follow_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `user_follow_ibfk_2` FOREIGN KEY (`followed_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_Follow`
--

LOCK TABLES `User_Follow` WRITE;
/*!40000 ALTER TABLE `User_Follow` DISABLE KEYS */;
/*!40000 ALTER TABLE `User_Follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserKeywordPreference`
--

DROP TABLE IF EXISTS `UserKeywordPreference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserKeywordPreference` (
  `user_id` bigint NOT NULL,
  `keyword_id` int NOT NULL,
  `interaction_count` int DEFAULT '0',
  `last_interaction_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`keyword_id`),
  KEY `keyword_id` (`keyword_id`),
  CONSTRAINT `userkeywordpreference_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `userkeywordpreference_ibfk_2` FOREIGN KEY (`keyword_id`) REFERENCES `Keyword` (`keyword_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserKeywordPreference`
--

LOCK TABLES `UserKeywordPreference` WRITE;
/*!40000 ALTER TABLE `UserKeywordPreference` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserKeywordPreference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserPostInteraction`
--

DROP TABLE IF EXISTS `UserPostInteraction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserPostInteraction` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `post_id` bigint NOT NULL,
  `interaction_type` enum('VIEW','LIKE','COMMENT','REPOST','QUOTE','DISLIKE') NOT NULL,
  `interaction_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `idx_user_post` (`user_id`,`post_id`),
  CONSTRAINT `userpostinteraction_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `userpostinteraction_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `Post` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserPostInteraction`
--

LOCK TABLES `UserPostInteraction` WRITE;
/*!40000 ALTER TABLE `UserPostInteraction` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserPostInteraction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usertopicaccess`
--

DROP TABLE IF EXISTS `usertopicaccess`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usertopicaccess` (
  `user_id` bigint NOT NULL,
  `topic_id` int NOT NULL,
  `access_grant_method` varchar(50) NOT NULL,
  `granted_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`topic_id`),
  KEY `topic_id` (`topic_id`),
  CONSTRAINT `usertopicaccess_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `usertopicaccess_ibfk_2` FOREIGN KEY (`topic_id`) REFERENCES `Topic` (`topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usertopicaccess`
--

LOCK TABLES `usertopicaccess` WRITE;
/*!40000 ALTER TABLE `usertopicaccess` DISABLE KEYS */;
/*!40000 ALTER TABLE `usertopicaccess` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserTopicPreference`
--

DROP TABLE IF EXISTS `UserTopicPreference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserTopicPreference` (
  `user_id` bigint NOT NULL,
  `topic_id` int NOT NULL,
  `interaction_count` int DEFAULT '0',
  `last_interaction_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`topic_id`),
  KEY `topic_id` (`topic_id`),
  CONSTRAINT `usertopicpreference_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `usertopicpreference_ibfk_2` FOREIGN KEY (`topic_id`) REFERENCES `Topic` (`topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserTopicPreference`
--

LOCK TABLES `UserTopicPreference` WRITE;
/*!40000 ALTER TABLE `UserTopicPreference` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserTopicPreference` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-29 12:04:12

