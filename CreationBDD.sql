CREATE DATABASE IF NOT EXISTS StageBDDtest

-- Creation des tables de la base de donnes
CREATE TABLE IF NOT EXISTS  compte (Matricule INT AUTO_INCREMENT PRIMARY KEY, typePost VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, nom  VARCHAR(50) NOT NULL, prenom VARCHAR(50) NOT NULL, numeroTelephone VARCHAR(50) NOT NULL, motPasse VARCHAR(200) NOT NULL, dateCreation VARCHAR(50) NOT NULL);
ALTER TABLE compte AUTO_INCREMENT = 20220000;

CREATE TABLE IF NOT EXISTS  direction (IDdirection INT AUTO_INCREMENT PRIMARY KEY, nomDirection VARCHAR(100) NOT NULL, nomSousDirection VARCHAR(100) NOT NULL, MatriculeDirecteur INT, MatriculeSousDirecteur INT, FOREIGN KEY (MatriculeDirecteur) REFERENCES  compte(Matricule), FOREIGN KEY (MatriculeSousDirecteur) REFERENCES  compte(Matricule));

CREATE TABLE IF NOT EXISTS  departement (IDdepartement INT AUTO_INCREMENT PRIMARY KEY, nomDepartement VARCHAR(100) NOT NULL, IDdirection INT, nomEquipe VARCHAR(50) NOT NULL, MatriculeChefDep INT, MatriculeChefEquipe INT, capaciteEquipe int NOT NULL, FOREIGN KEY (MatriculeChefDep) REFERENCES  compte(Matricule), FOREIGN KEY (IDdirection) REFERENCES  direction(IDdirection), FOREIGN KEY (MatriculeChefEquipe) REFERENCES  compte(Matricule));

CREATE TABLE IF NOT EXISTS  condidat (IDcondidat INT AUTO_INCREMENT PRIMARY KEY, nomCondidat VARCHAR(50) NOT NULL, prenomCondidat VARCHAR(50) NOT NULL, emailCondidat VARCHAR(50) NOT NULL, specialite VARCHAR(100) NOT NULL, diplome VARCHAR(100) NOT NULL, dateObtention VARCHAR(100) NOT NULL, etablissement VARCHAR(100) NOT NULL, adressComplet VARCHAR(200) NOT NULL, wilaya VARCHAR(50) NOT NULL, numeroTel VARCHAR(50) NOT NULL, pathCV VARCHAR(200) NOT NULL, remarques VARCHAR(250), IDdepartement int, dateCreation VARCHAR(50) NOT NULL,  FOREIGN KEY (IDdepartement) REFERENCES  departement(IDdepartement));

CREATE TABLE IF NOT EXISTS  diplome (IDdiplome INT AUTO_INCREMENT PRIMARY KEY, pathDiplome VARCHAR(200) NOT NULL, IDcondidat INT, FOREIGN KEY (IDcondidat) REFERENCES condidat(IDcondidat));

CREATE TABLE IF NOT EXISTS  pieceIDentite (IDPID INT AUTO_INCREMENT PRIMARY KEY, pathPID VARCHAR(200) NOT NULL, IDcondidat INT, FOREIGN KEY (IDcondidat) REFERENCES condidat(IDcondidat));

-- Delete the data base
-- DROP DATABASE StageBDDtest;

-- Delete all tables from database
-- DROP TABLE direction;
-- DROP TABLE departement;
-- DROP TABLE condidat;
-- DROP TABLE diplome;
-- DROP TABLE compte;