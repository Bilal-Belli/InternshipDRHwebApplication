const express = require('express');
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./public'))
app.use(morgan('combined'))
// first page shown at connection to application (by default is index.html = connect.html)
app.get('/', (req,res)=>{
    console.log('responding to root route');

    // res.send('Your node is successfully setup');
})
// test de connectivité
app.listen(3000, ()=>{
    console.log('server running port is 3000');
})
// function that get connection to database mysql
function getConn(){
    return mysql.createConnection({
        host: 'localhost',
        user : 'root',
        password: '1234',
        database: 'StageBDD'
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