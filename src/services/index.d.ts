import { Payment, Transaction, UserTransaction } from "../models/transaction";

export interface LedgerService {
  GetByID(id: string);
  GetByPayerID(id: string);
  GetAll();
  Insert(transaction: Transaction);
  Update(transaction: Transaction);
  Delete(id: string);
}

export interface PaymentService {
  Add(payment: Payment);
  Settle(transaction: UserTransaction);
  FindByUserId(userId: string);
  FindByPayerId(payerId: string);
  FindOne(filter: any);
}

export interface TransactionService {
  Update(transaction: UserTransaction);
  FindOne(filter: any);
  FindByUserId(userId: string);
  FindByPayerId(payerId: string);
  Delete(filter: any);
}

export interface UserService {
  GetByID(id: string);
  GetByEmail(email: string);
  GetByPhone(phone: string);
  GetAll();
  Create(data: User);
  Update(user: User);
  Delete(id: string);
}
