import { expect } from 'chai';
import { Metric, MetricsHandler } from './metrics';
import { LevelDb } from "./leveldb";


const dbPath: string = 'db_test/metrics';
var dbMet: MetricsHandler;



describe('Metrics', function () {
  before(function () {
    LevelDb.clear(dbPath)
    dbMet = new MetricsHandler(dbPath)
  })

  after(function () {
    dbMet.db.close()
  })


  describe('#saveMetric', function () {
    it('should save a Metric to a User', function (done) {
      const met = [new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`, 12)];
      dbMet.saveMetric("user", "0", met, function (err: Error | null) {
        done()
      })
    })

    it('should not fail if data exist', function (done) {
      dbMet.get("user", "0", function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.an("array")
        done()
      })
    })
  });


    describe('#get', function () {
      it('should get empty array on non existing group', function (done) {
        dbMet.get("user", "0", function (err: Error | null, result?: Metric[]) {
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          expect(result).to.be.empty
          done()
        })
      })
    })





    describe('#delete', function () {
      it('should delete data', function (done) {
        const met = new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`, 12);
        dbMet.remove("user", "0", function (err: Error | null) {
          expect(err).to.be.null
          dbMet.get("user", "0", function (err: Error | null, result?: Metric[]) {
            expect(err).to.be.null
            expect(result).to.be.an("array")
            expect(result).to.be.empty
            done()
          })
        })
      })

      it('should not fail if data does not exist', function (done) {
        dbMet.remove("user", "0", function (err: Error | null) {
          expect(err).to.be.null
          done()
        })
      })
    })
  })
