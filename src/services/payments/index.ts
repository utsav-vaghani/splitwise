import {
  LedgerService,
  PaymentService as Service,
  TransactionService,
  UserService,
} from "..";
import CustomError from "../../errors/errors";
import { Payment, UserTransaction } from "../../models/transaction";

class PaymentService implements Service {
  private transactionService: TransactionService;
  private userService: UserService;
  private ledgerService: LedgerService;

  constructor(
    userService: UserService,
    transactionService: TransactionService,
    ledgerService: LedgerService
  ) {
    this.transactionService = transactionService;
    this.userService = userService;
    this.ledgerService = ledgerService;
  }

  async Add(payment: Payment) {
    if (
      !payment ||
      !payment.payerId ||
      !payment.type ||
      !payment.amount ||
      !payment.participants
    ) {
      throw new CustomError(400, "invalid payment details");
    }

    const user = await this.userService.GetByID(payment.payerId);
    if (!user) {
      throw new CustomError(403, "invalid payerId");
    }

    let netAmount = 0;

    for (const participant of payment.participants) {
      const user = await this.userService.GetByID(participant.userId);
      if (!user) {
        throw new CustomError(403, "invalid participant id");
      }

      netAmount += participant.amount;
    }

    if (netAmount != payment.amount) {
      throw new CustomError(403, "invalid amount");
    }

    let promises: Promise<void>[] = [];

    for (const participant of payment.participants) {
      if (participant.userId != payment.payerId) {
        promises.push(
          this.transactionService.Update({
            payerId: payment.payerId,
            userId: participant.userId,
            amount: participant.amount,
          })
        );
      }
    }

    await Promise.all(promises);

    return await this.ledgerService.Insert({ ...payment, _id: "" });
  }

  async Settle(transaction: UserTransaction) {
    if (
      !transaction ||
      !transaction.amount ||
      !transaction.payerId ||
      !transaction.userId
    ) {
      throw new CustomError(400, "invalid transaction details");
    }

    const ut: any = await this.transactionService.FindOne({
      payerId: transaction.userId,
      userId: transaction.payerId,
    });

    if (!ut) {
      throw new CustomError(400, "cannot settle non-existing records");
    }

    if (ut.amount != transaction.amount) {
      throw new CustomError(403, "invalid amount for settlement");
    }

    this.transactionService.Update(transaction);
  }

  FindByUserId(userId: string) {
    return this.transactionService.FindByUserId(userId);
  }

  FindByPayerId(payerId: string) {
    return this.transactionService.FindByPayerId(payerId);
  }

  FindOne(filter: any) {
    if (!filter || filter.payerId == undefined || filter.userId == undefined) {
      throw new CustomError(400, "invalid filter");
    }

    return this.transactionService.FindOne(filter);
  }
}

export default PaymentService;
