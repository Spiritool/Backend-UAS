const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

app.use(cors())

const path = require("path")
app.use("/static", express.static(path.join(__dirname, 'public/images')))

// app.get('/', (req, res) => {
//     res.send('Halo decks')
// })

const bodyPs = require('body-parser');
app.use(bodyPs.urlencoded({ extended: false}));
app.use(bodyPs.json());

const penrbRouter = require('./routes/penerbit.js');
app.use('/api/penerbit', penrbRouter);

const penlsRouter = require('./routes/penulis.js');
app.use('/api/penulis', penlsRouter);

const penyuntingRouter = require('./routes/penyunting.js');
app.use('/api/penyunting', penyuntingRouter);

const petugasRouter = require('./routes/Petugas.js');
app.use('/api/petugas', petugasRouter);

const bukuRouter = require('./routes/buku.js');
app.use('/api/buku', bukuRouter);

const auth = require('./routes/auth/auth');
app.use('/api/auth', auth);

app.listen(port, () => {
    console.log(`aplikasi berjalan di http:://localhost:${port}`)
}) 