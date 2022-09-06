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
    
});
router.post('/ajouterSousDir', (req, res)=>{
    
});
router.post('/ajouterDep', (req, res)=>{
    
});
router.post('/ajouterEquipe', (req, res)=>{
    
});

router.post('/supprimerDir', (req, res)=>{
    
});
router.post('/supprimerSousDir', (req, res)=>{
    
});
router.post('/supprimerDep', (req, res)=>{
    
});
router.post('/supprimerEquipe', (req, res)=>{
    
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