const express = require('express');
const router = express.Router()
const mysql = require('mysql')

function getConn(){
    return mysql.createConnection({
        host: 'localhost',
        user : 'root',
        password: '1234',
        database: 'stagebddtest2'
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
    const compteActif = false; //default value when create a new account
    const sql = 'INSERT INTO compte VALUES ?'
    const values = [[email, nom, prenom, MotPasse, postDeTravail, compteActif]];
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
            if(rows[0] == null){
                console.log('no results on DB about your query');
                res.render('modifierCompte',{data: []});
                return;
            } else {
                console.log('succesfully fetch opération');
                res.render('modifierCompte',{data: rows[0]});
                return;
            }
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
    });
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
router.post('/ajouterDir',async (req, res)=>{
    const idDir = req.body.idDir;
    const nomDir = req.body.nomDir;
    const emailDIR = req.body.emailDIR;
    const nomSDir = req.body.nomSDir;
    const emailSDIR = req.body.emailSDIR;
    const sql1 = 'INSERT INTO direction VALUES ?';
    const sql2 = 'UPDATE compte SET compte.compteActif = True WHERE compte.email = \"'+emailDIR+'\"';
    const sql3 = 'UPDATE compte SET compte.compteActif = True WHERE compte.email = \"'+emailSDIR+'\"';
    const values = [[idDir, nomDir, emailDIR, nomSDir, emailSDIR]];
    try {
        const conn = getConn();
        await Promise.all(
        [
            conn.query(sql1,[values],(err)=>{if(err){console.log('Failed : ',err); res.redirect(req.get('referer')); res.end(); return;};} ),
            conn.query(sql2,(err)=>{if(err){console.log('Failed : ',err); res.redirect(req.get('referer')); res.end(); return;};}),
            conn.query(sql3,(err)=>{if(err){console.log('Failed : ',err); res.redirect(req.get('referer')); res.end(); return;};}),
        ]
        );
        res.redirect('/gestionEntreprise');
        return;
    } catch (error) {
    console.log(error);
    res.end();
    }
});
router.post('/ajouterDep',async (req, res)=>{
    const idDep = req.body.idDep;
    const nomDep = req.body.nomDep;
    const confEMAILCD = req.body.confEMAILCD;
    const confD = req.body.confD;
    const idE = req.body.idE;
    const confCE = req.body.confCE;
    const capE = req.body.capE;

    const sql1 = 'INSERT INTO departement VALUES ?';
    const sql2 = 'UPDATE compte SET compte.compteActif = True WHERE compte.email = \"'+confEMAILCD+'\"';
    const sql3 = 'UPDATE compte SET compte.compteActif = True WHERE compte.email = \"'+confCE+'\"';
    const values = [[idDep, nomDep, confEMAILCD, confD, idE, confCE, capE]];
    try {
        const conn = getConn();
        await Promise.all(
        [
            conn.query(sql1,[values],(err)=>{if(err){console.log('Failed : ',err); res.redirect(req.get('referer')); res.end(); return;};} ),
            conn.query(sql2,(err)=>{if(err){console.log('Failed : ',err); res.redirect(req.get('referer')); res.end(); return;};}),
            conn.query(sql3,(err)=>{if(err){console.log('Failed : ',err); res.redirect(req.get('referer')); res.end(); return;};}),
        ]
        );
        res.redirect('/gestionEntreprise');
        return;
    } catch (error) {
    console.log(error);
    res.end();
    }
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
router.post('/supprimerDep', (req, res)=>{
    const DEP = req.body.DEP;
    const sql = 'DELETE FROM departement WHERE departement.IDdepartement = \"'+DEP+'\"';
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