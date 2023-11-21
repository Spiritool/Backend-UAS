const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');
const connection = require('../config/db');

const authenticateToken = require('../routes/auth/middleware/authenticateToken')

router.get('/', authenticateToken, function (req, res) {
    connection.query('select * from penerbit', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data Penerbit',
                data: rows
            })
        }
    });
});

router.post('/store', authenticateToken, [
    body('nama_penerbit').notEmpty(),
    body('alamat_penerbit').notEmpty(),
    body('email_penerbit').notEmpty(),
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        nama_penerbit: req.body.nama_penerbit,
        alamat_penerbit: req.body.alamat_penerbit,
        email_penerbit: req.body.email_penerbit,
    }
    connection.query('insert into penerbit set ?', Data, function(err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error'
            })
        }else{
            return res.status(201).json({
                status: true,
                message: 'Success..!',
                data: rows[0]
            })
        }
    })
})

router.get('/(:id)', function (req, res) {
    let id = req.params.id;
    connection.query(`select * from penerbit where id_penerbit = ${id}`, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }
        if(rows.lenght <=0){
            return res.status(404).json({
                status: false,
                message: 'Not Found',
            })
        }
        else{
            return res.status(200).json({
                status: true,
                message: 'Data Mahasiswa',
                data: rows[0]
            })
        }
    })
})

router.patch('/update/:id', authenticateToken, [
    body('nama_penerbit').notEmpty(),
    body('alamat_penerbit').notEmpty(),
    body('email_penerbit').notEmpty(),
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        nama_penerbit: req.body.nama_penerbit,
        alamat_penerbit: req.body.alamat_penerbit,
        email_penerbit: req.body.email_penerbit,
    }
    connection.query(`update penerbit set ? where id_penerbit = ${id}`, Data, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Update Success..!',
            })
        }
    })
})  

router.delete('/delete/(:id)', authenticateToken, function(req, res){
    let id = req.params.id;
    connection.query(`delete from penerbit where id_penerbit = ${id}`, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }else{
            return res.status(200).json({
                status: true,
                message: 'Data has been delete !',
            })
        }
    })
})

module.exports = router; // Corrected export statement
