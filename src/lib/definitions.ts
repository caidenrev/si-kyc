export type Customer = {
  id: string;
  nik: string;
  name: string;
  address: string;
  avatarUrl: string;
  joinDate: string;
};

export type Transaction = {
  id: string;
  customerId: string;
  date: string;
  type: 'Deposit' | 'Withdrawal' | 'Transfer';
  amount: number;
  currency: 'IDR' | 'USD' | 'EUR';
  source: string;
  destination: string;
};
