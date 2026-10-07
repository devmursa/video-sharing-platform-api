import mongoose from "mongoose"

async function connectDB(){

 try {

    await mongoose.connect('mongodb+srv://morsalin318_db_user:tumiKoi@youtube.5s1b92h.mongodb.net/?appName=youtube');
    console.log('DATABASE CONNECTED')
    
} catch (error) {
    console.log('DATABASE CONNECTION FAILED!')
    process.exit(1)
}

}

export default connectDB;