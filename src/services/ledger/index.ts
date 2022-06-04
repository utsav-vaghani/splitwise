import CustomError from "../../errors/errors";
import { Transaction } from "../../models/transaction";
import LedgerRepository from "../../repositories/ledger";

class LedgerService {
  private ledgerRepository: LedgerRepository;

  constructor(transactionRepository: LedgerRepository) {
    this.ledgerRepository = transactionRepository;
  }

  GetByID(id: string) {
    return this.ledgerRepository.FindByID(id);
  }

  GetByPayerID(id: string) {
    return this.ledgerRepository.FindByPayerID(id);
  }

  GetAll() {
    return this.ledgerRepository.FindAll();
  }

  Insert(transaction: Transaction) {
    if (!transaction || !transaction.payerId || !transaction.type) {
      throw new CustomError(400, "invalid transaction details");
    }

    return this.ledgerRepository.Insert(transaction);
  }

  async Update(transaction: Transaction) {
    if (!transaction._id) {
      throw new CustomError(400, "invalid transaction details");
    }

    const dbTransaciton = await this.ledgerRepository.FindByID(transaction._id);

    if (!dbTransaciton) {
      throw new CustomError(500, "internal server error");
    }

    transaction.type ||= dbTransaciton.type;
    transaction.payerId ||= dbTransaciton.payerId;
    transaction.participants ||= dbTransaciton.participants;
    transaction.amount ||= dbTransaciton.amount;

    return this.ledgerRepository.Update(transaction);
  }

  Delete(id: string) {
    return this.ledgerRepository.Delete(id);
  }
}

export default LedgerService;
