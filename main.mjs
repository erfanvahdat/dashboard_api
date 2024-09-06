import express from 'express';
import things from './router.mjs';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.set('view engine', 'pug');
app.set('views', './views');

// Sample data
let data = [
  { id: 12, name: 'erfan', age: 26 },
  { id: 13, name: 'alibi', age: 27 },
  { id: 14, name: 'myon', age: 31 }
];

// Home route to render the view
app.get('/', (req, res) => {
  res.render('first_view');
});

// Get user by ID
app.get('/get/:id', (req, res) => {
  const id = req.params.id;
  const parseid = parseInt(id); // convert id to an integer
  if (isNaN(parseid)) return res.sendStatus(400); // check if id is valid

  const user = data.find(user => user.id === parseid);
  if (!user) return res.sendStatus(404); // return 404 if user not found

  return res.json(user); // send user data as response
});


// Get all data
app.get('/get_all_data', (req, res) => {
  return res.json({ data }); // send the data array as a response
});

// POST request to add a user (ensure the route is correctly defined)
app.post('/api/users', (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({ message: 'Name and age are required' });
  }

  // Create a new user object
  const newUser = {
    id: data.length + 1, // Assign a new ID
    name,
    age
  };  

  data.push(newUser); // Add the new user to the data array
  return res.status(201).json(newUser); // Return the newly created user
});

app.patch("/update_user/:id", (req, res) => {
  // Destructure body and params from req
  const { body, params: { id } } = req;

  // Parse the id to an integer
  const parseid = parseInt(id);
  if (isNaN(parseid)) return res.sendStatus(400); // Return 400 if id is invalid

  // Find the index of the user by id
  const userIndex = data.findIndex(user => user.id === parseid);
  if (userIndex === -1) return res.sendStatus(404); // Return 404 if user not found

  // Update the user data with the new data from the request body
  data[userIndex] = { ...data[userIndex], ...body };

  // Return 200 OK after successful update
  return res.sendStatus(200);
});


// Catch-all route to handle invalid URLs
app.get('*', (req, res) => {
  res.status(404).json({
    message: 'Sorry, this is an invalid URL.'
  });
});

export default app;