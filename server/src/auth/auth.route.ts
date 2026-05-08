import { Router } from "express";
import { auth } from "../lib/auth.js";

const router:Router = Router();

router.get("/api/me",async(req,res)=>{
 const session = auth.api.getSession({
    headers:new Headers(req.headers as HeadersInit),
 })

 return res.json(session)
})