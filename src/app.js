const path = require('path');
const hbs = require('hbs');
const express = require('express');
const geoCode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = 3000;

// Define paths for express config
const publicDir = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDir));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Jeremy N.'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Jeremy N.'
    });
});

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help',
        name: "Jeremy N.",
        helpMessage: "Welcome to the help page! If you're looking for information, it's not here!"
    });
});

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: "Please provide an address for your search"
        });
    }
    geoCode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error });
        }
        forecast(longitude, latitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            });
        });
    });
});

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: "You must provide a search term"
        });
    }
    console.log(req.query.search);
    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        error: 'Help Article Not Found'
    });
});

app.get("*", (req, res) => {
    res.render('404', {
        error: "Page Not Found"
    });
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});