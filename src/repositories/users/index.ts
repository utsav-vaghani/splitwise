import { mongo } from "mongoose";
import { DB } from "../../db/mongodb";

const db = DB.collection("users");

class UserRepository {
  Insert(user: User) {
    return db.insertOne({
      email: user.email,
      name: user.name,
      phone: user.phone,
    });
  }

  FindByID(id: string) {
    return db.findOne({
      _id: new mongo.ObjectId(id),
    });
  }

  FindByEmail(email: string) {
    return db.findOne({ email });
  }

  FindByPhone(phone: string) {
    return db.findOne({ phone });
  }

  FindAll() {
    return db.find().toArray();
  }

  Update(user: User) {
    return db.updateOne(
      { _id: new mongo.ObjectId(user._id) },
      { $set: { email: user.email, name: user.name, phone: user.phone } }
    );
  }

  Delete(id: string) {
    return db.deleteOne({ _id: new mongo.ObjectId(id) });
  }
}

export default UserRepository;
