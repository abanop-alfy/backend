import express from "express";

const router = express.Router();

//controllers
import { register } from "../controllers/auth";

router.post("/register", register);
import { login } from "../controllers/auth";

router.post("/login", login);

module.exports = router;
