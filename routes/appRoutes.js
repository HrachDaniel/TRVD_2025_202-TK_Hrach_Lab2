const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data');

const readData = (fileName) => {
    const filePath = path.join(dataPath, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    if (fileContent.trim() === '') {
        return [];
    }

    return JSON.parse(fileContent);
};

router.get('/', (req, res) => {
    const books =readData('books.json');
    res.render('index.html', { books: books });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/home', (req, res) => {
    const books = readData('books.json');
    res.render('home.html', { books: books });
});

router.get('/catalog', (req, res) => {
    const books = readData('books.json');
    res.render('catalog.html', { books: books });
});

router.get('/home/catalog', (req, res) => {
    const books = readData('books.json');
    res.render('home.catalog.html', { books: books });
});

router.get('/autor', (req, res) => {
    const books = readData('books.json');
    const authorBooks = books.filter(book => book.author === 'Ніккі Сент-Кроу');
    res.render('autor', {
        authorName: 'Ніккі Сент-Кроу',
        books: authorBooks
    });
});

router.get('/preview/:id', (req, res) => {
    const bookId = parseInt(req.params.id, 10);
    const books = readData('books.json');
    const book = books.find(b => b.id === bookId); 

    if (book) {
        res.render('preview.html', { book: book });
    } else {
        res.status(404).send('Книгу не знайдено');
    }
});

router.get('/home/preview/:id', (req, res) => {
    const bookId = parseInt(req.params.id, 10); 
    const books = readData('books.json');
    const book = books.find(b => b.id === bookId); 

    if (book) {
        res.render('home.preview.html', { book: book });
    } else {
        res.status(404).send('Книгу не знайдено');
    }
});

router.get('/savage', (req, res) => {
    const savedBooks = readData('saved.json'); 
    res.render('savage', { books: savedBooks }); 
});

const writeData = (fileName, data) => {
    const filePath = path.join(dataPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

router.post('/register', (req, res) => {
    const { login, email, password, age, gender } = req.body;

    const users = readData('users.json');

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        login: login,
        email: email,
        password: password,
        age: age,
        gender: gender
    };

    users.push(newUser);

    writeData('users.json', users);

    console.log('Новий користувач зареєстрований:', newUser);

    res.redirect('/login');
});

router.post('/save-book', (req, res) => {
    const bookIdToSave = parseInt(req.body.id, 10); 

    const allBooks = readData('books.json');
    const savedBooks = readData('saved.json');

    const isAlreadySaved = savedBooks.some(book => book.id === bookIdToSave);

    if (isAlreadySaved) {
        return res.json({ success: false, message: 'Ця книга вже є у збереженому.' });
    }

    const bookToSave = allBooks.find(book => book.id === bookIdToSave);

    if (bookToSave) {
        savedBooks.push(bookToSave);
        writeData('saved.json', savedBooks); 
        res.json({ success: true, message: 'Книгу успішно додано до збереженого!' });
    } else {
        res.status(404).json({ success: false, message: 'Книгу не знайдено.' });
    }
});

router.delete('/saved/delete/:id', (req, res) => {
    const bookIdToDelete = parseInt(req.params.id, 10);
    
    const savedBooks = readData('saved.json');
    
    const updatedSavedBooks = savedBooks.filter(book => book.id !== bookIdToDelete);
    
    if (savedBooks.length === updatedSavedBooks.length) {
        return res.status(404).json({ success: false, message: 'Книгу не знайдено у збереженому.' });
    }
    
    writeData('saved.json', updatedSavedBooks);
    
    res.json({ success: true, message: 'Книгу було успішно вилучено.' });
});

module.exports = router;