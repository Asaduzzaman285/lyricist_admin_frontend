const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dotenv = require('dotenv');
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
console.log('==================================',  process.env.NODE_ENV, envFile, process.env.PORT);
console.log(`API URL: ${process.env.API_URL}`);
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Environment: ${process.env.PORT}`);
// console.log('==================================',  envFile);

// Load the environment variables
dotenv.config({ path: envFile });
// console.log('==================================',  dotenv);

const dev = `${process.env.NODE_ENV}` !== 'production'
const hostname = 'localhost'
const port = `${process.env.PORT}` || 3000

// console.log('====================================================', envFile);
// console.log('====================================================', port);


const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      if (pathname === '/a') {
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query)
      } else {
        await handle(req, res, parsedUrl)
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})