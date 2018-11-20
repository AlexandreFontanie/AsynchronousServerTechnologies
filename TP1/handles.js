// Import Node url and query module
const url = require('url')
const qs = require('querystring')

module.exports = {
  serverHandle: function (req, res) {
    const route = url.parse(req.url)
    const path = route.pathname
    const params = qs.parse(route.query)

    res.writeHead(200, {'Content-Type': 'text/plain'});

    if (path === '/') {
      res.write('Bonjour, vous etes a la racine du site internet. \n\n' +
              'Allez sur http://localhost:8080/hello?name=alexandre pour en savoir plus sur moi \n\n' +
              'Ou ecrivez votre prenom sur http://localhost:8080/hello?name=prenom pour un message surprise')
    } else if (path === '/hello'  && 'name' in params) {
      if (params.name === 'alexandre')
        {
          res.write('Mon nom est Alexandre et je suis en 5eme annee a ECE Paris, ce TP1 correspond au cours Asynchronous Server Technologies')
        } else {
          res.write('Bonjour ' + params['name'])
        }
    } else {
      res.write('Page introuvable')
    }

    res.end();

  }
}
