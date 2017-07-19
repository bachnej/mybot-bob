
var request = require('request');

function getCapital(country,session){
  console.log('here');
  request('https://restcountries.eu/rest/v2/alpha/'+country, function (error, response, body, session) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body);
      capital = obj.capital;
      console.log(capital);
      session.send(capital)
    }
  });
}
// export the module
module.exports = {
    getCapital: getCapital
};
