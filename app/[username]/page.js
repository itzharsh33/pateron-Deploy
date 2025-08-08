// This code represents a dynamic user profile page in a Next.js app. Its main job is to check if a user exists in the database before showing their payment page. If the user doesn't exist, it shows a "Not Found" page.
import PaymentPage from "@/components/PaymentPage";
import React from "react";
import { notFound } from "next/navigation";
import connectDB from "@/db/connectDb";
import User from "@/models/User";
const username = async({ params }) => {
//  This defines a Next.js Server Component for a dynamic route (e.g., yoursite.com/[username]).
// { params } is an object that contains the dynamic parts of the URL.
    const { username } = await params;
// This line uses destructuring to pull the username value out of the params object. For example, if the URL is /johndoe, the username variable will become "johndoe".
    const checkUser = async ()=>{
      // This defines an inner async helper function to handle the logic of checking the database.
    await connectDB()
    // Inside checkUser, this line connects to your MongoDB database.
    let u = await User.findOne({username:username})
    //  It looks inside the User collection for one document where the username field matches the username from the URL.
    if(!u){
    return notFound()
    // If no user (u) is found in the database, it calls the special Next.js notFound() function.
    }
    }
    await checkUser()
// The main component calls and waits for the checkUser function to finish. If checkUser triggered the notFound() function, the code below this line will never execute.
  return (
    <>
<PaymentPage username={username}/>
{/* If checkUser completes successfully (meaning the user was found), this line runs. It renders the PaymentPage component and passes the username to it as a prop. */}
    </>
  );
};

export default username;


