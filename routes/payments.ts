import express, { Request, Response, NextFunction } from "express";
import { UserAccount, PaymentDetails } from "../models/payments";

// Demo user for the purpose of the coding test
const demoUser = new UserAccount();

const router = express.Router();

router.get("/view", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await demoUser.getPayments().then((result) => {
          res.status(200).json(result);
        });
      } catch (error) {
        next(error);
      }
});

router.post("/book", async (req: Request, res: Response, next: NextFunction) => {
  const body: PaymentDetails = {
      payDate: req.body.payDate,
      amount: req.body.amount,
      beneficiary: req.body.beneficiary,
      description: req.body.description
  };

  try {
    await demoUser.createPayment(body).then((result) => {
      if (typeof result === "string") {
        res.status(400).json(result);
      }
      res.status(200).json(result);
    });
  } catch (error) {
    next(error);
  }
});

router.put("/update", async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.body.id; 
    const body: PaymentDetails = {
        payDate: req.body.payDate,
        amount: req.body.amount,
        beneficiary: req.body.beneficiary,
        description: req.body.description
    };
  
    try {
      await demoUser.updatePayment(id, body).then((result) => {
        if (typeof result === "string") {
          res.status(400).json(result);
        }
        res.status(200).json(result);
      });
    } catch (error) {
      next(error);
    }
  });

router.get("/balance", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await demoUser.getBalance().then((result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    next(error);
  }
});

router.post("/schedule", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json("schedule api");
});

export { router as paymentsRoutes };
