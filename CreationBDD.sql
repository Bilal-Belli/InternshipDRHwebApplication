CREATE DATABASE IF NOT EXISTS StageBDDtest
-- CREATE TABLE IF NOT EXISTS  compte (id INT AUTO_INCREMENT PRIMARY KEY,nom VARCHAR(50),prenom VARCHAR(50), email VARCHAR(100), MotPasse1 VARCHAR(50))

-- Creation des tables de la base de donnes
CREATE TABLE IF NOT EXISTS  compte (email VARCHAR(50) PRIMARY KEY,nom  VARCHAR(50) NOT NULL,prenom VARCHAR(50) NOT NULL,motPasse VARCHAR(100) NOT NULL,typePost VARCHAR(50) NOT NULL);
CREATE TABLE IF NOT EXISTS  direction (IDdirection VARCHAR(50) PRIMARY KEY,emailCompteDirecteur VARCHAR(50),FOREIGN KEY (emailCompteDirecteur) REFERENCES  compte(email));
CREATE TABLE IF NOT EXISTS  sousDirection (IDsousDirection VARCHAR(50) PRIMARY KEY,IDdirection VARCHAR(50),FOREIGN KEY (IDdirection) REFERENCES direction(IDdirection));
CREATE TABLE IF NOT EXISTS  sousDirecteur (IDsousDirecteur INT AUTO_INCREMENT PRIMARY KEY,emailCompteSousDirecteur VARCHAR(50),IDsousDirection VARCHAR(50),FOREIGN KEY (emailCompteSousDirecteur) REFERENCES  compte(email), FOREIGN KEY (IDsousDirection) REFERENCES sousDirection(IDsousDirection));
CREATE TABLE IF NOT EXISTS  departement (IDdeparetement VARCHAR(50)  NOT NULL PRIMARY KEY,emailCompteChefDep VARCHAR(50),IDsousDirection VARCHAR(50),FOREIGN KEY (emailCompteChefDep) REFERENCES  compte(email),FOREIGN KEY (IDsousDirection) REFERENCES sousDirection(IDsousDirection));
CREATE TABLE IF NOT EXISTS  equipe (IDequipe INT AUTO_INCREMENT PRIMARY KEY,emailCompteChefEquipe VARCHAR(50),IDdeparetement VARCHAR(50), FOREIGN KEY (emailCompteChefEquipe) REFERENCES  compte(email), FOREIGN KEY (IDdeparetement) REFERENCES departement(IDdeparetement));
CREATE TABLE IF NOT EXISTS  condidat (IDcondidat INT AUTO_INCREMENT PRIMARY KEY,nomCondidat VARCHAR(50) NOT NULL,prenomCondidat VARCHAR(50) NOT NULL,emailCondidat VARCHAR(50) NOT NULL,specialite VARCHAR(50) NOT NULL,degree VARCHAR(50) NOT NULL,etablissement VARCHAR(50) NOT NULL,adressComplet VARCHAR(100) NOT NULL,wilaya VARCHAR(50) NOT NULL,numeroTel VARCHAR(50) NOT NULL, pathCV VARCHAR(100) NOT NULL, remarques VARCHAR(100),IDequipe int, FOREIGN KEY (IDequipe) REFERENCES equipe(IDequipe));
CREATE TABLE IF NOT EXISTS  diplome (IDdiplome INT AUTO_INCREMENT PRIMARY KEY,pathDiplome VARCHAR(100) NOT NULL,IDcondidat INT,FOREIGN KEY (IDcondidat) REFERENCES condidat(IDcondidat));
CREATE TABLE IF NOT EXISTS  droits (email VARCHAR(50),FOREIGN KEY (email) REFERENCES  compte(email),supprimer BOOLEAN,modifier BOOLEAN,valider BOOLEAN);

-- Delete the data base
-- DROP DATABASE StageBDD;

-- Delete all tables from database
-- DROP TABLE direction;
-- DROP TABLE sousDirection;
-- DROP TABLE sousDirecteur;
-- DROP TABLE departement;
-- DROP TABLE equipe;
-- DROP TABLE condidat;
-- DROP TABLE diplome;
-- DROP TABLE compte;
-- DROP TABLE droits;