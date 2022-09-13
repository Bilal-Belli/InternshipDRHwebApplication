const express = require('express');
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
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
app.get('/InsererCondidat',(req,res)=>{
    const sql = 'SELECT * FROM condidat';
    getConn().query(sql, (err, rows)=>{
        if(err){
            console.log('Failed : ', err);
            res.status(500);
            res.end();
            return;
        }
        console.log('fetch succesfully');
        res.render('InsererCondidat',{data: rows});
        return;
    });
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
    let nb_diplomes = req.files.diplomes.length;
    let nomDiplomes = [];
    let uploadPathDiplome = [];
    for(i=0;i<nb_diplomes;i++){
        nomDiplomes[i] = Nom+"_"+Prenom+"_"+(Math.random() + 1).toString(36).substring(7)+"_"+documentsDiplomes[i].name;
    };
    const newNameForCV = Nom+"_"+Prenom+"_"+(Math.random() + 1).toString(36).substring(7)+"_"+documentCV.name;
    // here is where to save the file after upload
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
    let uploadPath = __dirname + '/FileslocalStorage/' + newNameForCV;
    // Use mv() to place file on the server
    documentCV.mv(uploadPath, function (err) {
        if (err) {
            console.log("error on moving file :",err);
            res.status(500);
            return res.send(err);
        } 
        return;
    });
    // const pathcv = documentCV.name;
    let newInsertedID;
    const sql = 'INSERT INTO condidat VALUES ?'
    const values = [[null, Nom, Prenom, email, Specialite, Diplome, Etablissement, Adress, Wilaya, numeroTel, newNameForCV, Remarques, null]];
    // getConn().query(sql, [values], (err, results)=>{
    //     if(err){
    //         console.log('Failed : ',err);
    //         res.redirect(req.get('referer'));
    //         res.end();
    //         return;
    //     } else {
    //         newInsertedID = results.insertId;
    //         // res.redirect('/InsererCondidat');
    //         return;
    //     }
    // });
    const queryDiplomes = 'INSERT INTO diplome VALUES ?';
    let queryvalues=[];
    // for(i=0;i<nb_diplomes;i++){
    //     queryvalues[i] = [null,nomDiplomes[i],newInsertedID];
    // }
    // await Promise.all([ conn.query(queryDirections,[queryvalues],(err)=>{console.log("Error query diplomes :",err);})]);
    await Promise.all(
        [   
            conn.query(sql,[values],(err, results)=>{if(err){console.log('Failed : ',err);res.redirect(req.get('referer'));res.end();return;}else{newInsertedID = results.insertId;console.log(newInsertedID);return;}}),
            setTimeout(() => {affectDiplomestoSpecificCondidat(nb_diplomes,queryvalues,nomDiplomes,newInsertedID)},500),
            setTimeout(() => {conn.query(queryDiplomes,[queryvalues],(err)=>{if(err){console.log("Error query diplomes :",err);}else{console.log('Operation Successfully');res.redirect('/InsererCondidat');}})},1000),
            // affectDiplomestoSpecificCondidat(nb_diplomes,queryvalues,nomDiplomes,newInsertedID), // not work because of asynchrone node
            // conn.query(queryDiplomes,[queryvalues],(err)=>{if(err){console.log("Error query diplomes :",err);}else{console.log('Operation Successfully');res.redirect('/InsererCondidat');}}), // not work because of asynchrone node
        ]
    );
    // setTimeout(() => {},1000)
    // setTimeout(() => {
    //     getConn().query(queryDiplomes,[queryvalues],(err)=>{console.log("Error query diplomes :",err);});
    //     console.log('Operation Successfully');
    //     res.redirect('/InsererCondidat');
    // },1000);
});
function affectDiplomestoSpecificCondidat(nb_diplomes_,queryvalues_,nomDiplomes_,newInsertedID_){
    for(i=0;i<nb_diplomes_;i++){
        queryvalues_[i] = [null,nomDiplomes_[i],newInsertedID_];
        // console.log(queryvalues_[i]);
    };
};
app.post('/modifierInfosCondidat',(req, res)=>{
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
    // console.log(req.files.pathcv); //show the object
    Diplome=Diplome.replace(/'/g, "\\'");
    let documentCV = req.files.pathcv;
    const newNameForCV = Nom+"_"+Prenom+"_"+(Math.random() + 1).toString(36).substring(7)+"_"+documentCV.name;
    // here is where to save the file after upload
    let uploadPath = __dirname + '/FileslocalStorage/' + newNameForCV;
    // Use mv() to place file on the server
    documentCV.mv(uploadPath, function (err) {
        if (err) {
            console.log("error on moving file :",err);
            res.status(500);
            return res.send(err);
        } 
        return;
    });
    // const pathcv = documentCV.name;
    const sql = 'UPDATE condidat SET condidat.nomCondidat = \''+Nom+'\',condidat.prenomCondidat = \''+Prenom+'\',condidat.emailCondidat = \''+email+'\',condidat.specialite = \''+Specialite+'\',condidat.degree = \''+Diplome+'\',condidat.etablissement = \''+Etablissement+'\',condidat.adressComplet = \''+Adress+'\',condidat.wilaya = \''+Wilaya+'\',condidat.numeroTel = \''+numeroTel+'\',condidat.remarques = \''+Remarques+'\',condidat.pathCV = \''+newNameForCV+'\' WHERE condidat.IDcondidat = \"'+condidatIDhidden+'\"';
    getConn().query(sql,(err, results, fields)=>{
        if(err){
            console.log('Failed : ',err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            console.log('Operation Successfully');
            res.redirect('/InsererCondidat');
            return;
        }
    });
});
app.get('/gestionComptesOptions', (req, res)=>{
    const sql = 'SELECT * FROM compte';
    getConn().query(sql, (err, rows)=>{
        if(err){
            console.log('Failed to query for users ', err);
            res.status(500);
            res.end();
            return;
        }
        console.log('fetch succesfully');
        res.render('gestionComptesOptions',{data: rows});
        return;
    });
});
app.get('/gestionEntreprise',async (req,res)=>{
    const queryDirections = "SELECT * FROM direction";
    const queryDepartments = "SELECT * FROM departement";
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
app.get('/VusialisationCondidats', (req, res)=>{
    const sql = 'SELECT * FROM condidat';
    getConn().query(sql, (err, rows)=>{
        if(err){
            console.log('Failed to query ', err);
            res.status(500);
            res.end();
            return;
        }
        console.log('fetch succesfully');
        res.render('VusialisationCondidats',{data: rows});
        return;
    });
});
app.get('/VusialisationCondidatsUser', (req, res)=>{
    const sql = 'SELECT * FROM condidat';
    getConn().query(sql, (err, rows)=>{
        if(err){
            console.log('Failed to query ', err);
            res.status(500);
            res.end();
            return;
        }
        console.log('fetch succesfully');
        res.render('VusialisationCondidatsUser',{data: rows});
        return;
    });
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
    const query1 = 'SELECT email FROM compte where compte.typePost=\"Chef de Département\"';
    const query2 = "SELECT IDdirection FROM direction";
    const query3 = 'SELECT email FROM compte where compte.typePost=\"Chef d\'equipe\"';
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
        database: 'stagebddtest2'
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