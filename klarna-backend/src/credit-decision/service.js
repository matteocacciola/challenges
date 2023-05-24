const { ACCEPTED, DEBT, MAX_AMOUNT_BREACH } = require("./decision");
const { getByEmail: getCustomerDebt, increaseByEmail: increaseCustomerDebt } = require("./model");

const CUSTOMER_DEBT_LIMIT = 100;
const PURCHASE_AMOUNT_LIMIT = 20;

const makeDecisionUsingPreliminaryConditions = purchaseAmount =>
  purchaseAmount > PURCHASE_AMOUNT_LIMIT ? MAX_AMOUNT_BREACH : undefined;

const makeDecisionBasedOnCustomerDebt = (purchaseAmount, currentCustomerDebt) =>
  isDebtLimitGoingToBeExceeded(purchaseAmount, currentCustomerDebt)
    ? DEBT
    : ACCEPTED;

const isDebtLimitGoingToBeExceeded = (purchaseAmount, currentCustomerDebt) =>
  currentCustomerDebt + purchaseAmount > CUSTOMER_DEBT_LIMIT;

const makeCreditDecision = (purchaseAmount, currentCustomerDebt) =>
  makeDecisionUsingPreliminaryConditions(purchaseAmount) ||
  makeDecisionBasedOnCustomerDebt(purchaseAmount, currentCustomerDebt);

const isAmountGreaterThanLimit = (purchaseAmount) =>
    purchaseAmount > PURCHASE_AMOUNT_LIMIT;

module.exports.purchaseAmountLimit = PURCHASE_AMOUNT_LIMIT;

module.exports.getDecision = async (amount, email) => {
    if (isAmountGreaterThanLimit(amount)) {
        return MAX_AMOUNT_BREACH;
    }

    const customerDebt = await getCustomerDebt(email);
    const decision = makeCreditDecision(amount, customerDebt);

    if (decision.accepted) {
        await increaseCustomerDebt(email, amount);
    }

    return decision;
}