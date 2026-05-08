import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { SubscriptionController } from "./Feed.controller.js";

const router:Router = Router();

router.get("/subscriptions",authMiddleware,SubscriptionController);


export default router;