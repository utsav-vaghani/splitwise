import { NextFunction, Request, Response } from "express";
import CustomError from "../../../../errors/errors";
import { UserService } from "../../../../services";

class UserController {
  private service: UserService;

  constructor(service: UserService) {
    this.service = service;

    // binding methods to this
    this.Create = this.Create.bind(this);
    this.Get = this.Get.bind(this);
    this.GetByID = this.GetByID.bind(this);
    this.Update = this.Update.bind(this);
    this.Delete = this.Delete.bind(this);
  }

  async GetByID(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.service.GetByID(req.params.id);
      next({
        statusCode: 200,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }

  async GetByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.query.email == null) {
        throw new CustomError(400, "invalid email");
      }

      const user = await this.service.GetByEmail(req.query.email.toString());
      next({
        statusCode: 200,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }

  async GetByPhone(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.service.GetByPhone(req.params.phone);
      next({
        statusCode: 200,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }

  async Get(req: Request, res: Response, next: NextFunction) {
    try {
      let data: any = {};

      if (req.query.email !== undefined) {
        const emailStr = req.query.email.toString();
        const email = emailStr.includes(",")
          ? emailStr.split(",")[0]
          : emailStr;
        data.user = await this.service.GetByEmail(email);
      } else if (req.query.phone !== undefined) {
        const phoneStr = req.query.phone.toString();
        const phone = phoneStr.includes(",")
          ? phoneStr.split(",")[0]
          : phoneStr;
        data.user = await this.service.GetByPhone(phone);
      } else {
        data.users = await this.service.GetAll();
      }

      next({
        statusCode: 200,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async Create(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = {
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        _id: "",
      };

      const data = await this.service.Create(user);
      if (data != null && data.acknowledged) {
        next({
          statusCode: 201,
          data: { status: "SUCCESS", _id: data.insertedId },
        });
        return;
      }

      throw new CustomError(500, "operation failed!");
    } catch (err) {
      next(err);
    }
  }

  async Update(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = {
        _id: req.body._id,
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
      };

      const data = await this.service.Update(user);
      if (data != null && data.acknowledged) {
        next({ statusCode: 200, data: { status: "SUCCESS" } });
        return;
      }

      throw new CustomError(500, "operation failed!");
    } catch (err) {
      next(err);
    }
  }

  async Delete(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.Delete(req.params.id);
      if (data != null && data.acknowledged) {
        next({
          statusCode: 204,
          data: { status: "SUCCESS" },
        });
        return;
      }

      throw new CustomError(500, "operation failed!");
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
