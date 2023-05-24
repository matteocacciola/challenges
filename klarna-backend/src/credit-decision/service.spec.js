const { MAX_AMOUNT_BREACH, DEBT, ACCEPTED } = require("./decision");

jest.mock("./model");
const model = require("./model");

const getByEmailMock = jest.fn();
model.getByEmail = getByEmailMock;

const { getDecision } = require("./service");

describe("Credit decision service", () => {
  const email = "foo@bar.com";

  beforeEach(() => {
    getByEmailMock.mockReset();
  });

  it("Should not allow purchases over the purchase amount limit", async () => {
    const purchaseAmount = 21;
    const customerDebt = 0;

    getByEmailMock.mockReturnValueOnce(
        new Promise(resolve => resolve(customerDebt))
    );
    expect(await getDecision(purchaseAmount, email)).toBe(
      MAX_AMOUNT_BREACH
    );
  });

  it("Should not allow purchases that would breech the customer debt limit", async () => {
    const purchaseAmount = 1;
    const customerDebt = 100;

    getByEmailMock.mockReturnValueOnce(
        new Promise(resolve => resolve(customerDebt))
    );
    expect(await getDecision(purchaseAmount, email)).toBe(DEBT);
  });

  it("Should allow purchases under the purchase amount limit within the allowed debt amount", async () => {
    const purchaseAmount = 1;
    const customerDebt = 99;

    getByEmailMock.mockReturnValueOnce(
        new Promise(resolve => resolve(customerDebt))
    );
    expect(await getDecision(purchaseAmount, email)).toBe(ACCEPTED);
  });
});
