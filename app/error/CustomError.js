class CustomError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode || 500; // Set a default status code if not provided
      this.name = this.constructor.name; // Set the error name to the class name
    }
  }
  
  module.exports = CustomError;