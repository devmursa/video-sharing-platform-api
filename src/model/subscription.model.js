import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({

channel:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
},
subscriber:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
}

},{timestamps:true});

export const subscriptionModel=mongoose.model("subscription",subscriptionSchema)