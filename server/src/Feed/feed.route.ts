import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { PlaylistController, playlistItemsController, SubscriptionController } from "./Feed.controller.js";
import { googleAccountMiddleware } from "./googleAccount.middleware.js";

const router:Router = Router();

router.get("/subscriptions",authMiddleware,SubscriptionController);
router.get("/playlist",authMiddleware,googleAccountMiddleware,PlaylistController)
router.get("/likedVideos",authMiddleware,googleAccountMiddleware,playlistItemsController)


export default router;
