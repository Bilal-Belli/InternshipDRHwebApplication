const express = require('express');
const router = express.Router()
const mysql = require('mysql')
// test de routage vers ce fichier
router.get('/messages', (req, res)=>{
    console.log('show some messages or whatever');
    res.end()
})
// test de routage vers ce url
// router.get('/connexion',function(req,res) {
//     res.redirect('next.html')
//     console.log('connexion page');
//     res.end();
// });
router.post('/compteReg', (req, res)=>{
    console.log('REGISTRATION OF A NEW ACCOUNT');
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const MotPasse = req.body.MotPasse1;
    const postDeTravail = req.body.postDeTravail;
    const sql = 'INSERT INTO compte VALUES ?'
    const values = [[email, nom, prenom, MotPasse, postDeTravail]];
    getConn().query(sql, [values], (err, results, fields)=>{
        if(err){
            console.log('failed to Reg new account : ', err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            console.log('Inserted new account ', results.insertId);
            res.redirect('/gestionComptesOptions');
            return;
        }
    })
});
router.post('/supprimerCompte', (req, res)=>{
    console.log('DELETE AN ACCOUNT BY EMAIL');
    const email = req.body.email;
    const sql = 'DELETE FROM compte WHERE compte.email = \"'+email+'\"';
    getConn().query(sql,(err)=>{
        if(err){
            console.log('Failed : ', err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            res.redirect('/gestionComptesOptions');
            return;
        }
    })
});
router.post('/ajouterDir', (req, res)=>{
    const idDir = req.body.idDir;
    const emailDIR = req.body.emailDIR;
    const sql = 'INSERT INTO direction VALUES ?';
    const values = [[idDir, emailDIR]];
    getConn().query(sql,[values],(err)=>{
        if(err){
            console.log('Failed : ', err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            res.redirect('/gestionEntreprise');
            return;
        }
    });
});
router.post('/ajouterSousDir', (req, res)=>{
    const idSDir = req.body.idSDir;
    const confDIR = req.body.confDIR;
    const sql = 'INSERT INTO sousdirection VALUES ?';
    const values = [[idSDir, confDIR]];
    getConn().query(sql,[values],(err)=>{
        if(err){
            console.log('Failed : ', err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            res.redirect('/gestionEntreprise');
            return;
        }
    });
});
router.post('/ajouterDep', (req, res)=>{
    const idDep = req.body.idDep;
    const confEMAIL = req.body.confEMAIL;
    const confSDIR = req.body.confSDIR;
    const sql = 'INSERT INTO departement VALUES ?';
    const values = [[idDep, confEMAIL, confSDIR]];
    getConn().query(sql,[values],(err)=>{
        if(err){
            console.log('Failed : ', err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            res.redirect('/gestionEntreprise');
            return;
        }
    });
});
router.post('/ajouterEquipe', (req, res)=>{
    const confCHEF = req.body.confCHEF;
    const confDEP = req.body.confDEP;
    const sql = 'INSERT INTO equipe VALUES ?';
    const values = [[null, confCHEF, confDEP]];
    getConn().query(sql,[values],(err)=>{
        if(err){
            console.log('Failed : ', err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            res.redirect('/gestionEntreprise');
            return;
        }
    });
});
router.post('/supprimerDir', (req, res)=>{
    console.log('DELETE A DIRECTION');
    const DIR = req.body.DIR;
    const sql = 'DELETE FROM direction WHERE direction.IDdirection = \"'+DIR+'\"';
    getConn().query(sql,(err)=>{
        if(err){
            console.log('Failed : ', err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            res.redirect('/gestionEntreprise');
            return;
        }
    });
});
router.post('/supprimerSousDir', (req, res)=>{
    console.log('DELETE A DIRECTION');
    const SDIR = req.body.SDIR;
    const sql = 'DELETE FROM sousdirection WHERE sousdirection.IDsousDirection = \"'+SDIR+'\"';
    getConn().query(sql,(err)=>{
        if(err){
            console.log('Failed : ', err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            res.redirect('/gestionEntreprise');
            return;
        }
    });
});
router.post('/supprimerDep', (req, res)=>{
    console.log('DELETE A DEPARTEMENT');
    const DEP = req.body.DEP;
    const sql = 'DELETE FROM departement WHERE departement.IDdeparetement = \"'+DEP+'\"';
    getConn().query(sql,(err)=>{
        if(err){
            console.log('Failed : ', err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            res.redirect('/gestionEntreprise');
            return;
        }
    });
});
router.post('/supprimerEquipe', (req, res)=>{
    console.log('DELETE A TEAM');
    const EQUIPE = req.body.EQUIPE;
    const sql = 'DELETE FROM equipe WHERE equipe.IDequipe = \"'+EQUIPE+'\"';
    getConn().query(sql,(err)=>{
        if(err){
            console.log('Failed : ', err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            res.redirect('/gestionEntreprise');
            return;
        }
    });
});
router.post('/compteCon', (req, res)=>{
    console.log('CONNECTION OF AN ACCOUNT');
    const email = req.body.email;
    const MotPasse = req.body.MotPasse;
    // console.log(email + ' '+ MotPasse)
    const sql = 'select * from compte where (compte.email = \"'+email+'\" and \"'+MotPasse+'\"=compte.motPasse)'
    getConn().query(sql,(err, results)=>{
        if(err){
            console.log('failed Connect to account : ', err)
            res.sendStatus(500)  
            return
        }
        if(results[0] == null){
            console.log("Your Email or Password is wrong");
            res.render('index')
            res.end();
        }else{
            // console.log(results[0].typePost);
            if (results[0].typePost === "Admin"){
                res.render('adminaccueil')
                res.end();
            }else{
                res.render('accueil')
                res.end();
            }
        }
    })
    // res.redirect('next.html')
    // res.end();
})

function getConn(){
    return mysql.createConnection({
        host: 'localhost',
        user : 'root',
        password: '1234',
        database: 'stagebddtest'
        // database: 'StageBDD'
    });
}
module.exports = router