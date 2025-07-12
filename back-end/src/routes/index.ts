import express from "express";
import usersRouter from "./users";
import authRouter from "./auth";

const router = express.Router();
router.use(express.json());

router.use("/user", usersRouter);
router.use("/auth", authRouter);

export default router;
