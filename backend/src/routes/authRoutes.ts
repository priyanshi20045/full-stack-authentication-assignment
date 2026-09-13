import { Router, RequestHandler } from "express";
import {register,login,getCurrentUser,refresh,logout,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimitMiddleware.js";
const router = Router();

const registerHandler: RequestHandler = (req, res) => {
  void register(req, res);
};
const loginHandler: RequestHandler = (req, res) => {
  void login(req, res);
};
const meHandler: RequestHandler = (req, res) => {
  void getCurrentUser(req, res);
};
const refreshHandler: RequestHandler = (req, res) => {
  void refresh(req, res);
};
const logoutHandler: RequestHandler = (req, res) => {
  void logout(req, res);
};
router.post("/register", authRateLimiter, registerHandler);
router.post("/login", authRateLimiter, loginHandler);
router.get("/me", authenticate as RequestHandler, meHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", authenticate as RequestHandler, logoutHandler);
export default router;