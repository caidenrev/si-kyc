import { Timestamp } from 'firebase/firestore';

export type Customer = {
  id: string;
  nik: string;
  fullName: string;
  address: string;
  avatarUrl?: string;
  joinDate?: Timestamp; // Made optional for optimistic updates
  ktpPhotoUrl?: string;
};

export type Transaction = {
  id: string;
  customerId: string;
  transactionDate: Timestamp;
  type: 'Deposit' | 'Withdrawal' | 'Transfer';
  amount: number;
  currency: 'IDR' | 'USD' | 'EUR';
  source: string;
  destination: string;
};
