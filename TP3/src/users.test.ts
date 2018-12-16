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



    describe('#get', function () {
      it('should get undefined on non existing User', function (done) {
        dbUser.get("0", function (err: Error | null, result?: User) {
          expect(err).to.be.null
          expect(result).to.be.undefined
          done();
        })
      })
    })



    describe('#delete', function () {
      it('should delete a User', function (done) {
        const user = new User("testd", "testd@test.com", "testd");
        dbUser.delete("testd", function (err: Error | null) {
          expect(err).to.be.undefined
          done();
        })
      });


      it('should not fail if User does not exist', function (done) {
        dbUser.get("testd", function (err: Error | null, result?: User) {
          expect(err).to.be.null
          expect(result).to.be.undefined
          done();
        })
      })
    })
  });
