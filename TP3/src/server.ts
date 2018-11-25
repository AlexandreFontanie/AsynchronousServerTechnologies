import express = require("express");

const app = express();
const port: string = process.env.PORT || '8080';

app.get("/", (req: any, res: any) => {
  res.write("Hello world");
  res.send();
});

app.listen(port, (err: Error) => {
  if (err)
  {
    throw err;
  }
  console.log(`Server is listening on port ${port}`);
});
