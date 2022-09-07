const express = require('express');
const router = express.Router()
const mysql = require('mysql')

function getConn(){
    return mysql.createConnection({
        host: 'localhost',
        user : 'root',
        password: '1234',
        database: 'stagebddtest'
        // database: 'StageBDD'
    });
}
router.post('/compteCon', (req, res)=>{
    console.log('CONNECTION OF AN ACCOUNT');
    const email = req.body.email;
    const MotPasse = req.body.MotPasse;
    const sql = 'select * from compte where (compte.email = \"'+email+'\" and \"'+MotPasse+'\"=compte.motPasse)';
    getConn().query(sql,(err, results)=>{
        if(err){
            console.log('Failed : ', err);
            res.sendStatus(500);
            res.end();
            return;
        }
        if(results[0] == null){
            console.log("Your Email or Password is wrong");
            res.redirect('index');
            res.end();
            return;
        }else{
            if (results[0].typePost === "Admin"){
                res.redirect('adminaccueil');
                res.end();
                return;
            }else{
                res.redirect('accueil');
                res.end();
                return;
            }
        }
    });
})
router.post('/compteReg', (req, res)=>{
    console.log('CREATION OF A NEW ACCOUNT');
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const MotPasse = req.body.MotPasse1;
    const postDeTravail = req.body.postDeTravail;
    const sql = 'INSERT INTO compte VALUES ?'
    const values = [[email, nom, prenom, MotPasse, postDeTravail]];
    getConn().query(sql, [values], (err, results, fields)=>{
        if(err){
            console.log('Failed Registration new account : ', err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            console.log('Registration Successfully');
            res.redirect('/gestionComptesOptions');
            return;
        }
    })
});
router.post('/fetchCompte', (req, res)=>{
    console.log('EDIT AN ACCOUNT');
    const emailenter = req.body.emailenter;
    const sql = 'SELECT * FROM compte WHERE compte.email = \"'+emailenter+'\"';
    getConn().query(sql,(err, rows)=>{
        if(err){
            console.log('Failed to query ', err);
            res.status(500);
            res.end();
            return;
        } else{
            console.log('succesfully fetch opération');
            res.render('modifierCompte',{data: rows[0]});
            return;
        }
    })
});
router.post('/editCompte', (req, res)=>{
    console.log('EDIT AN ACCOUNT');
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const MotPasse = req.body.MotPasse1;
    const postDeTravail = req.body.postDeTravail;
    const sql = 'UPDATE compte SET compte.email = \''+email+'\',compte.nom = \''+nom+'\', compte.prenom = \''+prenom+'\',compte.typePost = \''+postDeTravail+'\',compte.motPasse = \''+MotPasse+'\' WHERE compte.email = \"'+email+'\"';
    getConn().query(sql,(err, rows)=>{
        if(err){
            console.log('Failed : ', err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            console.log('Edit Account Successfully');
            res.redirect('/gestionComptesOptions');
            return;
        }
    })
});
router.post('/supprimerCompte', (req, res)=>{
    console.log('DELETE AN ACCOUNT');
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
module.exports = router
// test de routage vers ce url
// router.get('/connexion',function(req,res) {
//     res.redirect('next.html');
//     console.log('connexion page');
//     res.end();
// });