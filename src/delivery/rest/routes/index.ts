import router from "./routes";

export default {
  "/users": router.userRouter,
  "/ledger": router.ledgerRouter,
  "/payments": router.paymentRouter,
};
