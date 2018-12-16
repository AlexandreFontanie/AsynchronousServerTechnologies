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
      const met = [new Metric(`${new Date('2013-09-13 16:00 UTC').getTime()}`, 12)];
      dbMet.saveMetric("test1", "0", met, function (err: Error | null) {
        done()
      })
    })

    it('should not fail save if data exist', function (done) {
      dbMet.getMetric("test1", "0", function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.an("array")
        done()
      })
    })
  });



      describe('#getMetric', function () {
        it('should get empty array on non existing group', function (done) {
          dbMet.getMetric("test1", "0", function (err: Error | null, result?: Metric[]) {
            expect(err).to.be.null
            expect(result).to.not.be.undefined
            expect(result).to.be.empty
            done()
          })
        })
      })





      describe('#deleteMetric', function () {
        it('should delete a Metric fro ma User', function (done) {
          const met = new Metric(`${new Date('2015-04-01 12:00 UTC').getTime()}`, 12);
          dbMet.deleteMetric("test1", "0", function (err: Error | null) {
            expect(err).to.be.null
            dbMet.getMetric("test1", "0", function (err: Error | null, result?: Metric[]) {
              expect(err).to.be.null
              expect(result).to.be.an("array")
              expect(result).to.be.empty
              done()
            })
          })
        })

        it('should not fail delete if data does not exist', function (done) {
          dbMet.deleteMetric("test1", "0", function (err: Error | null) {
            expect(err).to.be.null
            done()
          })
        })
      })
    })
