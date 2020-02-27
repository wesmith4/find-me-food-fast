// Load express module
const express = require('express');

// Create express server
const app = express();

// Define port
const port = 3000;

// Serve static files (needed to import CSS file)
app.use(express.static('public'));

// Load handlebars module
const handlebars = require('express-handlebars');

// Set our app to use handlebars engine
app.set('view engine', 'hbs');

// Set handlebars configurations
app.engine('hbs', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'planB'
}));

app.use(express.static('public'));

let fakeYelpAPI = () => {
  return [
    {
      restaurant: 'Fish and Farm',
      city: 'San Francisco',
    },
    {
      restaurant: 'Demitri\'s BBQ',
      city: 'Homewood',
    },
    {
      restaurant: 'International Smoke',
      city: 'San Francisco',
    },
    {
      restaurant: 'Price\'s Chicken Coop',
      city: 'Charlotte',
    },
  ]
};

app.get('/', (req, res) => {
  // Serves the body of the page to the container
  res.render('main', {layout: 'index', yelp: fakeYelpAPI(), listExists: true});
});


// Make the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));
