const { StatusCodes } = require("http-status-codes");
const { nodeEnv } = require("../../helpers/constants");

module.exports = ({ genericErrorMessage = "An error has occurred" } = {}) => (error, req, res, next) => {
  if (nodeEnv !== "test") {
    console.error({
      error,
      message: error.message || genericErrorMessage
    });
  }

  if (error.status) {
    return res.status(error.status).json({
      type: error.name,
      message: error.message,
      errors: error.errors
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: genericErrorMessage });
};
