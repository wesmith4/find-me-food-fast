let request = require('request-promise-native');

function searchUrl(term) {
  return `https://api.yelp.com/v3/businesses/search?term=${term}&location=San+Francisco&Authorization=Bearer xQzTLHIZzBMkpFk6iJ3PjeJklnjaimUmDR--pCBkMQ3zwMp0cV4cVS_b8VdZUtlwzOOngpEx7k_QHR_YgTIB5dlOoNMYk4WLgUkKp8ilgWRZHY54jkUxj37uo0BYXnYx`;
}

let searchTerms = ['Ramen'] //, 'Pizza', 'Indian'];

let requests = [];
let results = [];

for (let term of searchTerms) {
  let options = {
    'method': 'GET',
    'url': searchUrl(term),
    'headers': {
      'Authorization': 'Bearer xQzTLHIZzBMkpFk6iJ3PjeJklnjaimUmDR--pCBkMQ3zwMp0cV4cVS_b8VdZUtlwzOOngpEx7k_QHR_YgTIB5dlOoNMYk4WLgUkKp8ilgWRZHY54jkUxj37uo0BYXnYx'
    },
    'json': true,
  };

  requests.push(request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  }));
}
