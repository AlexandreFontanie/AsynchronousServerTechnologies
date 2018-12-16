#!/usr/bin/env ts-node

import { Metric, MetricsHandler } from '../src/metrics'
import { User, UserHandler } from '../src/users'

const dbMet = new MetricsHandler("./db/metrics");
const dbUser = new UserHandler("./db/users");

// Premier utilisateur

const met = [
  new Metric(`${new Date("2013-11-04 14:00 UTC").getTime()}`, 11),
  new Metric(`${new Date("2013-11-04 14:15 UTC").getTime()}`, 4),
  new Metric(`${new Date("2013-11-04 14:30 UTC").getTime()}`, 8)
];

const met2 = [
  new Metric(`${new Date("2013-11-04 15:00 UTC").getTime()}`, 13),
  new Metric(`${new Date("2013-11-04 15:15 UTC").getTime()}`, 11),
  new Metric(`${new Date("2013-11-04 15:30 UTC").getTime()}`, 9)
];

const user1 = new User("test1", "test1@test.com", "test1");

dbUser.save(user1, (err: Error | null) => {
  if (err) throw err;
  console.log("Utilisateur intégré, identifiants :");
  console.log("login : test1");
  console.log("mot de passe : test1")
});

dbMet.saveMetric("test1", "0", met, (err: Error | null) => {
  if (err) throw err;
  console.log("Metrics pour test1");
});
dbMet.saveMetric("test1", "1", met2, (err: Error | null) => {
  if (err) throw err;
  console.log("Metrics pour test1");
});


/// Deuxième utilisateur

const met3 = [
  new Metric(`${new Date("2014-03-24 16:00 UTC").getTime()}`, 19),
  new Metric(`${new Date("2014-03-24 16:15 UTC").getTime()}`, 23),
  new Metric(`${new Date("2014-03-24 16:30 UTC").getTime()}`, 14)
];

const met4 = [
  new Metric(`${new Date("2014-03-24 17:00 UTC").getTime()}`, 6),
  new Metric(`${new Date("2014-03-24 17:15 UTC").getTime()}`, 9),
  new Metric(`${new Date("2014-03-24 17:30 UTC").getTime()}`, 15)
];

const user2 = new User("test2", "test2@test.com", "test2");

dbUser.save(user2, (err: Error | null) => {
  if (err) throw err;
  console.log("Utilisateur intégré, identifiants :");
  console.log("login : test2");
  console.log("mot de passe : test2")
});

dbMet.saveMetric("test2", "0", met3, (err: Error | null) => {
  if (err) throw err;
  console.log("Metrics pour test2");
});
dbMet.saveMetric("test2", "1", met4, (err: Error | null) => {
  if (err) throw err;
  console.log("Metrics pour test2");
});
