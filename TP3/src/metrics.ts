import { LevelDb } from "./leveldb";
import WriteStream from "level-ws";

export class Metric {
  public timestamp: string;
  public value: number;

  constructor(ts: string, v: number) {
    this.timestamp = ts;
    this.value = v;
  }
}

export class MetricsHandler {
  private db: any;

  constructor(dbPath: string) {
    this.db = LevelDb.open(dbPath);
  }

  public saveMetric(
    username: string,
    key: string,
    metric: Metric[],
    callback: (error: Error | null) => void
  ) {
    const stream = WriteStream(this.db);
    stream.on("error", callback);
    stream.on("close", callback);

    metric.forEach(m => {
      stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value });
    });

    stream.end();
  }

  public getMetric(
    username: string,
    key: string,
    callback: (err: Error | null, result?: Metric[]) => void
  ) {
    const stream = this.db.createReadStream();
    var metric: Metric[] = [];

    stream
      .on("error", callback)
      .on("end", (err: Error) => {
        callback(null, metric);
      })
      .on("data", (data: any) => {
        const [, u, k, timestamp] = data.key.split(":");
        const value = data.value;
        if (username != u || key != k) {
          console.log(`Level DB error: ${data} does not match key ${key}`);
        }
        else {
          metric.push(new Metric(timestamp, value));
        }
      });
  }

  public deleteMetric(
    username: dtring,
    key: string,
    callback: (err: Error | null, result?: Metric[]) => void
  ) {
    const stream = this.db.createReadStream();
    var metric: Metric[] = [];

    stream
      .on("error", callback)
      .on("end", (err: Error) => {
        callback(null, metric);
      })
      .on("data", (data: any) => {
        const [, u, k, timestamp] = data.key.split(":");
        const value = data.value;
        if (username != u || key != k) {
          console.log(`Level DB error: ${data} does not match key ${key}`);
        }
        else {
          this.db.del(data.key, function (err) {
          if (err)
            console.log(err);
          });
        }
      });
  }

  public updateMetric(
    username: string,
    key: string,
    metric: Metric,
    callback: (error: Error | null) => void
  ) {

    let metricsToUpdate;
    this.getMetric(username, key, (err: Error | null, result?: Metric[]) => {
      if (err)
        callback(err)
      else {
        metricsToUpdate = result;
        for(const i in metricsToUpdate) {
          if(metricsToUpdate[i].timestamp === metric.timestamp)
          {
            metricsToUpdate.splice(i, 1, metric);
          }
        }
        this.deleteMetric(username, key, (err: Error | null) => {
          if (err)
            callback(err)
            else {
              this.saveMetric(username, key, metricsToUpdate, (err: Error | null) => {
              if (err)
                callback(err)
              else
                callback(null);
              });
            }
          });
        }
      });
    }

}
