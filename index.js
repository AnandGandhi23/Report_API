const express = require('express');
require("./config/db.config");
const cors = require('cors');
const routes = require('./routes/index.route');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
  
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(routes);

const PORT = 3000;

app.get('/',(req, res) => res.send('Hello World'));

app.listen(process.env.PORT || PORT, function() {
    console.log("server started on " + PORT);
});