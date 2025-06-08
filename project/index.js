// index.js
require('dotenv').config();
const app = require('./src/server');
const logger = require('./src/utils/logger'); // Import logger

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`);
  logger.info(`Server is running on port ${PORT}`);
});
