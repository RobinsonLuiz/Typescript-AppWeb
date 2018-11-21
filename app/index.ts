import routes from './routes/Routes';
const port = 80;

new routes().express.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }
  return console.log(`server is listening on ${port}`)
});