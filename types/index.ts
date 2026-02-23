export type CostItem = {
  id: string;
  name: string;
  amount: number;
};

export type Settings = {
  fixedCosts: CostItem[];
  kahokoCosts: CostItem[];
};
