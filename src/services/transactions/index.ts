import { TransactionService as Service } from "..";
import CustomError from "../../errors/errors";
import { UserTransaction } from "../../models/transaction";
import { TransactionRepository } from "../../repositories";

class TransactionService implements Service {
  private repo: TransactionRepository;

  constructor(repo: TransactionRepository) {
    this.repo = repo;
  }

  async Update(transaction: UserTransaction) {
    if (
      !transaction ||
      !transaction.amount ||
      !transaction.payerId ||
      !transaction.userId
    ) {
      throw new CustomError(400, "invalid transaction details");
    }

    let uTransaction = await this.FindOne({
      payerId: transaction.payerId,
      userId: transaction.userId,
    });

    let amount = transaction.amount;

    if (uTransaction) {
      amount = transaction.amount + uTransaction.amount;
    }

    if (amount == 0) {
      await Promise.allSettled([
        this.Delete({
          payerId: transaction.payerId,
          userId: transaction.userId,
        }),
        this.Delete({
          payerId: transaction.userId,
          userId: transaction.payerId,
        }),
      ]);

      return;
    }

    let result = await this.repo.Update({
      payerId: transaction.payerId,
      userId: transaction.userId,
      amount: amount,
    });

    if (!result || (result.modifiedCount == 0 && result.upsertedCount == 0)) {
      throw new CustomError(500, "Internal server error");
    }

    uTransaction = await this.FindOne({
      payerId: transaction.userId,
      userId: transaction.payerId,
    });

    amount = -transaction.amount;
    if (uTransaction) {
      amount += uTransaction.amount;
    }

    result = await this.repo.Update({
      payerId: transaction.userId,
      userId: transaction.payerId,
      amount: amount,
    });

    if (!result || (result.modifiedCount == 0 && result.upsertedCount == 0)) {
      throw new CustomError(500, "Internal server error");
    }
  }

  FindOne(filter: any) {
    if (!filter || filter.payerId == undefined || filter.userId == undefined) {
      throw new CustomError(400, "invalid filter");
    }

    return this.repo.FindOne(filter);
  }

  FindByUserId(userId: string) {
    if (!userId || userId.trim() == "") {
      throw new CustomError(400, "invalid userId");
    }

    return this.repo.FindByUserId(userId);
  }

  FindByPayerId(payerId: string) {
    if (!payerId || payerId.trim() == "") {
      throw new CustomError(400, "invalid payerId");
    }

    return this.repo.FindByPayerId(payerId);
  }

  Delete(filter: any) {
    if (!filter || filter.payerId == undefined || filter.userId == undefined) {
      throw new CustomError(400, "invalid filter");
    }

    return this.repo.Delete(filter);
  }
}

export default TransactionService;
