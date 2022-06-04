export type Participant = {
  userId: string;
  amount: number;
};

export type Transaction = {
  _id: string;
  payerId: string;
  amount: number;
  type: string;
  participants: Participant[];
};

export type UserTransaction = {
  payerId: string;
  userId: string;
  amount: number;
};

export type Payment = {
  payerId: string;
  amount: number;
  type: string;
  participants: Participant[];
};
