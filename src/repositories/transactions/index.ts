import { DB } from "../../db/mongodb";
import { UserTransaction } from "../../models/transaction";

const db = DB.collection("transactions");

class TransactionRepository {
  Update(transaction: UserTransaction) {
    return db.updateOne(
      { payerId: transaction.payerId, userId: transaction.userId },
      {
        $set: {
          payerId: transaction.payerId,
          userId: transaction.userId,
          amount: transaction.amount,
        },
      },
      { upsert: true }
    );
  }

  FindOne(filter: any) {
    return db.findOne({
      userId: filter.userId,
      payerId: filter.payerId,
    });
  }

  FindByPayerId(payerId: string) {
    return db.find({ payerId }).toArray();
  }

  FindByUserId(userId: string) {
    return db.find({ userId }).toArray();
  }

  Delete(filter: any) {
    return db.deleteOne(filter);
  }
}

export default TransactionRepository;
