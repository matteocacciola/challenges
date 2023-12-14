const { ACCEPTED, DEBT, MAX_AMOUNT_BREACH } = require("./decision");
const { getByEmail: getCustomerDebt, increaseByEmail: increaseCustomerDebt } = require("./model");
const { customerDebtLimit, purchaseAmountLimit } = require("../helpers/constants");

const makeDecisionBasedOnCustomerDebt = (purchaseAmount, currentCustomerDebt) =>
  isDebtLimitGoingToBeExceeded(purchaseAmount, currentCustomerDebt)
    ? DEBT
    : ACCEPTED;

const isDebtLimitGoingToBeExceeded = (purchaseAmount, currentCustomerDebt) =>
  currentCustomerDebt + purchaseAmount > customerDebtLimit;

const isAmountGreaterThanLimit = (purchaseAmount) =>
    purchaseAmount > purchaseAmountLimit;

module.exports.getDecision = async (amount, email) => {
    if (isAmountGreaterThanLimit(amount)) {
        return MAX_AMOUNT_BREACH;
    }

    const customerDebt = await getCustomerDebt(email);
    const decision = makeDecisionBasedOnCustomerDebt(amount, customerDebt);

    if (decision.accepted) {
        await increaseCustomerDebt(email, amount);
    }

    return decision;
}