const express = require('express');
const router = express.Router()
const mysql = require('mysql')

function getConn(){
    return mysql.createConnection({
        host: 'localhost',
        user : 'root',
        password: '1234',
        database: 'stagebddtest3'
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
router.post('/compteReg',async (req, res)=>{
    console.log('CREATION OF A NEW ACCOUNT');
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const MotPasse = req.body.MotPasse1;
    const postDeTravail = req.body.postDeTravail;
    const numTel = req.body.numTel;
    const selPost = req.body.selPost;
    const dateCreationhidden = req.body.dateCreationhidden;
    const compteActif = false; //default value when create a new account
    const sql = 'INSERT INTO compte VALUES ?';
    const values = [[null, postDeTravail, email, nom, prenom, numTel, MotPasse, compteActif, dateCreationhidden]];
    let sql2;
    try {
        const conn = getConn();
        let compt;
        await Promise.all(
        [
            conn.query(sql,[values],(err, rows)=>{compt=rows;}),
            setTimeout(() => {sql2 = editQuery(postDeTravail,compt.insertId,selPost); console.log(sql2);},200),
            setTimeout(() => {conn.query(sql2,(err, rows)=>{directions=rows;})},500),
        ]
        );
        setTimeout(() => {
            console.log('Registration Successfully');
            res.redirect('/gestionComptesOptions');
            return; },100);
    } catch (error) {
    console.log(error);
    res.end();
    }
});
function editQuery(PT,MTR,SPT){
    var query;
    if(PT == "Directeur"){
        query = 'UPDATE direction SET direction.MatriculeDirecteur = '+MTR+' where direction.nomDirection = \"'+SPT+'\"';
    } else{
        if(PT == "Sous Directeur"){
            query = 'UPDATE direction SET direction.MatriculeSousDirecteur = '+MTR+' where direction.nomSousDirection = \"'+SPT+'\"';
        } else{
            if(PT == "Chef de Département"){
                query = 'UPDATE departement SET departement.MatriculeDirecteur = '+MTR+' where departement.nomDepartement = \"'+SPT+'\"';
            } else{
                if(PT == "Chef d'equipe"){
                    query = 'UPDATE departement SET departement.MatriculeDirecteur = '+MTR+' where departement.IDequipe = \"'+SPT+'\"';
                };
            };
        };
    };
    return query;
};
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
    // const idDir = req.body.idDir;
    const nomDir = req.body.nomDir;
    // const emailDIR = req.body.emailDIR;
    const nomSDir = req.body.nomSDir;
    // const emailSDIR = req.body.emailSDIR;
    const sql1 = 'INSERT INTO direction VALUES ?';
    // const sql2 = 'UPDATE compte SET compte.compteActif = True WHERE compte.email = \"'+emailDIR+'\"';
    // const sql3 = 'UPDATE compte SET compte.compteActif = True WHERE compte.email = \"'+emailSDIR+'\"';
    const values = [[null, nomDir, nomSDir, null, null]];
    try {
        const conn = getConn();
        await Promise.all(
        [
            conn.query(sql1,[values],(err)=>{if(err){console.log('Failed : ',err); res.redirect(req.get('referer')); res.end(); return;};} ),
            // conn.query(sql2,(err)=>{if(err){console.log('Failed : ',err); res.redirect(req.get('referer')); res.end(); return;};}),
            // conn.query(sql3,(err)=>{if(err){console.log('Failed : ',err); res.redirect(req.get('referer')); res.end(); return;};}),
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
    // const idDep = req.body.idDep;
    const nomDep = req.body.nomDep;
    // const confEMAILCD = req.body.confEMAILCD;
    const selectedD = req.body.selectedD;
    const idE = req.body.idE;
    // const confCE = req.body.confCE;
    const capE = req.body.capE;
    const sql1 = 'INSERT INTO departement VALUES ?';
    // const sql2 = 'UPDATE compte SET compte.compteActif = True WHERE compte.email = \"'+confEMAILCD+'\"';
    // const sql3 = 'UPDATE compte SET compte.compteActif = True WHERE compte.email = \"'+confCE+'\"';
    const values = [[null, nomDep, selectedD, idE, null, null, capE]];
    try {
        const conn = getConn();
        await Promise.all(
        [
            conn.query(sql1,[values],(err)=>{if(err){console.log('Failed : ',err); res.redirect(req.get('referer')); res.end(); return;};} ),
            // conn.query(sql2,(err)=>{if(err){console.log('Failed : ',err); res.redirect(req.get('referer')); res.end(); return;};}),
            // conn.query(sql3,(err)=>{if(err){console.log('Failed : ',err); res.redirect(req.get('referer')); res.end(); return;};}),
        ]
        );
        res.redirect('/gestionEntreprise');
        return;
    } catch (error) {
    console.log(error);
    res.end();
    }
});
router.post('/supprimerDir',async (req, res)=>{
    const DIR = req.body.DIR;
    const query1 = 'UPDATE compte SET compte.compteActif = false where compte.email=(select emailCompteDirecteur from direction where IDdirection=\"'+DIR+'\")';
    const query2 = 'UPDATE compte SET compte.compteActif = false where compte.email=(select emailCompteSousDirecteur from direction where IDdirection=\"'+DIR+'\")';
    const query3 = 'DELETE FROM direction WHERE direction.IDdirection = \"'+DIR+'\"';
    try {
        const conn = getConn();
        await Promise.all(
        [
            conn.query(query1,(err)=>{console.log('Failed1 : ', err);}),
            conn.query(query2,(err)=>{console.log('Failed2 : ', err);}),
            setTimeout(() => {conn.query(query3,(err)=>{console.log('Failed3 : ', err);})},1000)
        ]
        );
        setTimeout(() => {res.redirect('/gestionEntreprise');},1500);
    } catch (error) {
        console.log('Failed : ', err);
        res.redirect(req.get('referer'));
        res.end();
        return;
    }
});
router.post('/supprimerDep',async (req, res)=>{
    const DEP = req.body.DEP;
    const query1 = 'UPDATE compte SET compte.compteActif = false where compte.email=(select emailCompteChefDep from departement where IDdepartement=\"'+DEP+'\")';
    const query2 = 'UPDATE compte SET compte.compteActif = false where compte.email=(select emailCompteChefEquipe from departement where IDdepartement=\"'+DEP+'\")';
    const query3 = 'UPDATE condidat SET condidat.IDequipe=\"\" where condidat.IDequipe = (select IDequipe from departement where IDdepartement=\"'+DEP+'\")';
    const query4 = 'DELETE FROM departement WHERE departement.IDdepartement = \"'+DEP+'\"';
    try {
        const conn = getConn();
        await Promise.all(
        [
            conn.query(query1,(err)=>{console.log('Failed1 : ', err);}),
            conn.query(query2,(err)=>{console.log('Failed2 : ', err);}),
            conn.query(query3,(err)=>{console.log('Failed3 : ', err);}),
            setTimeout(() => {conn.query(query4,(err)=>{console.log('Failed4 : ', err);})},1000)
        ]
        );
        setTimeout(() => {res.redirect('/gestionEntreprise');},1500);
    } catch (error) {
        console.log('Failed : ', err);
        res.redirect(req.get('referer'));
        res.end();
        return;
    }
});
router.post('/affectationCondidat', (req, res)=>{
    const idCondidat = req.body.idCondidat;
    const idE = req.body.idE;
    const sql = 'UPDATE condidat SET condidat.IDequipe = \"'+idE+'\" WHERE condidat.IDcondidat = \"'+idCondidat+'\"';
    getConn().query(sql,(err)=>{
        if(err){
            console.log('Failed : ', err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            res.redirect('/accueil');
            return;
        }
    })
});
module.exports = router