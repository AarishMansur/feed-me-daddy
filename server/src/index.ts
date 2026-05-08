import express from "express"
import "dotenv/config"
import FeedRoute from './Feed/feed.route.js'
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth.js"

const PORT = process.env.PORT_NUMBER || 5000

const app = express();

 app.use(express.json())

app.get("/",(_,res)=>{
     res.status(200).json({message:"Hello this server is running fine"})
})

app.use("/api",FeedRoute)
app.all("/api/auth/**",toNodeHandler(auth))

app.listen(PORT,()=>{
    console.log(`Hello this port is running fine on ${PORT}`);
})

