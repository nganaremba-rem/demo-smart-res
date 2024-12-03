require('dotenv').config();
const { connectDB } = require('./config/database');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

connectDB();

const app = require('./app');

// Connect to database

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
