var expresss = require('express')
var router =express.Router()

//middleware specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

//define the home page route
router.get('/', function (req, res) {
  res.send('Hello world')
})

//define the about page route
router.get('/about', function (req, res) {
  res.send('About me')
})

module.exports = router