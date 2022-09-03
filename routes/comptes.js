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
    const MotPasse1 = req.body.MotPasse1;
    // console.log(nom + ' ' + prenom + ' '+ email + ' '+ MotPasse1)
    const sql = 'INSERT INTO compte VALUES ?'
    const values = [[null, nom, prenom, email, MotPasse1] ];
    getConn().query(sql, [values], (err, results, fields)=>{
        if(err){
            console.log('failed to Reg new account : ', err)
            res.sendStatus(500)  
            return 
        }
        console.log('Inserted new account ', results.insertId)
        res.end();
    })
    res.redirect('index.html')
    res.end();
})
router.post('/compteCon', (req, res)=>{
    console.log('CONNECTION OF AN ACCOUNT');
    const email = req.body.email;
    const MotPasse = req.body.MotPasse;
    // console.log(email + ' '+ MotPasse)
    const sql = 'select * from compte where (compte.email = \"'+email+'\" and \"'+MotPasse+'\"=compte.MotPasse1)'
    getConn().query(sql,(err, results)=>{
        if(err){
            console.log('failed Connect to account : ', err)
            res.sendStatus(500)  
            return
        }
        if(results[0] == null){
            console.log("Your Email or Password is wrong");
            res.redirect('index.html')
            res.end();
        }else{
            // console.log(results[0]);
            res.redirect('next.html')
            res.end();
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
        database: 'StageBDD'
    });
}
module.exports = router