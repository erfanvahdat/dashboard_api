


import express from 'express';
import things from './router.mjs';

const app = express();

app.set('view engine', 'pug');
app.set('views','./views');


app.get('/', (req, res) => {
  res.render('first_view')
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




export default app;