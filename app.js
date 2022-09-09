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
})
app.get('/CreerCompte',(req,res)=>{
    res.render('CreerCompte');
    res.end();
});
app.get('/modifierCompte',(req,res)=>{
    res.render('modifierCompte',{data: []});//just need to work on it later
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
app.post('/InsererCondidat',(req, res)=>{
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
    const newNameForCV = Nom+"_"+Prenom+"_"+(Math.random() + 1).toString(36).substring(7)+"_"+documentCV.name
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
    const sql = 'INSERT INTO condidat VALUES ?'
    const values = [[null, Nom, Prenom, email, Specialite, Diplome, Etablissement, Adress, Wilaya, numeroTel, newNameForCV, Remarques, null]];
    getConn().query(sql, [values], (err, results, fields)=>{
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
    const querySousDirections = "SELECT * FROM sousdirection";
    const queryDepartments = "SELECT * FROM departement";
    const queryEquipes = "SELECT * FROM equipe";
    try {
        // Get connection once
        const conn = getConn();
        // Techniques: Array destructuring and Promise resolving in batch
        let directions, sousDirections, departments, equipes;
        await Promise.all(
        [
            conn.query(queryDirections,(err, rows)=>{directions=rows;} ),
            conn.query(querySousDirections,(err, rows)=>{sousDirections=rows;}),
            conn.query(queryDepartments,(err, rows)=>{departments=rows;}),
            conn.query(queryEquipes,(err, rows)=>{equipes=rows;}),
        ]
        );
        setTimeout(() => {
        res.render("gestionEntreprise", {
        data1: directions,
        data2: sousDirections,
        data3: departments,
        data4: equipes,
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
app.get('/ajouterDir', (req, res)=>{
    const sql = 'SELECT email FROM compte where compte.typePost=\"Directeur\"';
    getConn().query(sql, (err, rows)=>{
        if(err){
            console.log('Failed to query ', err);
            res.status(500);
            res.end();
            return;
        }
        console.log('fetch succesfully');
        res.render('ajouterDir',{data: rows});
        return;
    });
});
app.get('/ajouterSousDir', (req, res)=>{
    const sql = 'SELECT IDdirection FROM direction';
    getConn().query(sql, (err, rows)=>{
        if(err){
            console.log('Failed to query ', err);
            res.status(500);
            res.end();
            return;
        }
        console.log('fetch succesfully');
        res.render('ajouterSousDir',{data: rows});
        return;
    });
});
app.get('/ajouterDep',async (req, res)=>{
    const query1 = 'SELECT email FROM compte where compte.typePost=\"Chef de Département\"';
    const query2 = "SELECT IDsousDirection FROM sousdirection";
    try {
        const conn = getConn();
        let comptes, sousdirections;
        await Promise.all(
        [
            conn.query(query1,(err, rows)=>{comptes=rows;} ),
            conn.query(query2,(err, rows)=>{sousdirections=rows;})
        ]
        );
        setTimeout(() => {
        res.render("ajouterDep", {
        data1: comptes,
        data2: sousdirections
        });},100);
    } catch (error) {
    console.log(error);
    res.end();
    }
});
app.get('/ajouterEquipe',async (req, res)=>{
    const query1 = "SELECT IDdeparetement FROM departement";
    const query2 = 'SELECT email FROM compte where compte.typePost=\"Chef d\'equipe\"';
    try {
        const conn = getConn();
        let comptes, departements;
        await Promise.all(
        [
            conn.query(query1,(err, rows)=>{departements=rows;} ),
            conn.query(query2,(err, rows)=>{comptes=rows;})
        ]
        );
        setTimeout(() => {
        res.render("ajouterEquipe", {
        data1: departements,
        data2: comptes
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
app.get('/supprimerSousDir', (req, res)=>{
    const sql = 'SELECT IDsousDirection FROM sousdirection';
    getConn().query(sql, (err, rows)=>{
        if(err){
            console.log('Failed to query ', err);
            res.status(500);
            res.end();
            return;
        }
        console.log('fetch succesfully');
        res.render('supprimerSousDir',{data: rows});
        return;
    });
});
app.get('/supprimerDep', (req, res)=>{
    const sql = 'SELECT IDdeparetement FROM departement';
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
        database: 'stagebddtest'
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