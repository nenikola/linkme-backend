const request = require('request');

exports.getItems = (req, res) => {
  request('https://linkme-project-mrac.firebaseio.com/items.json', null, (error, response) => {
    if (error) {
      return res.status(404).send();
    }
    const results = [];
    const resultPromises = [];
    const data = JSON.parse(response.body);
    data.forEach(element => {
      resultPromises.push(
        new Promise((resolve, reject) => {
          request(element.itemUrl, null, (error, response) => {
            if (error) {
              reject();
            }
            resolve({ itemUrl: element.itemUrl, response: response });
          });
        })
      );
    });
    Promise.all(resultPromises).then(responses => {
      responses.forEach(element => {
        results.push(processData(element.itemUrl, element.response));
      });
      res.header('Access-Control-Allow-Origin', '*');
      res.send(results);
    });
  });
};

function processData(url, response) {
  if (url.indexOf('djak') != -1) {
    return processDJAK(response);
  } else if (url.indexOf('sportvision') != -1) {
    return processSVISION(response);
  }
}

function processDJAK(response) {
  let data = response.body;
  let skripta = data.slice(data.lastIndexOf('<script'), data.length);
  let kod = skripta.slice(skripta.indexOf('>') + 1, skripta.lastIndexOf('</'));
  var Djak = { state: {} };
  eval(kod);
  return {
    name: Djak.state.product.name,
    price: Djak.state.product.price,
    imageUrl: 'https://www.djaksport.com/' + Djak.state.product.image.split('&')[0]
  };
}
function processSVISION(response) {
  let data = response.body;
  let index1 = data.indexOf('json') + 6;
  let index2 = data.indexOf(`</script>`, index1);
  let skripta = data.slice(index1, index2);
  var obj;
  skripta = 'obj=' + skripta;
  eval(skripta);
  return { name: obj.name, price: obj.offers.price + ' din.', imageUrl: obj.image };
}
