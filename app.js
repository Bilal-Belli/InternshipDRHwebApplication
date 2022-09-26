const express = require('express');
const app = express();
const morgan = require('morgan');
var nodemailer = require('nodemailer');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload');
const { requireAuth } = require('./user/auth');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('combined'));
app.use(fileUpload());
// app.use(express.static('./public')); //used for static html files
app.use(express.static('./views'));//used for background image and icon files
app.use(express.static('./FileslocalStorage'));//used for background image and icon files
app.set('view engine','ejs');
app.get('/', (req,res)=>{
    res.render('index');
    res.end();
});
app.get('/CreerCompte',(req,res)=>{
    res.render('CreerCompte');
    res.end();
});
app.get('/modifierCompte',(req,res)=>{
    res.render('modifierCompte',{data: []});
    res.end();
});
app.get('/InsererCondidat',async (req,res)=>{
    const sql = 'SELECT * FROM condidat';
    const sql2 = "SELECT * FROM diplome";
    const sql3 = "SELECT * FROM pieceidentite";
    try {
        const conn = getConn();
        let condidats, diplomes, pieceidentites;
        await Promise.all(
        [
            conn.query(sql,(err, rows)=>{condidats=rows;}),
            conn.query(sql2,(err, rows)=>{diplomes=rows;}),
            conn.query(sql3,(err, rows)=>{pieceidentites=rows;}),
        ]
        );
        setTimeout(() => {
            console.log('fetch succesfully');
            res.render("InsererCondidat", {
            data: condidats,
            data2: diplomes,
            data3: pieceidentites,
        });},100);
    } catch (error) {
    console.log(error);
    res.end();
    }
});
app.post('/InsererCondidat',async (req, res)=>{
    const Nom = req.body.Nom;
    const Prenom = req.body.Prenom;
    const email = req.body.email;
    const Specialite = req.body.Specialite;
    const Diplome = req.body.Diplome;
    const Etablissement = req.body.Etablissement;
    const Adress = req.body.Adress;
    const Wilaya = req.body.Wilaya;
    const numeroTel = req.body.numeroTel;
    const Remarques = req.body.Remarques;
    // console.log(req.files.pathcv); //show the object
    let documentCV = req.files.pathcv;
    let documentsDiplomes = req.files.diplomes;
    let documentsPID = req.files.PID;

    let nb_diplomes = req.files.diplomes.length;
    let nb_PID = req.files.PID.length;

    let nomDiplomes = [];
    let nomPID = [];

    let uploadPathDiplome = [];
    let uploadPathPID = [];
    
    // console.log(req.files.PID[0].name);
    for(i=0;i<nb_PID;i++){
        nomPID[i] = Nom+"_"+Prenom+"_PID_"+documentsPID[i].name;
        // console.log(nomPID[i]);
    };
    for(i=0;i<nb_diplomes;i++){
        nomDiplomes[i] = Nom+"_"+Prenom+"_DIPLOME_"+documentsDiplomes[i].name;
    };
    const newNameForCV = Nom+"_"+Prenom+"_CV_"+documentCV.name;
    // here is where to save the PID files after upload
    for(i=0;i<nb_PID;i++){
        uploadPathPID[i] = __dirname + '/FileslocalStorage/' + nomPID[i];
        documentsPID[i].mv(uploadPathPID[i], function (err) {
            if (err) {
                console.log("error on moving file :",err);
                res.status(500);
                return res.send(err);
            } ;
            return;
        });
    };
    // here is where to save the diplomas files after upload
    for(i=0;i<nb_diplomes;i++){
        uploadPathDiplome[i] = __dirname + '/FileslocalStorage/' + nomDiplomes[i];
        documentsDiplomes[i].mv(uploadPathDiplome[i], function (err) {
            if (err) {
                console.log("error on moving file :",err);
                res.status(500);
                return res.send(err);
            } ;
            return;
        });
    };
    // Use mv() to place file on the server
    let uploadPath = __dirname + '/FileslocalStorage/' + newNameForCV;
    documentCV.mv(uploadPath, function (err) {
        if (err) {
            console.log("error on moving file :",err);
            res.status(500);
            return res.send(err);
        } 
        return;
    });
    let newInsertedID;
    const sql = 'INSERT INTO condidat VALUES ?'
    const values = [[null, Nom, Prenom, email, Specialite, Diplome, Etablissement, Adress, Wilaya, numeroTel, newNameForCV, Remarques, null]];
    const queryDiplomes = 'INSERT INTO diplome VALUES ?';
    const queryPIDs = 'INSERT INTO pieceIDentite VALUES ?';
    let queryvalues=[];
    let queryvaluesPID=[];
    let conn = getConn();
    await Promise.all(
        [   
            conn.query(sql,[values],(err, results)=>{if(err){console.log('Failed : ',err);}else{newInsertedID = results.insertId;console.log(newInsertedID);return;}}),
            setTimeout(() => {affectDiplomestoSpecificCondidat(nb_diplomes,queryvalues,nomDiplomes,newInsertedID);affectPIDstoSpecificCondidat(nb_PID,queryvaluesPID,nomPID,newInsertedID);return;},1000),
            setTimeout(() => {conn.query(queryDiplomes,[queryvalues],(err)=>{ if (err) console.log("Error to query diplomes :",err);})},2000),
            setTimeout(() => {conn.query(queryPIDs,[queryvaluesPID],(err)=>{if(err){console.log("Error to query PIDs :",err);}else{console.log('Operation Successfully');res.redirect('/InsererCondidat');}})},3000),
        ]
    );
});
function affectDiplomestoSpecificCondidat(nb_diplomes_,queryvalues_,nomDiplomes_,newInsertedID_){
    for(i=0;i<nb_diplomes_;i++){
        queryvalues_[i] = [null,nomDiplomes_[i],newInsertedID_];
    };
};
function affectPIDstoSpecificCondidat(nb_PIDs_,queryvalues_,nomPIDs_,newInsertedID_){
    for(i=0;i<nb_PIDs_;i++){
        queryvalues_[i] = [null,nomPIDs_[i],newInsertedID_];
    };
};
app.post('/modifierInfosCondidat',async (req, res)=>{
    const Nom = req.body.Nom;
    const Prenom = req.body.Prenom;
    const email = req.body.email;
    const Specialite = req.body.Specialite;
    let Diplome = req.body.Diplome;
    const Etablissement = req.body.Etablissement;
    const Adress = req.body.Adress;
    const Wilaya = req.body.Wilaya;
    const numeroTel = req.body.numeroTel;
    const Remarques = req.body.Remarques;
    const condidatIDhidden = req.body.condidatIDhidden;
    Diplome=Diplome.replace(/'/g, "\\'");
    var sql;
    var sql2;
    var sql3;
    let queryvaluesPID=[];
    let queryvalues=[];
    let hpid = req.body.hpid;
    let hdip = req.body.hdip;
    let hcv = req.body.hcv;
    if(req.files != null){
        if (hcv == ''){
            sql = 'UPDATE condidat SET condidat.nomCondidat = \''+Nom+'\',condidat.prenomCondidat = \''+Prenom+'\',condidat.emailCondidat = \''+email+'\',condidat.specialite = \''+Specialite+'\',condidat.diplome = \''+Diplome+'\',condidat.etablissement = \''+Etablissement+'\',condidat.adressComplet = \''+Adress+'\',condidat.wilaya = \''+Wilaya+'\',condidat.numeroTel = \''+numeroTel+'\',condidat.remarques = \''+Remarques+'\' WHERE condidat.IDcondidat = \"'+condidatIDhidden+'\"';
            } else{
            let documentCV = req.files.pathcv;
            const newNameForCV = Nom+"_"+Prenom+"_CV_"+documentCV.name;
            let uploadPath = __dirname + '/FileslocalStorage/' + newNameForCV;
            documentCV.mv(uploadPath, function (err) {
                if (err) {
                    console.log("error on moving file :",err);
                    res.status(500);
                    return res.send(err);
                } 
                return;
            });
            sql = 'UPDATE condidat SET condidat.nomCondidat = \''+Nom+'\',condidat.prenomCondidat = \''+Prenom+'\',condidat.emailCondidat = \''+email+'\',condidat.specialite = \''+Specialite+'\',condidat.diplome = \''+Diplome+'\',condidat.etablissement = \''+Etablissement+'\',condidat.adressComplet = \''+Adress+'\',condidat.wilaya = \''+Wilaya+'\',condidat.numeroTel = \''+numeroTel+'\',condidat.remarques = \''+Remarques+'\',condidat.pathCV = \''+newNameForCV+'\' WHERE condidat.IDcondidat = \"'+condidatIDhidden+'\"';
        }

        if (hpid != ''){
            let nb_PID;
            let nomPID = [];
            let uploadPathPID = [];
            let documentsPID = req.files.PID;
            if(documentsPID.length == null){
                nb_PID = 1;
                for(i=0;i<nb_PID;i++){
                    nomPID[i] = Nom+"_"+Prenom+"_PID_"+documentsPID.name;
                };
                for(i=0;i<nb_PID;i++){
                    uploadPathPID[i] = __dirname + '/FileslocalStorage/' + nomPID[i];
                    documentsPID.mv(uploadPathPID[i], function (err) {
                        if (err) {
                            console.log("error on moving file :",err);
                            res.status(500);
                            return res.send(err);
                        } ;
                        return;
                    });
                };
            } else {
                nb_PID = req.files.PID.length;
                for(i=0;i<nb_PID;i++){
                    nomPID[i] = Nom+"_"+Prenom+"_PID_"+documentsPID[i].name;
                };
                for(i=0;i<nb_PID;i++){
                    uploadPathPID[i] = __dirname + '/FileslocalStorage/' + nomPID[i];
                    documentsPID[i].mv(uploadPathPID[i], function (err) {
                        if (err) {
                            console.log("error on moving file :",err);
                            res.status(500);
                            return res.send(err);
                        } ;
                        return;
                    });
                };
            }
            sql2 = 'INSERT INTO pieceIDentite VALUES ?';
            affectPIDstoSpecificCondidat(nb_PID,queryvaluesPID,nomPID,condidatIDhidden);
        } else{
            sql2 = 'SELECT 1 WHERE false';
        }
    
        if (hdip != ''){
            let nb_diplomes;
            let nomDiplomes = [];
            let uploadPathDiplome = [];
            let documentsDiplomes = req.files.diplomes;
            if(documentsDiplomes.length == null){
                nb_diplomes = 1;
                for(i=0;i<nb_diplomes;i++){
                    nomDiplomes[i] = Nom+"_"+Prenom+"_DIPLOME_"+documentsDiplomes.name;
                };
                for(i=0;i<nb_diplomes;i++){
                    uploadPathDiplome[i] = __dirname + '/FileslocalStorage/' + nomDiplomes[i];
                    documentsDiplomes.mv(uploadPathDiplome[i], function (err) {
                        if (err) {
                            console.log("error on moving file :",err);
                            res.status(500);
                            return res.send(err);
                        } ;
                        return;
                    });
                };
            } else {
                nb_diplomes = req.files.diplomes.length;
                for(i=0;i<nb_diplomes;i++){
                    nomDiplomes[i] = Nom+"_"+Prenom+"_DIPLOME_"+documentsDiplomes[i].name;
                };
                for(i=0;i<nb_diplomes;i++){
                    uploadPathDiplome[i] = __dirname + '/FileslocalStorage/' + nomDiplomes[i];
                    documentsDiplomes[i].mv(uploadPathDiplome[i], function (err) {
                        if (err) {
                            console.log("error on moving file :",err);
                            res.status(500);
                            return res.send(err);
                        } ;
                        return;
                    });
                };
            }
            sql3 = 'INSERT INTO diplome VALUES ?';
            affectDiplomestoSpecificCondidat(nb_diplomes,queryvalues,nomDiplomes,condidatIDhidden);
        } else{
            sql3 = 'SELECT 1 WHERE false';
        }
        } else {
        sql = 'UPDATE condidat SET condidat.nomCondidat = \''+Nom+'\',condidat.prenomCondidat = \''+Prenom+'\',condidat.emailCondidat = \''+email+'\',condidat.specialite = \''+Specialite+'\',condidat.diplome = \''+Diplome+'\',condidat.etablissement = \''+Etablissement+'\',condidat.adressComplet = \''+Adress+'\',condidat.wilaya = \''+Wilaya+'\',condidat.numeroTel = \''+numeroTel+'\',condidat.remarques = \''+Remarques+'\' WHERE condidat.IDcondidat = \"'+condidatIDhidden+'\"';
        sql2 = 'SELECT 1 WHERE false';
        sql3 = 'SELECT 1 WHERE false';
    }
    try {
        let conn = getConn();
        await Promise.all(
        [
            conn.query(sql),
            setTimeout(() => {conn.query(sql2,[queryvaluesPID])},500),
            setTimeout(() => {conn.query(sql3,[queryvalues])},600),
        ]
        );
        setTimeout(() => {res.redirect('/InsererCondidat');},1000);
    } catch (error) {
    console.log(error);
    res.end();
    }
});
app.get('/gestionComptesOptions',async (req, res)=>{
    const querycomptes = 'SELECT * FROM compte';
    const queryDirections = "SELECT * FROM direction";
    const queryDepartments = "SELECT * FROM departement";
    try {
        // Get connection once
        const conn = getConn();
        // Techniques: Array destructuring and Promise resolving in batch
        let comptes, departments, directions;
        await Promise.all(
        [
            conn.query(querycomptes,(err, rows)=>{comptes=rows;} ),
            conn.query(queryDirections,(err, rows)=>{directions=rows;}),
            conn.query(queryDepartments,(err, rows)=>{departments=rows;}),
        ]
        );
        setTimeout(() => {
        res.render("gestionComptesOptions", {
        data: comptes,
        data1: directions,
        data2: departments,
        });},100);
    } catch (error) {
    console.log(error);
    res.end();
    }
});
app.get('/gestionEntreprise',async (req,res)=>{
    const queryDirections = "SELECT IDdirection,nomDirection,nomSousDirection,nomDirecteur,prenomDirecteur,nom nomSousDirecteur,prenom prenomSousDirecteur FROM (SELECT IDdirection,nomDirection,nomSousDirection,MatriculeSousDirecteur,nom nomDirecteur,prenom prenomDirecteur FROM direction AS T LEFT JOIN compte ON T.MatriculeDirecteur = compte.Matricule) AS T LEFT JOIN compte ON T.MatriculeSousDirecteur = compte.Matricule;";
    const queryDepartments = "SELECT IDdepartement,nomDirection,nomDepartement,IDequipe,capaciteEquipe,nomChefDep,prenomChefDep,nom nomChefEqu,prenom prenomChefEqu from (select IDdepartement,nomDirection,nomDepartement,IDequipe,MatriculeChefEquipe,capaciteEquipe,nom nomChefDep,prenom prenomChefDep from (select IDdepartement,nomDepartement,IDequipe,MatriculeChefEquipe,capaciteEquipe,MatriculeChefDep,nomDirection from departement AS T left join direction on T.IDdirection = direction.IDdirection) AS T left join compte ON T.MatriculeChefDep = compte.Matricule) AS T left join compte ON T.MatriculeChefEquipe = compte.Matricule;";
    try {
        // Get connection once
        const conn = getConn();
        // Techniques: Array destructuring and Promise resolving in batch
        let directions, departments;
        await Promise.all(
        [
            conn.query(queryDirections,(err, rows)=>{directions=rows;} ),
            conn.query(queryDepartments,(err, rows)=>{departments=rows;}),
        ]
        );
        setTimeout(() => {
        res.render("gestionEntreprise", {
        data1: directions,
        data2: departments,
        });},100);
    } catch (error) {
    console.log(error);
    res.end();
    }
});
app.post('/motPasseOubliee',async (req, res)=>{
    const emailOubliee = req.body.emailOubliee;
    const query1 = 'select motPasse from compte where compte.email = \"'+emailOubliee+'\";';
    try {
        const conn = getConn();
        let password;
        await Promise.all(
        [
            conn.query(query1,(err, row)=>{password=row[0].motPasse;}),
            setTimeout(() => {sendMailMotPasseOubl(emailOubliee,password);},500)
        ]
        );
        setTimeout(() => {res.redirect('/');},1000);
    } catch (error) {
        console.log('Failed : ', err);
        res.end();
        return;
    }
});
function sendMailMotPasseOubl(emailReciever,passwordDB){
    let emailServer = 'tresor2bilal@gmail.com';
    let message = 'Votre Mot de Passe est: ' + passwordDB;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailServer,
            pass: 'qzxroczfstvbdfhx'
        }
    });
    var mailOptions = {
        from: emailServer,
        to: emailReciever,
        subject: 'Récupération MotPasse GRH AMWT',
        text: message
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Successfully operation: ' + info.response);
        }
    });
}
app.get('/VusialisationCondidats',async (req, res)=>{
    const query1 = 'SELECT * FROM condidat';
    const query2 = 'SELECT * FROM diplome';
    try {
        const conn = getConn();
        let condidats, diplomes_;
        await Promise.all(
        [
            conn.query(query1,(err, rows)=>{condidats=rows;}),
            conn.query(query2,(err, rows)=>{diplomes_=rows;})
        ]
        );
        setTimeout(() => {
        res.render("VusialisationCondidats", {
        data: condidats,
        data2: diplomes_
        });},100);
    } catch (error) {
    console.log(error);
    res.end();
    }
});
app.get('/VusialisationCondidatsUser',async (req, res)=>{
    const query1 = 'SELECT * FROM condidat';
    const query2 = 'SELECT * FROM diplome';
    const query3 = 'select nomDirection,nomSousDirection,nomDepartement,IDequipe,capaciteEquipe from departement natural join direction';
    const query4 = 'SELECT * FROM pieceidentite';
    try {
        const conn = getConn();
        let condidats, diplomes_,props_,pieceidentites;
        await Promise.all(
        [
            conn.query(query1,(err, rows)=>{condidats=rows;}),
            conn.query(query2,(err, rows)=>{diplomes_=rows;}),
            conn.query(query3,(err, rows)=>{props_=rows;}),
            conn.query(query4,(err, rows)=>{pieceidentites=rows;}),
        ]
        );
        setTimeout(() => {
        res.render("VusialisationCondidatsUser", {
        data: condidats,
        data2: diplomes_,
        data3: props_,
        data4: pieceidentites
        });},100);
    } catch (error) {
    console.log(error);
    res.end();
    }
});
app.get('/supprimerCompte', (req, res)=>{
    res.render('supprimerCompte');
    res.end();
});
app.get('/ajouterDir',async (req, res)=>{
    const query1 = 'SELECT email FROM compte where compte.typePost=\"Directeur\" and compte.compteActif=false';
    const query2 = 'SELECT email FROM compte where compte.typePost=\"Sous Directeur\" and compte.compteActif=false';
    try {
        const conn = getConn();
        let comptes1, comptes2;
        await Promise.all(
        [
            conn.query(query1,(err, rows)=>{comptes1=rows;}),
            conn.query(query2,(err, rows)=>{comptes2=rows;})
        ]
        );
        setTimeout(() => {
        res.render("ajouterDir", {
        data1: comptes1,
        data2: comptes2
        });},100);
    } catch (error) {
    console.log(error);
    res.end();
    }
});
app.get('/ajouterDep',async (req, res)=>{
    const query1 = 'SELECT email FROM compte where compte.typePost=\"Chef de Département\" and compte.compteActif=false';
    const query2 = "SELECT IDdirection FROM direction";
    const query3 = 'SELECT email FROM compte where compte.typePost=\"Chef d\'equipe\" and compte.compteActif=false';
    try {
        const conn = getConn();
        let comptes1, directions, comptes2;
        await Promise.all(
        [
            conn.query(query1,(err, rows)=>{comptes1=rows;} ),
            conn.query(query2,(err, rows)=>{directions=rows;}),
            conn.query(query3,(err, rows)=>{comptes2=rows;})
        ]
        );
        setTimeout(() => {
        res.render("ajouterDep", {
        data1: comptes1,
        data2: directions,
        data3: comptes2
        });},100);
    } catch (error) {
    console.log(error);
    res.end();
    }
});
app.get('/supprimerDir', (req, res)=>{
    const sql = 'SELECT IDdirection FROM direction';
    getConn().query(sql, (err, rows)=>{
        if(err){
            console.log('Failed to query ', err);
            res.status(500);
            res.end();
            return;
        }
        console.log('fetch succesfully');
        res.render('supprimerDir',{data: rows});
        return;
    });
});
app.get('/supprimerDep', (req, res)=>{
    const sql = 'SELECT IDdepartement FROM departement';
    getConn().query(sql, (err, rows)=>{
        if(err){
            console.log('Failed to query ', err);
            res.status(500);
            res.end();
            return;
        }
        console.log('succesfully fetch opération');
        res.render('supprimerDep',{data: rows});
        return;
    });
});
app.get('/supprimerEquipe', (req, res)=>{
    const sql = 'SELECT IDequipe FROM equipe';
    getConn().query(sql, (err, rows)=>{
        if(err){
            console.log('Failed to query ', err);
            res.status(500);
            res.end();
            return;
        }
        console.log('succesfully fetch opération');
        res.render('supprimerEquipe',{data: rows});
        return;
    });
});
app.get('/affectationCondidat',async (req, res) => {
    const query1 = 'SELECT * FROM departement';
    const query2 = 'SELECT * FROM condidat';
    const query3 = 'SELECT * FROM direction';
    const query4 = 'SELECT IDequipe,COUNT(IDcondidat) NB_Personnes FROM condidat';
    try {
        const conn = getConn();
        let departements, condidats, directions, comptagePersonnes;
        await Promise.all(
        [
            conn.query(query1,(err, rows)=>{departements=rows;} ),
            conn.query(query2,(err, rows)=>{condidats=rows;}),
            conn.query(query3,(err, rows)=>{directions=rows;}),
            conn.query(query4,(err, rows)=>{comptagePersonnes=rows;})
        ]
        );
        setTimeout(() => {
        res.render("affectationCondidat", {
        data1: departements,
        data2: condidats,
        data3: directions,
        data4: comptagePersonnes
        });},100);
    } catch (error) {
    console.log(error);
    res.end();
    }
});
// app.get('/accueil', requireAuth, (req, res) => { //for middleware
app.get('/accueil', (req, res) => {
    console.log('you are now on home page');
    res.render('accueil');
    res.end();
});
app.get('/adminaccueil', (req, res) => {
    console.log('you are now on admin home page');
    res.render('adminaccueil');
    res.end();
});
// function that get connection to database mysql
function getConn(){
    return mysql.createConnection({
        host: 'localhost',
        user : 'root',
        password: '1234',
        database: 'stagebddtest3'
        // database: 'StageBDD'
    });
}
const conn = getConn();
// CREATING DB on MYSQL:
// conn.connect((err)=>{
//     if(err) throw err;
//     console.log('Connnected');
//     // create database
//     const db = 'CREATE DATABASE IF NOT EXISTS StageBDD';
//     conn.query(db, (err, res)=>{
//         if(err) throw err;
//         console.log('Database created');
//     });
// });
// CREATING TABLE:
// conn.connect((err)=>{
//     if(err) throw err;
//     console.log('Connected to database');
//     const sql = 'CREATE TABLE IF NOT EXISTS  compte (id INT AUTO_INCREMENT PRIMARY KEY,nom VARCHAR(50),prenom VARCHAR(50), email VARCHAR(100), MotPasse1 VARCHAR(50))';
//     conn.query(sql, (err)=>{
//         if(err) throw err;
//         console.log('Table created');
//     })
// })
// DROP TABLE:
// conn.connect((err)=>{
//     if(err) throw err;
//     console.log('Connected');
//     const sql = 'DROP TABLE compte';
//     conn.query(sql, (err)=>{
//         if(err) throw err;
//         console.log('Table deleted');
//     })
// })
// INSERTING DATA:
// conn.connect((err)=>{
//     if(err) throw err;
//     console.log('Connected');
//     const sql = 'INSERT INTO compte VALUES ?';
//     const values = [
//         [null, 'belli', 'bilal', 'jb_belli@esi.dz', 'BBBBBBBB']
//     ];
//     conn.query(sql, [values], (err, res)=>{
//         if(err) throw err;
//         console.log('Data inserted : ', res.affectedRows);
//     })
// })

const router = require('./routes/comptes')
app.use(router)

//Fetch all students
// app.get('/student', (req, res)=>{
//     console.log('Fetching user with id: ', req.params.id)
//     const sql = 'SELECT * FROM student'
//     // const vl = req.params.id
//     getConn().query(sql, (err, rows, fields)=>{
//         if(err){
//             console.log('Failed to query for users ', err);
//             res.status(500)
//             res.end();
//             return;
//         }
//         console.log('I think we fetch student succesfully');
//         res.json(rows);
//     })
// })
//Fetch Student with ID
// app.get('/student/:id', (req, res)=>{
//     console.log('Fetching user with id: ', req.params.id)
//     const sql = 'SELECT * FROM student WHERE id = ?'
//     // const vl = req.params.id
//     getConn().query(sql, [req.params.id], (err, rows, fields)=>{
//         if(err){
//             console.log('Failed to query for users ', err);
//             res.status(500)
//             res.end();
//             return;
//         }
//         console.log('I think we fetch student succesfully');
//         res.json(rows);
//     })
// })
// test de connectivité
app.listen(3000, ()=>{
    console.log('server running port is 3000');
})