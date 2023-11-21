const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const connection = require('../../config/db');

const secretKey = 'kunciRahasiaYangSama';

router.post('/register', [
    body('NIK').notEmpty().withMessage('Isi semua bidang'),
    body('nama_anggota').notEmpty().withMessage('Isi semua bidang'),
    body('tanggal_lahir').notEmpty().withMessage('Isi semua bidang'),
    body('alamat_anggota').notEmpty().withMessage('Isi semua bidang'),
    body('email_anggota').notEmpty().withMessage('Isi semua bidang'),
    body('password_anggota').notEmpty().withMessage('Isi semua bidang'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    const {NIK, nama_anggota, tanggal_lahir, alamat_anggota, email_anggota, password_anggota } = req.body;
    const checkUserQuery = 'SELECT * FROM anggota WHERE email_anggota = ?';
    connection.query(checkUserQuery, [email_anggota], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Server Error' });
        }
        if (results.length > 0) {
            return res.status(409).json({ error: 'Pengguna sudah terdaftar' })
        }
        const insertUserQuery = 'INSERT INTO anggota (NIK, nama_anggota, tanggal_lahir, alamat_anggota, email_anggota, password_anggota) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(insertUserQuery, [NIK, nama_anggota, tanggal_lahir, alamat_anggota, email_anggota, password_anggota], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Server Error' });
            }
            const payload = { userNIK: NIK, email_anggota };
            const token = jwt.sign(payload, secretKey);
            const updateTokenQuery = 'UPDATE anggota SET token = ? WHERE NIK = ?';
            connection.query(updateTokenQuery, [token, NIK], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Server Error' });
                }
                res.json({ token });
            });
        });
    });
});



router.post('/login', (req, res) => {
    const { email_anggota, password_anggota } = req.body;
    connection.query('SELECT * FROM anggota WHERE email_anggota = ?', [email_anggota], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Server Error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Gagal masuk' });
        }
        const user = results[0];
        if (user.password_anggota !== password_anggota) {
            return res.status(401).json({ error: 'Kata sandi salah' });
        }

        if (user.token) {
            const token = user.token;
            res.json({ token });
        } else {
            const payload = { userId: anggota.NIK, email_anggota };
            const token = jwt.sign(payload, secretKey);
            const updateTokenQuery = 'UPDATE anggota SET token = ? WHERE NIK = ?';

            connection.query(updateTokenQuery, [token, anggota.NIK], (err, updateResult) => {
                if (err) {
                    return res.status(500).json({ error: 'Server Error' });
                }
                res.json({ token });
            });
        }
    });
});

module.exports = router;
