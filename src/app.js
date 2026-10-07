import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"


const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


const app = express()
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static('public'))




import { userRouter } from "./router/user.router.js"

app.use("/user",userRouter)






export default app;