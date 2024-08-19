export type LgType = {
  type: string;
  amount: string;
  selected: boolean;
};

export type Bank = {
  name: string;
  country: string;
  selected: boolean;
  lgTypes: LgType[];
  clientExpectedPrice: string;
};

export type BankData = {
  [key: string]: Bank;
};

export type AssignedValues = {
  [key: string]: {
    [lgType: string]: string;
  };
};
