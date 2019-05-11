const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var profile = require('./profile');
var request = require('superagent');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

//keys
const MAILCHIMP_INSTANCE = process.env.MAILCHIMP_INSTANCE
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY

//defines route to use custom router
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/profile', profile)
app.use(express.static('views'));
app.use('/static', express.static('public'));

//Set up views directory to be ./views
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
  request
    .post('https://' + MAILCHIMP_INSTANCE + '.api.mailchimp.com/3.0/lists/' + MAILCHIMP_LIST_ID + '/members/')
      .set('Content-Type', 'application/json;charset=utf-8')
      .set('Authorization', 'Basic ' + new Buffer('any:' + MAILCHIMP_API_KEY ).toString('base64'))
      .send({
        'email_address': req.body.email,
        'status': 'subscribed',
        'merge_fields': {
          'FNAME': req.body.firstName,
          'LNAME': req.body.lastName
        }
      })
          .end(function(err, response) {
            const contactData = {
              contact: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
              }
            }
            console.log(`responsestatus is ${response.status}`);
            if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
              res.render('thanks', contactData);
            } else {
              res.send('Uh-oh...Please try again :(');
            }
        });  
});


app.listen(process.env.PORT || 8080, () => {
  console.log(`listening at http://localhost:${port}`)
});

module.exports = app;
