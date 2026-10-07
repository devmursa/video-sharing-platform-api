import 'dotenv/config' 
import connectDB from "./db/index.js"
import app from './app.js'




connectDB()
.then(()=>{
    
const server=app.listen(process.env.PORT,()=>{
    console.log(`server is listening on port:${process.env.PORT}`)
})

server.on("error",(error)=>{
    console.log(error)
    process.exit(1)
})

})