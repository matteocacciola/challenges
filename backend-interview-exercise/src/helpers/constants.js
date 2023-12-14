module.exports = {
  nodeEnv: process.env.NODE_ENV,
  customerDebtLimit: process.env.CUSTOMER_DEBT_LIMIT ?? 100,
  purchaseAmountLimit: process.env.PURCHASE_AMOUNT_LIMIT ?? 20
};