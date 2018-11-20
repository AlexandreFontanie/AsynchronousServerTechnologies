express = require('express')
app = express()

app.set('port', 8080)

const root =
        "Bonjour, vous etes a la racine du site internet. \n\n" +
        "Allez sur http://localhost:8080/hello/alexandre pour en savoir plus sur moi \n\n" +
        "Ou ecrivez votre prenom sur http://localhost:8080/hello/prenom pour un message surprise";
const infoPerso =
  "Mon nom est Alexandre et je suis en 5eme annee a ECE Paris, ce TP2 correspond au cours Asynchronous Server Technologies";


app.get(
  '/',
  (req, res) => res.send(root)
)

app.get(
  '/hello/:name', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    if (req.params.name === 'alexandre'){
      res.send(infoPerso)
    } else {
      res.send("Bonjour " + req.params.name)
    }
  }
)

app.use(function(req, res){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send("Erreur 404: Page introuvable");
   });

app.listen(
    app.get('port'), () => console.log(`server listening on ${app.get('port')}`)
)
