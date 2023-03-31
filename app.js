const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/todoDB');

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You didn't add a todo?"],
  }
})

let Todo = new mongoose.model('Todo', todoSchema)

let testTodo = new Todo({
  name: "A supposed test todo",
})
let testTodo2 = new Todo({
  name: "A supposed test todo, the second",
})
let testTodo3 = new Todo({
  name: "A supposed test todo, third one",
})

// Todo.insertMany([testTodo, testTodo2, testTodo3]).then(() => {
//   console.log('Your test todos have been added')

//   mongoose.connection.close();
// })

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: 'true'}))
app.use(express.static('public'));

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})

//// let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let options = {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}


app.get('/', async (req, res) => {
  let today = new Date();
  today = today.toLocaleDateString('en-US', options)
  let lilac = await Todo.find({});
  // lilac = lilac.map(todo => todo.name);

  let templatingOptions = {
    dayOfTheWeek: today,
    todos: lilac,
  }
  
  res.render('list', templatingOptions);
})

app.post('/', (req, res) => {
  let newTask = req.body.new;
  let teaser = new Todo({
    name: newTask,
  })
  teaser.save().then(() => {
    console.log("A new todo has been saved successfully")
  }).catch((err) => {
    console.log(err, "There was an error in adding a todo")
  })

  res.redirect('/');
}) 

app.post('/delete', (req, res) => {
  let todoToBeRemoved = req.body.todoChecked;
  Todo.findByIdAndRemove(todoToBeRemoved).then(response => {
    console.log(response);
    res.redirect('/');
  }).catch(err => {
    console.log(err, "Was unable to delete the todo");
  })
});