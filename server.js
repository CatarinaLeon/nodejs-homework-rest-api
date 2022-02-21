const mongoose = require('mongoose');
const app = require('./app')

const {MONGODB_URL, PORT} = process.env;

mongoose
  .connect(MONGODB_URL)
  .then(() => {
  app.listen(PORT, () => {
  console.log("Database connection successful, Server running. Use our API on port: 3000")
})
})
  .catch((error) => {
    console.log(error.message)
    process.exit(1)
})
