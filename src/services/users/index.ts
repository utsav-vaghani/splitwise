import { UserService as Service } from "../";
import CustomError from "../../errors/errors";
import { UserRepository } from "../../repositories";

class UserService implements Service {
  private repo: UserRepository;

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  GetByID(id: string) {
    if (!id) {
      throw new CustomError(400, "invalid id");
    }

    return this.repo.FindByID(id);
  }

  GetByEmail(email: string) {
    if (!email) {
      throw new CustomError(400, "invalid email");
    }

    return this.repo.FindByEmail(email);
  }

  GetByPhone(phone: string) {
    if (!phone) {
      throw new CustomError(400, "invalid phone");
    }

    return this.repo.FindByPhone(phone);
  }

  GetAll() {
    return this.repo.FindAll();
  }

  async Create(data: User) {
    if (!data || !data.email || !data.name || !data.phone) {
      throw new CustomError(400, "invalid user details");
    }

    let results = await Promise.allSettled([
      this.repo.FindByEmail(data.email),
      this.repo.FindByPhone(data.phone),
    ]);

    for (const value of results) {
      if (value.status == "fulfilled" && value.value !== null) {
        throw new CustomError(403, "user already exist");
      }
    }

    return this.repo.Insert(data);
  }

  async Update(user: User) {
    if (!user) {
      throw new Error("invalid user details");
    }

    const dbUser = await this.repo.FindByID(user._id);

    if (dbUser === null) {
      throw new CustomError(403, "cannot update non-existing user");
    }

    user.email ||= dbUser.email;
    user.name ||= dbUser.name;
    user.phone ||= dbUser.phone;

    return this.repo.Update(user);
  }

  Delete(id: string) {
    if (!id) {
      throw new CustomError(403, "invalid id");
    }

    return this.repo.Delete(id);
  }
}

export default UserService;
