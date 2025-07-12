import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

/* GET users listing. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.json({ message: "respond with a resource" });
});

// router.post(
//   "/login",
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { credential } = req.body;

//     if (!credential) {
//       return res.status(400).json({ message: "Credential is required" });
//     }

//     const user = await User.findOne({ where: { email: credential } });
//   }
// );

export default router;
