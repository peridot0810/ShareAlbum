import express from 'express';
import usersRouter from './users';

const router = express.Router();
router.use(express.json());

router.use("/users", usersRouter);

export default router;