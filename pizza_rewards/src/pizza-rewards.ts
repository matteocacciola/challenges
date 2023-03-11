
export type PizzaRewardsInput = {
  minOrders: number;
  minPrice: number;
  customers: {
    [name: string]: number[]
  };
};

export const pizzaRewards = ({ minOrders, minPrice, customers }: PizzaRewardsInput): Set<string> => {
  return new Set(
    Object.entries(customers)
      .filter(([_name, orders]) => (
        orders.filter(order => order >= minPrice).length >= minOrders
      ))
      .map(([name]) => name)
  );
};
