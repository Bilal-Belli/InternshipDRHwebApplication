CREATE DATABASE IF NOT EXISTS StageBDDtest
-- CREATE TABLE IF NOT EXISTS  compte (id INT AUTO_INCREMENT PRIMARY KEY,nom VARCHAR(50),prenom VARCHAR(50), email VARCHAR(100), MotPasse1 VARCHAR(50))

-- Creation des tables de la base de donnes
CREATE TABLE IF NOT EXISTS  compte (email VARCHAR(50) NOT NULL PRIMARY KEY,nom  VARCHAR(50) NOT NULL,prenom VARCHAR(50) NOT NULL,motPasse VARCHAR(200) NOT NULL,typePost VARCHAR(50) NOT NULL,compteActif BOOLEAN);

CREATE TABLE IF NOT EXISTS  direction (IDdirection VARCHAR(50) NOT NULL PRIMARY KEY, nomDirection VARCHAR(100) NOT NULL, emailCompteDirecteur VARCHAR(50), nomSousDirection VARCHAR(100) NOT NULL, emailCompteSousDirecteur VARCHAR(50), FOREIGN KEY (emailCompteDirecteur) REFERENCES  compte(email), FOREIGN KEY (emailCompteSousDirecteur) REFERENCES  compte(email));

CREATE TABLE IF NOT EXISTS  departement (IDdepartement VARCHAR(50)  NOT NULL PRIMARY KEY, nomDepartement VARCHAR(100) NOT NULL, emailCompteChefDep VARCHAR(50), IDdirection VARCHAR(50), IDequipe VARCHAR(50) NOT NULL, emailCompteChefEquipe VARCHAR(50), capaciteEquipe int NOT NULL,FOREIGN KEY (emailCompteChefDep) REFERENCES  compte(email), FOREIGN KEY (IDdirection) REFERENCES  direction(IDdirection), FOREIGN KEY (emailCompteChefEquipe) REFERENCES  compte(email));

CREATE TABLE IF NOT EXISTS  condidat (IDcondidat INT AUTO_INCREMENT PRIMARY KEY,nomCondidat VARCHAR(50) NOT NULL,prenomCondidat VARCHAR(50) NOT NULL,emailCondidat VARCHAR(50) NOT NULL,specialite VARCHAR(100) NOT NULL,degree VARCHAR(100) NOT NULL,etablissement VARCHAR(100) NOT NULL, adressComplet VARCHAR(200) NOT NULL, wilaya VARCHAR(50) NOT NULL, numeroTel VARCHAR(50) NOT NULL, pathCV VARCHAR(200) NOT NULL, remarques VARCHAR(250), IDequipe VARCHAR(50));

CREATE TABLE IF NOT EXISTS  diplome (IDdiplome INT AUTO_INCREMENT PRIMARY KEY,pathDiplome VARCHAR(200) NOT NULL,IDcondidat INT,FOREIGN KEY (IDcondidat) REFERENCES condidat(IDcondidat));

CREATE TABLE IF NOT EXISTS  droits (email VARCHAR(50), supprimer BOOLEAN, modifier BOOLEAN, valider BOOLEAN, FOREIGN KEY (email) REFERENCES  compte(email));

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