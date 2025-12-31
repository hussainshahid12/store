import express from "express";
const account_router = express.Router();
import { UserAccount } from "../controller/user_Account.js";

// Define your user account routes here

account_router.post("/register", UserAccount.signup);
account_router.post("/login", UserAccount.login);


export default account_router;
