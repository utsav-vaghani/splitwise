import { mongo } from "mongoose";
import { LedgerRepository as Repository } from "../";
import { DB } from "../../db/mongodb";
import { Transaction } from "../../models/transaction";

const db = DB.collection("ledger");

class LedgerRepository implements Repository {
  Insert(transaction: Transaction) {
    return db.insertOne({
      payerId: transaction.payerId,
      type: transaction.type,
      participants: transaction.participants,
    });
  }

  FindByID(id: string) {
    return db.findOne({
      _id: new mongo.ObjectId(id),
    });
  }

  FindByPayerID(id: string) {
    return db.find({ payerId: id }).toArray();
  }

  FindAll() {
    // TODO: needs to refactor, pagination
    return db.find().toArray();
  }

  Update(transaction: Transaction) {
    return db.updateOne(
      { _id: new mongo.ObjectId(transaction._id) },
      {
        $set: {
          payerId: transaction.payerId,
          type: transaction.type,
          participants: transaction.participants,
        },
      }
    );
  }

  Delete(id: string) {
    return db.deleteOne({ _id: new mongo.ObjectId(id) });
  }
}

export default LedgerRepository;
