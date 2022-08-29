const express = require('express');
const router = express.Router()
const mysql = require('mysql')

// test de routage vers ce fichier
router.get('/messages', (reqm, res)=>{
    console.log('show some messages or whatever');
    res.end()
})
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
            console.log('failed to Reg new student : ', err)
            res.sendStatus(500)  
            return 
        }
        console.log('Inserted new account ', results.insertId)
        res.end();
    })
    res.redirect('index.html')
    res.end();
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