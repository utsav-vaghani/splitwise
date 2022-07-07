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
    this.Get = this.Get.bind(this);
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

  async Get(req: Request, res: Response, next: NextFunction) {
    let userId, payerId;

    if (req.query.userId !== undefined) {
      const userIdStr = req.query.userId.toString();
      userId = userIdStr.includes(",") ? userIdStr.split(",")[0] : userIdStr;
    }

    if (req.query.payerId != undefined) {
      const payerIdStr = req.query.payerId.toString();
      payerId = payerIdStr.includes(",")
        ? payerIdStr.split(",")[0]
        : payerIdStr;
    }

    try {
      if (userId !== undefined && payerId !== undefined) {
        const data = await this.paymentService.FindOne({
          userId,
          payerId,
        });

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
      } else if (userId !== undefined) {
        const data = await this.paymentService.FindByUserId(userId);
        next({
          statusCode: 200,
          data: {
            transactions: data,
          },
        });
        return;
      } else if (payerId !== undefined) {
        const data = await this.paymentService.FindByPayerId(payerId);
        next({
          statusCode: 200,
          data: {
            transactions: data,
          },
        });
        return;
      }

      throw new CustomError(400, "userId or payerId required");
    } catch (err) {
      next(err);
    }
  }
}

export default PaymentController;
