import { NextFunction, Request, Response } from "express";
import CustomError from "../../../../errors/errors";
import LedgerService from "../../../../services/ledger";

class LedgerController {
  private ledgerService: LedgerService;

  constructor(ledgerService: LedgerService) {
    this.ledgerService = ledgerService;

    // binding methods
    this.GetByID = this.GetByID.bind(this);
    this.Get = this.Get.bind(this);
  }

  async GetByID(req: Request, Res: Response, next: NextFunction) {
    if (req.params.id.trim() === "") {
      throw new CustomError(400, "invalid id");
    }

    try {
      const transaction = await this.ledgerService.GetByID(req.params.id);
      next({ transaction });
    } catch (err) {
      next(err);
    }
  }

  async Get(req: Request, Res: Response, next: NextFunction) {
    try {
      let data: any = {};

      if (req.query.payerId !== undefined) {
        const payerIdStr = req.query.payerId.toString();
        const payerId = payerIdStr.includes(",")
          ? payerIdStr.split(",")[0]
          : payerIdStr;
        data.transaction = await this.ledgerService.GetByPayerID(payerId);
      } else {
        data.transactions = await this.ledgerService.GetAll();
      }

      next(data);
    } catch (err) {
      next(err);
    }
  }
}

export default LedgerController;
