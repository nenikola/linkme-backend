const request = require('request');

exports.getItems = (req, res) => {
  request('https://linkme-project-mrac.firebaseio.com/items.json', null, (error, response) => {
    if (error) {
      return res.status(404).send();
    }
    const Djak = processData(response);
    res.send(Djak);
  });
};

function processData(response) {
  let data = response.body;
  let skripta = data.slice(data.lastIndexOf('<script'), data.length);
  let kod = skripta.slice(skripta.indexOf('>') + 1, skripta.lastIndexOf('</'));
  var Djak = { state: {} };
  eval(kod);
  return Djak;
}
