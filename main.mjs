


import express from 'express';
import things from './router.mjs';

const app = express();

app.get('/', (req, res) => {
  res.send('main page');
});



  
app.get('/api/data/', (req, res) => {
  
  res.json({"name":'erfan'})
  // res.send("fetch compeleted");

});



app.get('/:id([0-9]{5})/:username', (req, res) => {
  res.send(`username of ${req.params.username} with id of ${req.params.id} is connected to the page`);
});
  
app.use('/things', things);

app.get('*', (req, res) => {
  res.status(404).json({
    message: 'Sorry, this is an invalid URL.'
  });
});






app.listen(3001, () => {
  console.log('Server is running on port 3001');
});