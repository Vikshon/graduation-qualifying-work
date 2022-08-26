const express = require('express');
const { GetData } = require('./modules/Connection-DB.js');
const { Registrate } = require('./modules/Register.js');
const { ProductsOffer } = require('./modules/Product-Offer.js');

ProductsOffer()

const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
app.use(express.static(__dirname + '/source'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/source/views');
app.set('view engine', 'pug');

app.get('/', async (req, res) => {
    res.render('pug/main', { title: 'Document', data: '' });
});

app.get('/workspace', async (req, res) => {
    // ! Любой может зайти на страницу предназначенную для ролей, если укажет параметр
    // res.render('pug/workspace', { title: 'Document', data: '' });
    let role = Object.keys(req.query)[0];
    switch (role) {
        case '1':
            res.render('pug/workspace-waiter', { title: 'Document', data: '' });
            break;
        case '2':
            res.render('pug/workspace-cook', { title: 'Document', data: '' });
            break;
        case '3':
            res.render('pug/workspace-manager', { title: 'Document', data: '' });
            break;
        // ! Изменить. Убрать пункт default. Добавить редирект на ссылку no-access
        default:
            res.render('pug/no-access', { title: 'Document', data: '' });
            break;
    }
});

app.get('/order-registration', async (req, res) => {
    res.render('order-registration/order', { title: 'Document', data: '' });
});

app.post('/fetch-db', async (req, res) => {
    const data = await GetData(req.body.q);
    res.json(data);
});

// TODO
app.post('/register-account', async (req, res) => {
    await Registrate(req.body);
    res.send('done');
    res.render('pug/main', { title: 'Document', data: '' });
});

app.post('/products-offer', async (req, res) => {
    await ProductsOffer(list);
})

// TODO
app.all('*', async (req, res) => {
    res.send('Error 404');
});

app.listen(port, () => console.log(`Example app listening at http://localhost:3000`));