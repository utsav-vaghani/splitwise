import { LedgerService as Service } from "../";
import CustomError from "../../errors/errors";
import { Transaction } from "../../models/transaction";
import { LedgerRepository } from "../../repositories";

class LedgerService implements Service {
  private repo: LedgerRepository;

  constructor(transactionRepository: LedgerRepository) {
    this.repo = transactionRepository;
  }

  GetByID(id: string) {
    return this.repo.FindByID(id);
  }

  GetByPayerID(id: string) {
    return this.repo.FindByPayerID(id);
  }

  GetAll() {
    return this.repo.FindAll();
  }

  Insert(transaction: Transaction) {
    if (!transaction || !transaction.payerId || !transaction.type) {
      throw new CustomError(400, "invalid transaction details");
    }

    return this.repo.Insert(transaction);
  }

  async Update(transaction: Transaction) {
    if (!transaction._id) {
      throw new CustomError(400, "invalid transaction details");
    }

    const dbTransaciton = await this.repo.FindByID(transaction._id);

    if (!dbTransaciton) {
      throw new CustomError(500, "internal server error");
    }

    transaction.type ||= dbTransaciton.type;
    transaction.payerId ||= dbTransaciton.payerId;
    transaction.participants ||= dbTransaciton.participants;
    transaction.amount ||= dbTransaciton.amount;

    return this.repo.Update(transaction);
  }

  Delete(id: string) {
    return this.repo.Delete(id);
  }
}

export default LedgerService;
