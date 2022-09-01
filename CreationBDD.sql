-- CREATE DATABASE IF NOT EXISTS StageBDD
-- CREATE TABLE IF NOT EXISTS  compte (id INT AUTO_INCREMENT PRIMARY KEY,nom VARCHAR(50),prenom VARCHAR(50), email VARCHAR(100), MotPasse1 VARCHAR(50))

-- Creation des tables de la base de donnes
CREATE TABLE IF NOT EXISTS  direction (IDdirection VARCHAR(50)  NOT NULL PRIMARY KEY,FOREIGN KEY (emailCompteDirecteur) REFERENCES  Compte(email));
CREATE TABLE IF NOT EXISTS  sousDirection (IDsousDirection VARCHAR(50)  NOT NULL PRIMARY KEY,FOREIGN KEY (IDdirection) REFERENCES direction(IDdirection));
CREATE TABLE IF NOT EXISTS  sousDirecteur (IDsousDirecteur INT AUTO_INCREMENT PRIMARY KEY,FOREIGN KEY (emailCompteSousDirecteur) REFERENCES  Compte(email), FOREIGN KEY (IDsousDirection) REFERENCES sousDirection(IDsousDirection));
CREATE TABLE IF NOT EXISTS  departement (IDdeparetement VARCHAR(50)  NOT NULL PRIMARY KEY,FOREIGN KEY (emailCompteChefDep) REFERENCES  Compte(email),FOREIGN KEY (IDsousDirection) REFERENCES sousDirection(IDsousDirection));
CREATE TABLE IF NOT EXISTS  equipe (IDequipe INT AUTO_INCREMENT PRIMARY KEY,FOREIGN KEY (emailCompteChefEquipe) REFERENCES  Compte(email), FOREIGN KEY (IDdeparetement) REFERENCES departement(IDdeparetement));
CREATE TABLE IF NOT EXISTS  condidat (IDcondidat INT AUTO_INCREMENT PRIMARY KEY,nomCondidat  NOT NULL VARCHAR(50),prenomCondidat  NOT NULL VARCHAR(50),emailCondidat  NOT NULL VARCHAR(50),specialite  NOT NULL VARCHAR(50),degree  NOT NULL VARCHAR(50),etablissement  NOT NULL VARCHAR(50),adressComplet  NOT NULL VARCHAR(100),wilaya  NOT NULL VARCHAR(50),numeroTel  NOT NULL VARCHAR(50), pathCV  NOT NULL VARCHAR(100), remarques VARCHAR(100), FOREIGN KEY (IDequipe VARCHAR(50)) REFERENCES equipe(IDequipe));
CREATE TABLE IF NOT EXISTS  diplome (IDdiplome INT AUTO_INCREMENT PRIMARY KEY,pathDiplome  NOT NULL VARCHAR(100),FOREIGN KEY (IDcondidat) REFERENCES condidat(IDcondidat));
CREATE TABLE IF NOT EXISTS  compte (email INT AUTO_INCREMENT PRIMARY KEY,nom  NOT NULL VARCHAR(50),prenom  NOT NULL VARCHAR(50),motPasse  NOT NULL VARCHAR(100),typePost  NOT NULL VARCHAR(50));
CREATE TABLE IF NOT EXISTS  droits (FOREIGN KEY (email) REFERENCES  Compte(email),supprimer BOOLEAN,modifier BOOLEAN,valider BOOLEAN);

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