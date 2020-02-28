// Load express module
const express = require('express');
const fs = require('fs');

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
  let list = [
    {
      name: 'Fish and Farm',
      city: 'San Francisco',
      cuisine: 'Seafood',
      neighborhood: 'Chinatown',
      price: '$$$',
      ritual: 'Yes',
    },
    {
      name: 'Irving Subs',
      city: 'San Francisco',
      price: '$',
      cuisine: 'Sandwiches',
      ritual: 'Yes',
      neighborhood: 'Chinatown',
    },
    {
      name: 'International Smoke',
      city: 'San Francisco',
    },
    {
      name: 'Price\'s Chicken Coop',
      city: 'Charlotte',
    },
  ];
  return list;
};


app.get('/search', (req, res) => {
  // Serves the body of the page to the container
  // filters.push(req.query);
  let filters = req.query.filters;
  let selectedFilters = [];

  if (typeof filters === 'object') {
    selectedFilters = Object.keys(filters).filter(key => filters[key] === 'on');
  }

  console.log(selectedFilters);

  let format = {
    layout: 'index',
    selectedFilters: selectedFilters,
  };

  for (let filter of selectedFilters) {
    format[filter] = true;
  }
  console.log(format);

  res.render('main', format);
});

app.get('/results', (req, res) => {
  let preferences = req.query;
  console.log(preferences);
  console.log(preferences.hasOwnProperty('neighborhood'));

  let results = fakeYelpAPI().filter(restaurant => {
    let checksOut = true;
    for (let preference in preferences) {
      if (preferences.hasOwnProperty(preference)) {
        if (restaurant[preference] !== preferences[preference]) {
          checksOut = false;
        }
      }
    }
    return checksOut;
  })

  let format = {
    layout: 'index',
    preferences: preferences,
    results: results,

  }

  for (let item in preferences) {
    if (preferences.hasOwnProperty(item)) {
      format[item] = preferences[item];
    }
  }
  console.log(format);

  res.render('resultPage', format);
});





// Make the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));
