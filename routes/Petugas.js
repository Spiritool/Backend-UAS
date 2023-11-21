const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');
const connection = require('../config/db');

router.get('/', function (req, res) {
    connection.query('select * from petugas', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data Petugas',
                data: rows
            })
        }
    });
});

router.post('/store', [
    body('nama_petugas').notEmpty(),
    body('alamat_petugas').notEmpty(),
    body('tanggal_lahir').notEmpty(),
    body('email').notEmpty(),
    body('password').notEmpty(),
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        nama_petugas: req.body.nama_petugas,
        alamat_petugas: req.body.alamat_petugas,
        tanggal_lahir: req.body.tanggal_lahir,
        email: req.body.email,
        password: req.body.password,
    }
    connection.query('insert into petugas set ?', Data, function(err, rows) {
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
    connection.query(`select * from petugas where id_petugas = ${id}`, function (err, rows) {
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
                message: 'Data Petugas',
                data: rows[0]
            })
        }
    })
})

router.patch('/update/:id', [
    body('nama_petugas').notEmpty(),
    body('alamat_petugas').notEmpty(),
    body('tanggal_lahir').notEmpty(),
    body('email').notEmpty(),
    body('password').notEmpty(),
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        nama_petugas: req.body.nama_petugas,
        alamat_petugas: req.body.alamat_petugas,
        tanggal_lahir: req.body.tanggal_lahir,
        email: req.body.email,
        password: req.body.password,
    }
    connection.query(`update petugas set ? where id_petugas = ${id}`, Data, function (err, rows) {
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

router.delete('/delete/(:id)', function(req, res){
    let id = req.params.id;
    connection.query(`delete from petugas where id_petugas = ${id}`, function (err, rows) {
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

module.exports = router;
