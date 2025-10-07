import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: "Hola a todos desde Backend II" });
});

export default router;