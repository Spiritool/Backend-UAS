const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');
const multer = require('multer')
const path = require('path')
const connection = require('../config/db');
const fs = require('fs')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(new Error('Jenis file tidak diizinkan'), false);
    }
}

const upload = multer({storage: storage, fileFilter: fileFilter})

router.get('/', function (req, res) {
    connection.query(`select a.judul, a.harga, a.genre, b.nama_penerbit, c.nama_penulis, d.nama_penyunting, a.cover from buku a 
    join penerbit b on b.id_penerbit = a.id_penerbit
    join penulis c on c.id_penulis = a.id_penulis
    join penyunting d on d.id_penyunting = a.id_penyunting`, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
                error:err
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data Mahasiswa',
                data: rows
            })
        }
    });
});

router.post('/store', upload.fields([{ name: 'cover', maxCount: 1}]) , [
    body('judul').notEmpty(),
    body('harga').notEmpty(),
    body('genre').notEmpty(),
    body('id_penerbit').notEmpty(),
    body('id_penulis').notEmpty(),
    body('id_penyunting').notEmpty(),
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        judul: req.body.judul,
        harga: req.body.harga,
        genre: req.body.genre,
        id_penerbit: req.body.id_penerbit,
        id_penulis: req.body.id_penulis,
        id_penyunting: req.body.id_penyunting,
        cover: req.files.cover[0].filename,
    }
    connection.query('insert into buku set ?', Data, function(err, rows) {
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
    connection.query(`select * from buku where id_buku = ${id}`, function (err, rows) {
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
                message: 'Data Buku',
                data: rows[0]
            })
        }
    })
})

router.patch('/update/:id', upload.fields([{ name: 'cover', maxCount: 1 }]) ,[
    body('judul').notEmpty(),
    body('harga').notEmpty(),
    body('genre').notEmpty(),
    body('id_penerbit').notEmpty(),
    body('id_penulis').notEmpty(),
    body('id_penyunting').notEmpty(),
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let cover = req.files['cover'] ? req.files['cover'][0].filename : null;

    connection.query(`select * from buku where id_buku = ${id}`, function (err, rows) {
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
        const gambarLama = rows[0].cover;

        if(gambarLama && cover) {
            const pathFileLama = path.join(__dirname, '../public/images', gambarLama);
            fs.unlinkSync(pathFileLama)
        }
  
    let Data = {
        judul: req.body.judul,
        harga: req.body.harga,
        genre: req.body.genre,
        id_penerbit: req.body.id_penerbit,
        id_penulis: req.body.id_penulis,
        id_penyunting: req.body.id_penyunting,
    }   

    if (cover) {
        Data.cover = cover;
    }

    connection.query(`update buku set ? where id_buku = ${id}`, Data, function (err, rows) {
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
})

router.delete('/delete/(:id)',  function(req, res){
    let id = req.params.id;

    connection.query(`select * from buku where id_buku = ${id}`, function (err, rows) {
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
        const gambarLama = rows[0].cover;

        if(gambarLama) {
            const pathFileLama = path.join(__dirname, '../public/images', gambarLama);
            fs.unlinkSync(pathFileLama)
        }

    connection.query(`delete from buku where id_buku = ${id}`, function (err, rows) {
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
})

module.exports = router; 
