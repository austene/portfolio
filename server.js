const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('dev'))
app.use(bodyParser.json())
app.subscribe(bodyParser.urlencoded({ extended: true }))

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

app.listen(8080, () => {
  console.log('listening at http://localhost:8080')
});