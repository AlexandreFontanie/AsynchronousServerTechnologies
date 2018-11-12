# Asynchronous Server Technologies TP1
## Alexandre Fontanié

## Introduction
Ce git contient le TP1 du cours Asynchronous Server Technologies, qui a pour but de nous familiariser avec les routes et queries.


## Instructions

### Pour lancer le serveur du TP1 :  
Ouvrir la console dans le dossier du TP1 et utiliser la commande:
```
node index.js
```

### Les 3 routes de l'applications sont :  
- [localhost:8080/](http://localhost:8080/)
- [localhost:8080/hello?name=alexandre](http://localhost:8080/hello?name=alexandre)
- [localhost:8080/hello?name=prenom](http://localhost:8080/hello?name=prenom)

### Page home  
La page http://localhost:8080/ racine décrit le fonctionnement du serveur.

### Page Hello alexandre
La page http://localhost:8080/hello?name=alexandre affiche une breve présentation de moi-même.

### Page Hello
La page http://localhost:8080/hello?name=prenom salut l'utilisateur par son prenom.

### Autre page
Toute autre page affiche une erreur 404 et un message "Page introuvable".
