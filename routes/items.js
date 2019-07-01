const express = require('express');
const itemsController = require('../controllers/itemsController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.get('/', authController.isValid, itemsController.getItems);

module.exports = router;
