import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { purchaseController } from "./Purchase.controller";
import { PurchaseValidation } from "./Purchase.validation";

const router = express.Router();

router.post(
  "/",
  auth(),
  // validateRequest(PurchaseValidation.createSchema),
  purchaseController.createPurchase
);


router.get("/", auth(), purchaseController.getPurchaseList);

router.get("/:id", auth(), purchaseController.getPurchaseById);

router.put(
  "/:id",
  auth(),
  // validateRequest(PurchaseValidation.updateSchema),
  purchaseController.updatePurchase
);
router.put(
  "/pin/:id",
  auth(),
  // validateRequest(PurchaseValidation.updateSchema),
  purchaseController.pinPurchaseBook
);

router.delete("/:id", auth(), purchaseController.deletePurchase);

export const PurchaseRoutes = router;
