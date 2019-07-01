const request = require('request');

exports.getItems = (req, res) => {
  request('https://linkme-project-mrac.firebaseio.com/items.json', null, (error, response) => {
    if (error) {
      return res.status(404).send();
    }
    res.send(response.body);
  });
};
