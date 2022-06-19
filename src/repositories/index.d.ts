import { Transaction, UserTransaction } from "../models/transaction";

export interface LedgerRepository {
  Insert(transaction: Transaction);
  FindByID(id: string);
  FindByPayerID(id: string);
  FindAll();
  Update(transaction: Transaction);
  Delete(id: string);
}

export interface TransactionRepository {
  Update(transaction: UserTransaction);
  FindOne(filter: any);
  FindByPayerId(payerId: string);
  FindByUserId(userId: string);
  Delete(filter: any);
}

export interface UserRepository {
  Insert(user: User);
  FindByID(id: string);
  FindByEmail(email: string);
  FindByPhone(phone: string);
  FindAll();
  Update(user: User);
  Delete(id: string);
}
