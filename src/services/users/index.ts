import CustomError from "../../errors/errors";
import UserRepository from "../../repositories/users";

export default class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  GetByID(id: string) {
    if (!id) {
      throw new CustomError(400, "invalid id");
    }

    return this.userRepository.FindByID(id);
  }

  GetByEmail(email: string) {
    if (!email) {
      throw new CustomError(400, "invalid email");
    }

    return this.userRepository.FindByEmail(email);
  }

  GetByPhone(phone: string) {
    if (!phone) {
      throw new CustomError(400, "invalid phone");
    }

    return this.userRepository.FindByPhone(phone);
  }

  GetAll() {
    return this.userRepository.FindAll();
  }

  async Create(data: User) {
    if (!data || !data.email || !data.name || !data.phone) {
      throw new CustomError(400, "invalid user details");
    }

    let results = await Promise.allSettled([
      this.userRepository.FindByEmail(data.email),
      this.userRepository.FindByPhone(data.phone),
    ]);

    for (const value of results) {
      if (value.status == "fulfilled" && value.value !== null) {
        throw new CustomError(403, "user already exist");
      }
    }

    return this.userRepository.Insert(data);
  }

  async Update(user: User) {
    if (!user) {
      throw new Error("invalid user details");
    }

    const dbUser = await this.userRepository.FindByID(user._id);

    if (dbUser === null) {
      throw new CustomError(403, "cannot update non-existing user");
    }

    user.email ||= dbUser.email;
    user.name ||= dbUser.name;
    user.phone ||= dbUser.phone;

    return this.userRepository.Update(user);
  }

  Delete(id: string) {
    if (!id) {
      throw new CustomError(403, "invalid id");
    }

    return this.userRepository.Delete(id);
  }
}
