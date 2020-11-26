const { urlencoded } = require('express');
const express = require('express');
const app = express();
const mysql = require('mysql');

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'progate'
});

// root url
app.get('/', (req, res) => {
    res.render('top.ejs');
});

// display list item
app.get('/index', (req, res) => {
    connection.query(
        'SELECT * FROM items',
        (error, results) => {
            res.render('index.ejs', {items: results});
        }
    );
});

// form add item
app.get('/new', (req, res) => {
    res.render('new.ejs');
});

// method create item
app.post('/create', (req, res) => {
    connection.query(
        'INSERT INTO items (name) VALUES (?)',
        [req.body.itemName],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

app.post('/delete/:id', (req, res) => {
    connection.query(
        'DELETE FROM items WHERE id = ?',
        [req.params.id],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

app.get('/edit/:id', (req, res) => {
    connection.query(
        'SELECT * FROM items WHERE id = ?',
        [req.params.id],
        (error, results) => {
            res.render('edit.ejs', {item: results[0]});
        }
    );
});

app.post('/update/:id', (req, res) => {
    connection.query(
        'UPDATE items SET name = ? WHERE id = ?',
        [req.body.itemName, req.params.id],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

app.listen(3000);