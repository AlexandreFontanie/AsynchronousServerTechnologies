// Import Node url and query module
const url = require('url')
const qs = require('querystring')

module.exports = {
  serverHandle: function (req, res) {
    const route = url.parse(req.url)
    const path = route.pathname
    const params = qs.parse(route.query)

    if (path === '/') {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('Bonjour, vous etes a la racine du site internet. \n\n' +
              'Allez sur http://localhost:8080/hello?name=alexandre pour en savoir plus sur moi \n\n' +
              'Ou ecrivez votre prenom sur http://localhost:8080/hello?name=prenom pour un message surprise')
    } else if (path === '/hello'  && 'name' in params) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('Bonjour ' + params['name'])
    } else {
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.write('Page introuvable')
    }

    res.end();

  }
}
