// HEROKU STUFF
const http = require('http');
const port = process.env.PORT || 3000;

/* const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Hello World</h1>');
}); */




// Load express module
const express = require('express');
const fs = require('fs');

// Create express server
const app = express();

// Define port
// const port = 3000;

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


// Reference Dictionary for Zip Codes / Neighborhoods
let zipRef = {
  "Hayes Valley": "94102",
  "Tenderloin": "94102",
  "North of Market": "94102",
  "SoMa": "94103",
  "Financial District": "94104",
  "Embarcadero South": "94105",
  "Portrero Hill": "94107",
  "Chinatown": "94108",
  "Nob Hill": "94109",
  "Mission District": "94110",
  "Embarcadero North": "94111",
  "Ingelside-Excelsior/Crocker-Amazon": "94112",
  "Castro/Noe Valley": "94114",
  "Western Addition/Japantown/Pacific Heights": "94115",
  "Outer Sunset": "94116",
  "Haight-Ashbury": "94117",
  "Inner Richmond": "94118",
  "Outer Richmond": "94121",
  "Sunset": "94122",
  "Marina": "94123",
  "Bayview-Hunters Point": "94124",
  "St. Francis Wood/Miraloma/West Portal": "94127",
  "Presidio": "94129",
  "Twin Peaks-Glen Park": "94131",
  "Lake Merced": "94132",
  "North Beach": "94133",
  "Walnut Creek": "94595",
  "Oakland": "94601"
}

// Function to check restaurants with Yelp data format with input preferences
let filterCheck = (restaurant, preferences) => {
  let checksOut = true;
  if (preferences.hasOwnProperty('neighborhood')) {
    if (restaurant.location.zip_code !== zipRef[preferences.neighborhood]) {
      checksOut = false;
    }
  }
  if (preferences.hasOwnProperty('price')) {
    if (restaurant.price !== preferences.price) {
      checksOut = false;
    }
  }
  if (preferences.hasOwnProperty('cuisine')) {
    let restaurantCategories = [];
    for (let category of restaurant.categories) {
      restaurantCategories.push(category.title);
    }
    if (!restaurantCategories.includes(preferences.cuisine)) {
      checksOut = false;
    }
  }
  return checksOut;
}

let getYelpData = (jsonFile) => {
  let text = fs.readFileSync(jsonFile, 'utf-8');
  let yelpRestaurants = JSON.parse(text);
  console.log(Object.keys(yelpRestaurants));
  return yelpRestaurants.businesses;
}


app.get('/', (req, res) => {
  res.render('home', {layout: 'index'});
})

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

  let yelpRestaurants = getYelpData('database.json');


  let results = yelpRestaurants.filter(restaurant => filterCheck(restaurant, preferences));

  for (let restaurant of results) {
    let cuisines = [];
    for (let category of restaurant.categories) {
      cuisines.push(category.title);
    }
    restaurant.cuisines = cuisines.join(', ');
  }
  results = results.sort((a,b) => b.rating - a.rating);


  /* let results = fakeYelpAPI().filter(restaurant => {
    let checksOut = true;
    for (let preference in preferences) {
      if (preferences.hasOwnProperty(preference)) {
        if (restaurant[preference] !== preferences[preference]) {
          checksOut = false;
        }
      }
    }
    return checksOut;
  }) */

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

  res.render('resultPage', format);
});





// Make the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));
