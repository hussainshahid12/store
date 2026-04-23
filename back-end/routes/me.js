import express from "express";
import { getMe } from "../controller/me.js";
import { Auth } from "../middleware/Auth.js";

const me_router = express.Router();

me_router.get("/me", Auth, getMe);

export default me_router;
