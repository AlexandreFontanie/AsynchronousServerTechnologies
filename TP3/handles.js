// Import Node url and query module
const url = require('url')
const qs = require('querystring')

app.set('views', __dirname + "/views")
app.set('view engine', 'ejs');

app.get(
  '/hello/:name',
  (req, res) => res.render('hello.ejs', {name: req.params.name})
)
