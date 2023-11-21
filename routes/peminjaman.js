const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');
const connection = require('../config/db');

router.get('/', function (req, res) {
    connection.query(`select b.nama_anggota, c.judul, d.nama_petugas a.tanggal_peminjaman, a.tanggal_pengembalian, a.biaya from peminjaman a
        join anggota b on b.nik=a.nik
        join buku c on c.id_buku=a.id_buku
        join petugas d on d.id_petugas=a.id_petugas`, function(err, rows){
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

router.post('/store', [
    body('nik').notEmpty(),
    body('id_buku').notEmpty(),
    body('id_petugas').notEmpty(),
    body('tanggal_peminjaman').notEmpty(),
    body('tanggal_pengembalian').notEmpty(),
    body('biaya').notEmpty(),
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        nik: req.body.nik,
        id_buku: req.body.id_buku,
        id_petugas: req.body.id_petugas,
        tanggal_peminjaman: req.body.tanggal_peminjaman,
        tanggal_pengembalian: req.body.tanggal_pengembalian,
        biaya: req.body.biaya,
    }
    connection.query('insert into peminjaman set ?', Data, function(err, rows) {
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
    connection.query(`select b.nama_anggota, c.judul, d.nama_petugas a.tanggal_peminjaman, a.tanggal_pengembalian, a.biaya from peminjaman a
    join anggota b on b.nik=a.nik
    join buku c on c.id_buku=a.id_buku
    join petugas d on d.id_petugas=a.id_petugas where id_peminjaman = ${id}`, function (err, rows) {
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

router.patch('/update/:id', [
    body('nik').notEmpty(),
    body('id_buku').notEmpty(),
    body('id_petugas').notEmpty(),
    body('tanggal_peminjaman').notEmpty(),
    body('tanggal_pengembalian').notEmpty(),
    body('biaya').notEmpty(),
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        nik: req.body.nik,
        id_buku: req.body.id_buku,
        id_petugas: req.body.id_petugas,
        tanggal_peminjaman: req.body.tanggal_peminjaman,
        tanggal_pengembalian: req.body.tanggal_pengembalian,
        biaya: req.body.biaya,
    }
    connection.query(`update peminjaman set ? where id_peminjaman = ${id}`, Data, function (err, rows) {
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
    connection.query(`delete from peminjaman where id_peminjaman = ${id}`, function (err, rows) {
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
