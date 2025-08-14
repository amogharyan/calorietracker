// lib/logger.js (create this if it doesn't exist)
const logger = {
  info: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`INFO: ${message}`, meta)
    }
  },
  
  warn: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(`WARN: ${message}`, meta)
    }
  },
  
  error: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`ERROR: ${message}`, meta)
    }
  }
}

export default logger