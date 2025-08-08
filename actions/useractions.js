"use server"

import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDB from "@/db/connectDb"
import User from "@/models/User"
// initiate->This function is a server action that creates a payment order with Razorpay and simultaneously records a pending payment in your own database.
export const initiate = async (amount, to_username,paymentform)=>{
//  It accepts the amount of the payment, the username of the person receiving it (to_username), and the supporter's details (paymentform).
await connectDB()


let user = await User.findOne({username:to_username})
// It finds the user in your database who is receiving the payment.
const secret = user.razorpaysecret
// It retrieves that specific user's private Razorpay secret key from their profile.
var instance = new Razorpay({key_id:user.razorpayid,key_secret:secret})
// This creates a new Razorpay instance that is authenticated with the recipient's specific API keys. This ensures the payment goes to the correct Razorpay account.
// process.env.RAZORPAY_KEY_ID
let options = {
    amount:Number.parseInt(amount),
    currency:"INR"
}
// This creates an options object that specifies the payment details, namely the amount and currency.


let x = await instance.orders.create(options)
// This is the core command. It sends a request to Razorpay's servers to create a new payment order. Razorpay responds with an order object (containing an id), which is stored in the variable x.

await Payment.create({oid:x.id,amount:amount/100,to_user:to_username,name:paymentform.name,message:paymentform.message})
// This line creates a new "pending" payment record in your own database. It saves the Razorpay order ID (x.id) along with the supporter's name and message. This record is used later to verify the payment
return x;
// Finally, it sends the Razorpay order object (x) back to the frontend.
}
// this above function's some things and documentation is present on server side integration named documentation

export const fetchuser = async (username) =>{
await connectDB()
let u = await User.findOne({username:username})
 if (!u) {
    // You can return null or a fallback object here
    return null;
    // OR throw a custom error
    // throw new Error("User not found");
  }
let user = u.toObject({flattenObjectIds:true})
return user;
}

export const fetchpayments = async(username)=>{
await connectDB()
// find all payments sorted by decreasing order of amount and flatten object ids
let p = await Payment.find({to_user:username,done:true}).sort({amount:-1}).limit(10).lean()
// return p;
 const safePayments = p.map(payment => ({
    ...payment,
    _id: payment._id.toString(),        // ✅ make _id serializable
    oid: payment.oid?.toString?.() ?? "", // optional: if oid is also ObjectId
    to_user: payment.to_user?.toString?.() ?? "",
    // convert Date fields too if you have any
  }));

  return safePayments;
}

export const updateProfile = async(data,oldusername)=>{
await connectDB()
let ndata=Object.fromEntries(data)
// if the username is being updated, check if username is available
if(oldusername!==ndata.username){
let u= await User.findOne({username:ndata.username})
// This searches the database to see if another user is already using the new username.
if(u){
return {error:"username already exist"}
// If a user (u) is found, it means the username is already taken. The function stops and sends back an error message to prevent duplicates.
}
await User.updateOne({email:ndata.email},ndata)
// If the new username is available, this updates the user's main profile with all the new information.

await Payment.updateMany({to_user:oldusername},{to_user:ndata.username})
// This is a critical cleanup step. It finds all payment records linked to the oldusername and updates them to the new username, ensuring the user's entire history stays connected to them.
}else{
  // This code runs if the check at the beginning finds that the username has not been changed.
await User.updateOne({email:ndata.email},ndata)
// This simply updates the user's profile with any other changed information (like their name or profile picture), without performing the extra checks and updates related to the username.
}

}






