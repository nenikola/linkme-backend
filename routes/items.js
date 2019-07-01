const express = require('express');
const itemsController = require('../controllers/itemsController.js');

const router = express.Router();

router.get('/', itemsController.getItems);

module.exports = router;
