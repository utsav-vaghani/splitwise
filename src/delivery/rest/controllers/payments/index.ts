import { NextFunction, Request, Response } from "express";
import CustomError from "../../../../errors/errors";
import { PaymentService } from "../../../../services/";

class PaymentController {
  private paymentService: PaymentService;

  constructor(paymentSerice: PaymentService) {
    this.paymentService = paymentSerice;

    // binding methods to object
    this.Add = this.Add.bind(this);
    this.Settle = this.Settle.bind(this);
    this.Find = this.Find.bind(this);
    this.FindOne = this.FindOne.bind(this);
  }

  async Add(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.paymentService.Add(req.body);
      if (data != null && data.acknowledged) {
        next({
          statusCode: 201,
          data: { status: "SUCCESS", _id: data.insertedId },
        });
      }
    } catch (err) {
      next(err);
    }
  }

  Settle(req: Request, res: Response, next: NextFunction) {
    try {
      this.paymentService.Settle(req.body);
      next({
        statusCode: 200,
        data: { status: "SUCCESS" },
      });
    } catch (err) {
      next(err);
    }

    next();
  }

  async FindOne(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId;
    const payerId = req.params.payerId;

    try {
      const data = await this.paymentService.FindOne({
        userId,
        payerId,
      });

      if (data) {
        next({
          statusCode: 200,
          data: {
            transaction: {
              userId: data.userId,
              payerId: data.payerId,
              amount: data.amount,
            },
          },
        });

        return;
      }

      throw new CustomError(500, "internal server error");
    } catch (err) {
      next(err);
    }
  }

  async Find(req: Request, res: Response, next: NextFunction) {
    try {
      let data: any = {};
      if (req.query.userId != undefined) {
        const userIdStr = req.query.userId.toString();
        const userId = userIdStr.includes(",")
          ? userIdStr.split(",")[0]
          : userIdStr;
        data.transactions = await this.paymentService.FindByUserId(userId);
      } else if (req.query.payerId != undefined) {
        const payerIdStr = req.query.payerId.toString();
        const payerId = payerIdStr.includes(",")
          ? payerIdStr.split(",")[0]
          : payerIdStr;
        data.transactions = await this.paymentService.FindByPayerId(payerId);
      } else {
        throw new CustomError(400, "userId or payerId required");
      }

      next({
        statusCode: 200,
        data: data,
      });
      next({});
    } catch (err) {
      next(err);
    }
  }
}

export default PaymentController;
