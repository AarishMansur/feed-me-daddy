import express from "express"
import "dotenv/config"
import FeedRoute from './Feed/feed.route.js'
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth.js"
import cors from "cors"

const PORT = process.env.PORT_NUMBER || 5000

const app = express();

app.use(cors({
    origin:process.env.FRONTEND_URL ,
    credentials:true,
}))

app.all("/api/auth/*splat",toNodeHandler(auth))


 app.use(express.json())

app.get("/",(_,res)=>{
     res.status(200).json({message:"Hello this server is running fine"})
})


app.use("/api/youtube",FeedRoute)

app.listen(PORT,()=>{
    console.log(`Hello this port is running fine on ${PORT}`);
})

