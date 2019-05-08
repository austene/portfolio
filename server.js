const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var profile = require('./profile');

const app = express();
const port = process.env.PORT || 8080;

//defines route to use custom router

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/profile', profile)

//Set up views directory to be ./viewsss
app.set('views', './views');
//Set default engine to ejs.  Require not needed since express will do it.
app.set('view engine', 'ejs');

//res.render instead of res.send to send the out of the template by filename.
app.get('/', (req, res) => {
  const data = {
    person: {
      firstName: 'Austen',
      lastName: 'Eames',
    }
  }
  res.render('index', data);
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/thanks', (req, res) => {
  res.render('thanks', { contact: req.body })
});

app.listen(8080, () => {
  console.log(`listening at http://localhost:${port}`)
});