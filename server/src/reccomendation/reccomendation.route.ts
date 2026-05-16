import { Router, type Router as ExpressRouter } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import {
  getRecommendationsController,
  refreshRecommendationsController
} from "./reccomendation.controller.js";

const router: ExpressRouter = Router();

router.get("/", authMiddleware, getRecommendationsController);
router.post("/refresh", authMiddleware, refreshRecommendationsController);

export default router;
