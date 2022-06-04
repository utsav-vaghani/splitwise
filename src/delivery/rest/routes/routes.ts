import Express from "express";
import LedgerRepository from "../../../repositories/ledger";
import TransactionRepository from "../../../repositories/transactions";
import UserRepository from "../../../repositories/users";
import LedgerService from "../../../services/ledger";
import PaymentService from "../../../services/payments";
import TransactionService from "../../../services/transactions";
import UserService from "../../../services/users";
import LedgerController from "../controllers/ledger";
import PaymentController from "../controllers/payments";
import UserController from "../controllers/users";

const ledgerService = new LedgerService(new LedgerRepository());
const transactionService = new TransactionService(new TransactionRepository());
const userService = new UserService(new UserRepository());
const paymentService = new PaymentService(
  userService,
  transactionService,
  ledgerService
);

const ledgerController = new LedgerController(ledgerService);
const ledgerRouter = Express();
ledgerRouter.get("/", ledgerController.Get);
ledgerRouter.get("/:id", ledgerController.GetByID);

const paymentController = new PaymentController(paymentService);
const paymentRouter = Express();
paymentRouter.post("/add", paymentController.Add);
paymentRouter.post("/settle", paymentController.Settle);
paymentRouter.get("/", paymentController.Find);
paymentRouter.get("/:payerId/:userId", paymentController.FindOne);

const userController = new UserController(userService);
const userRouter = Express();
userRouter.get("/:id", userController.GetByID);
userRouter.get("/", userController.Get);
userRouter.post("/", userController.Create);
userRouter.patch("/", userController.Update);
userRouter.delete("/:id", userController.Delete);

export default {
  userRouter,
  ledgerRouter,
  paymentRouter,
};
