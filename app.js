const express = require('express');
const itemsRouter = require('./routes/items.js');

const app = express();
app.use('/items', itemsRouter);

app.listen(3000, () => {
  console.log('Server is running...');
});
