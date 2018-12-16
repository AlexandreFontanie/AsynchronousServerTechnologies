import express = require("express");
import { MetricsHandler, Metric } from "./metrics";
import session = require('express-session');
import levelSession = require('level-session-store');
import bodyparser = require("body-parser");
import morgan = require("morgan");
import { UserHandler, User } from './users';
import path = require("path");

const dbUser: UserHandler = new UserHandler('./db/users');
const dbMetric: MetricsHandler = new MetricsHandler("./db/metrics");
const LevelStore = levelSession(session);
const app = express();
const port: string = process.env.PORT || '8080';

app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use(session({
  secret: 'this is a very secret secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}));

app.set("views", __dirname + "/../views");
app.set("view engine", "ejs");

const authRouter = express.Router();

authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
});

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
});

authRouter.get('/logout', (req: any, res: any) => {
  if (req.session.loggedIn){
    delete req.session.loggedIn
    delete req.session.user
  }
  res.redirect('/login')
});

authRouter.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
});

  authRouter.post('/signup', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, function (err: Error | null, result?: User) {
      if (!err || result !== undefined) {
       res.status(409).send("user already exists");
      } else {
        const newUser = new User(req.body.username, req.body.mail, req.body.password);
        dbUser.save(newUser, function (err: Error | null) {
          if (err)
            next(err);
          else {
            req.session.loggedIn = true;
            req.session.user = newUser;
            res.redirect("/");
          }
        })
      }
    })
  });

  app.use(authRouter);

  const authMiddleware = function(req: any, res: any, next: any) {
    if (req.session.loggedIn)
      next();
    else
      res.redirect("/login");
  };

  app.get("/", authMiddleware, (req: any, res: any) => {
    res.render("index", { name: req.session.user.username });
  });

const userRouter = express.Router();

  userRouter.get('/:username', (req: any, res: any, next: any) => {
    dbUser.get(req.params.username, function (err: Error | null, result?: User) {
      if (err || result === undefined) {
        res.status(404).send("user not found")
      } else res.status(200).json(result)
    })
  });

  userRouter.post("/", function(req: any, res: any, next: any) {
  dbUser.get(req.body.username, function(err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      res.status(409).send("user already exists");
    } else {
      dbUser.save(req.body, function(err: Error | null) {
        if (err) next(err);
        else res.status(201).send("user persisted");
      })
    }
  })
});

userRouter.delete("/:username", function(req: any, res: any, next: any) {
  dbUser.get(req.params.username, function(err: Error | null) {
    if (err)
      next(err);
    res.status(200).send();
  });
});

  app.use('/user', userRouter);

const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any) => {
  res.render('index', { name: req.session.username })
});


// On applique le même principe pour Metrics
const metricRouter = express.Router();

metricRouter.use(function(req: any, res: any, next: any) {
  console.log("test metricsRouter");
  next();
});

metricRouter.get("/:username", (req: any, res: any, next: any) => {
  if (req.session.user.username === req.params.username) {
    dbMetric.getMetricsPerUser(
      req.params.username, (err: Error | null, result?: {}) => {
        if (err)
          next(err);
        if (result === undefined) {
          res.write("no metrics");
          res.send();
        } else
          res.json(result);
      }
    );
  }
  else {
    res.status(401).send("You cannot read metrics from someone else");
  }
});

metricsRouter.post("/:username", (req: any, res: any, next: any) => {
    dbMet.saveMetric(
      req.session.user.username,
      req.body.key,
      new Metric(`${new Date().getTime()}`, req.body.value),
      (err: Error | null) => {
        if (err)
         next(err);
        res.status(200).send();
        res.redirect("/");
      });
});

metricRouter.get("/:username/:id", (req: any, res: any, next: any) => {
  if (req.session.user.username === req.params.username) {
    dbMet.getMetrics(
      req.params.username,
      req.params.id,
      (err: Error | null, result?: Metric[]) => {
        if (err)
         next(err);
        if (result === undefined) {
          res.write("no metrics");
          res.send();
        } else res.json(result);
      }
    )}
});

metricRouter.delete("/:username/:id", (req: any, res: any, next: any) => {
  if (req.session.user.username === req.params.username) {
    dbMet.deleteMetric(
      req.params.username,
      req.params.id,
      (err: Error | null) => {
        if (err)
         next(err);
        res.status(200).send();
      }
    )}
});

app.use("/metrics", authMiddleware, metricRouter);


app.use(function(err: Error, req: any, res: any, next: any) {
  console.log("error in use");
  console.error(err.stack);
  res.status(500).send("Error use");
});

app.listen(port, (err: Error) => {
  if (err)
    throw err;
  console.log(`server is listening on port ${port}`);
});
