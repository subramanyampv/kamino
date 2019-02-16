/* eslint-disable no-console */
const express = require('express');
const packageJson = require('./package.json');

const app = express();
const port = 3000;
app.get('/', (req, res) => res.send(`
<html>
  <head>
    <title>blog-helm</title>
  </head>
  <body>
    <h1>Hello world!</h1>
    <p>package.json version: ${packageJson.version}</p>
    <p>Environment: ${process.env.APP_ENV}</p>
  </body>
</html>
`));

// output version for diagnostics and ensuring deployment is complete.
app.get('/version', (req, res) => res.send(process.env.APP_VERSION));

app.listen(
  port,
  () => console.log('Example app listening on port 3000!'),
);
/* eslint-enable no-console */
