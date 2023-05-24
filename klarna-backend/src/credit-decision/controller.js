const { getDecision } = require("./service");

module.exports.getCreditDecision = async ({ amount, email }) => {
  return getDecision(amount, email)
};
