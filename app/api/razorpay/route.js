//  This file is a backend API route that acts as a secure webhook to verify payments from Razorpay.
import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/models/Payment";
import Razorpay from "razorpay";
import connectDB from "@/db/connectDb";
import User from "@/models/User";
export const POST = async (req) => {
// This defines a function that handles incoming POST requests sent to this API route (/api/razorpay). Razorpay sends data here after a user completes a payment.
await connectDB()
let body = await req.formData()
body = Object.fromEntries(body)
// This reads the data sent from Razorpay and converts it into a simple JavaScript object. This body contains the payment details and a cryptographic signature.

let p = await Payment.findOne({oid: body.razorpay_order_id})
// It looks in your own database to make sure the order ID from Razorpay matches an order your server actually created.
if(!p){
return NextResponse.json({success:false,message:"order id not found"})
// If the order ID is not found in your database, it means something is wrong, so it stops and returns an error.
}


let user = await User.findOne({username:p.to_user})
// It finds the user who is supposed to receive the payment.
const secret = user.razorpaysecret
// It retrieves that specific user's private Razorpay secret key. This is essential for the verification step.
// verify the payment

let xx = validatePaymentVerification({"order_id": body.razorpay_order_id,"payment_id": body.razorpay_payment_id},body.razorpay_signature,secret) 
// This is the core verification step. It uses a secure utility from Razorpay to check if the payment is authentic by comparing a self-generated signature with the one Razorpay sent.
// process.env.RAZORPAY_SECRET
if(xx){
// update the payment status

const updatedPayment = await Payment.findOneAndUpdate({oid:body.razorpay_order_id},{done:"true"},{new:true})
// It finds the pending payment record in your database and updates its status by setting done to "true".
return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to_user}?paymentdone=true`)
// It redirects the user's browser back to the creator's profile page and adds ?paymentdone=true to the URL. This signals to the frontend that the payment was successful.
}
else{
return NextResponse.json({success:false,message:"payment verification failed"})
}
}





