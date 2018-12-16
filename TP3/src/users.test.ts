import { expect } from 'chai';
import { User, UserHandler } from './users';
import { LevelDb } from "./leveldb";


const dbPath: string = 'db_test/users';
var dbUser: UserHandler;


describe('Users', function () {
  before(function () {
    LevelDb.clear(dbPath)
    dbUser = new UserHandler(dbPath)
  })

  after(function () {
    dbUser.db.close()
  })




  describe('#save', function () {
    it('should save a User', function (done) {
      const user = new User("u", "u@g.com", "mdp");
      dbUser.save(user, function (err: Error | null) {
        expect(err).to.be.undefined
        dbUser.get("u", function (err: Error | null, result?: User) {
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          done();
        })
      })

    })
  });
