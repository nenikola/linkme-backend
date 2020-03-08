const request = require(`request`);

exports.getItems = (req, res) => {
  request(
    `https://linkme-project-mrac.firebaseio.com/items.json`,
    null,
    (error, response) => {
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
              resolve({ itemUrl: element.itemUrl, response });
            });
          })
        );
      });
      Promise.all(resultPromises).then(responses => {
        responses.forEach((element, i) => {
          const res = processData(element.itemUrl, element.response);
          res.id = i;
          results.push(res);
        });
        res.header(`Access-Control-Allow-Origin`, `*`);
        res.send(results);
      });
    }
  );
};

function processData(url, response) {
  if (url.indexOf(`djak`) != -1) {
    const res = processDJAK(response);
    res.linkUrl = url;
    return res;
  }
  if (url.indexOf(`sportvision`) != -1) {
    const res = processSVISION(response);
    res.linkUrl = url;
    return res;
  }
}

function processDJAK(response) {
  const data = response.body;
  const skripta = data.slice(data.lastIndexOf(`<script`), data.length);
  const kod = skripta.slice(
    skripta.indexOf(`>`) + 1,
    skripta.lastIndexOf(`</`)
  );
  const Djak = { state: {} };
  eval(kod);
  return {
    name: Djak.state.product.name,
    price: Djak.state.product.price,
    imageUrl: `https://www.djaksport.com/${
      Djak.state.product.image.split(`&`)[0]
    }`
  };
}
function processSVISION(response) {
  const data = response.body;
  const index1 = data.indexOf(`json`) + 6;
  const index2 = data.indexOf(`</script>`, index1);
  let skripta = data.slice(index1, index2);
  let obj;
  skripta = `obj=${skripta}`;
  eval(skripta);
  return {
    name: obj.name,
    price: `${obj.offers.price} din.`,
    imageUrl: obj.image
  };
}
