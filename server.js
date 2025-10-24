const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const appRoutes = require('./routes/appRoutes');

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', appRoutes);

app.listen(port, () => {
    console.log(`Сервер успішно запущено на http://localhost:${port}`);
});