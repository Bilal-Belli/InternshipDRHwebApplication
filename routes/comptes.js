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
            res.redirect('/');
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
            setTimeout(() => {sql2 = editQuery(postDeTravail,compt.insertId,selPost);},200),
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
                query = 'UPDATE departement SET departement.MatriculeChefDep = '+MTR+' where departement.nomDepartement = \"'+SPT+'\"';
            } else{
                if(PT == "Chef d'equipe"){
                    query = 'UPDATE departement SET departement.MatriculeChefEquipe = '+MTR+' where departement.IDequipe = \"'+SPT+'\"';
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
router.post('/supprimerCompte',async (req, res)=>{
    const hiddenQR = req.body.hiddenQR;
    let result = [];
    let query1 = 'DELETE FROM compte WHERE ';
    let query2 = 'UPDATE direction SET direction.MatriculeDirecteur = null where ';
    let query3 = 'UPDATE direction SET direction.MatriculeSousDirecteur = null where ';
    let query4 = 'UPDATE departement SET departement.MatriculeChefDep = null where ';
    let query5 = 'UPDATE departement SET departement.MatriculeChefEquipe = null where ';
    result = hiddenQR.match(/("[^"]+"|[^"\s]+)/g);
    for(rr=0;rr<result.length;rr++) {
        if (rr == (result.length - 1)){
            query1 += "compte.Matricule = " + result[rr] + " ; ";
            query2 += "direction.MatriculeDirecteur = " + result[rr] + " ; ";
            query3 += "direction.MatriculeSousDirecteur = " + result[rr] + " ; ";
            query4 += "departement.MatriculeChefDep = " + result[rr] + " ; ";
            query5 += "departement.MatriculeChefEquipe = " + result[rr] + " ; ";
        }else{
            query1 += "compte.Matricule = " + result[rr] + " or ";
            query2 += "direction.MatriculeDirecteur = " + result[rr] + " or ";
            query3 += "direction.MatriculeSousDirecteur = " + result[rr] + " or ";
            query4 += "departement.MatriculeChefDep = " + result[rr] + " or ";
            query5 += "departement.MatriculeChefEquipe = " + result[rr] + " or ";
        }
    }
    try {
        const conn = getConn();
        await Promise.all(
        [
            setTimeout(() => {conn.query(query1)},200),
            conn.query(query2),
            conn.query(query3),
            conn.query(query4),
            conn.query(query5),
        ]
        );
        setTimeout(() => {
            res.redirect('/gestionComptesOptions');
            return; },300);
    } catch (error) {
    console.log(error);
    res.end();
    }
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
    const nomDep = req.body.nomDep;
    const selectedD = req.body.selectedD;
    const idE = req.body.idE;
    const capE = req.body.capE;
    const sql1 = 'INSERT INTO departement VALUES ?';
    const values = [[null, nomDep, selectedD, idE, null, null, capE]];
    try {
        const conn = getConn();
        await Promise.all(
        [
            conn.query(sql1,[values],(err)=>{if(err){console.log('Failed : ',err); res.redirect(req.get('referer')); res.end(); return;};} ),
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
    const hiddenQR_1 = req.body.hiddenQR_1;
    let result = [];
    let query1 = 'DELETE FROM direction WHERE ';
    result = hiddenQR_1.match(/("[^"]+"|[^"\s]+)/g);
    for(rr=0;rr<result.length;rr++) {
        if (rr == (result.length - 1)){
            query1 += "( direction.MatriculeDirecteur is null and direction.MatriculeSousDirecteur is null and direction.IDdirection = " + result[rr] + ") ; ";
        }else{
            query1 += " ( direction.MatriculeDirecteur is null and direction.MatriculeSousDirecteur is null and direction.IDdirection = " + result[rr] + ") or ";
        }
    }
    try {
        const conn = getConn();
        await Promise.all(
        [
            conn.query(query1,(err)=>{if(err) console.log('Failed : ', err);}),
        ]
        );
        setTimeout(() => {res.redirect('/gestionEntreprise');},400);
    } catch (error) {
        console.log('Failed : ', err);
        res.redirect(req.get('referer'));
        res.end();
        return;
    }
});
router.post('/supprimerDep',async (req, res)=>{
    const hiddenQR_2 = req.body.hiddenQR_2;
    let result = [];
    let query1 = 'DELETE FROM departement WHERE ';
    result = hiddenQR_2.match(/("[^"]+"|[^"\s]+)/g);
    for(rr=0;rr<result.length;rr++) {
        if (rr == (result.length - 1)){
            query1 += "( departement.MatriculeChefDep is null and departement.MatriculeChefEquipe is null and departement.IDdepartement = " + result[rr] + ") ; ";
        }else{
            query1 += " ( departement.MatriculeChefDep is null and departement.MatriculeChefEquipe is null and departement.IDdepartement = " + result[rr] + ") or ";
        }
    }
    try {
        const conn = getConn();
        await Promise.all(
        [
            conn.query(query1,(err)=>{if(err) console.log('Failed : ', err);}),
        ]
        );
        setTimeout(() => {res.redirect('/gestionEntreprise');},400);
    } catch (error) {
        console.log('Failed : ', err);
        res.redirect(req.get('referer'));
        res.end();
        return;
    }
});
router.post('/affectationCondidat', (req, res)=>{
    let selE = req.body.selE;
    let hiddenQR = req.body.hiddenQR;
    let NB_DEMANDEE = [];
    let query = 'UPDATE condidat SET condidat.IDequipe = \"'+selE+'\" WHERE '; 
    NB_DEMANDEE = hiddenQR.match(/("[^"]+"|[^"\s]+)/g);
    for(rr=0;rr<NB_DEMANDEE.length;rr++) {
        if (rr == (NB_DEMANDEE.length - 1)){
            query += "condidat.IDcondidat = " + NB_DEMANDEE[rr] + " ; ";
        }else{
            query += "condidat.IDcondidat = " + NB_DEMANDEE[rr] + " or ";
        }
    }    
    getConn().query(query,(err)=>{
        if(err){
            console.log('Failed : ', err);
            res.redirect(req.get('referer'));
            res.end();
            return;
        } else{
            res.redirect(req.get('referer'));
            res.end();
            return;
        }
    })
});
module.exports = router