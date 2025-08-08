import NextAuth from 'next-auth'
// This imports the main NextAuth function.

// import AppleProvider from 'next-auth/providers/apple'
// import FacebookProvider from 'next-auth/providers/facebook'
// import GoogleProvider from 'next-auth/providers/google'
// import EmailProvider from 'next-auth/providers/email'

import GitHubProvider from 'next-auth/providers/github'
// This imports the specific logic for allowing users to sign in with their GitHub accounts.
import mongoose from 'mongoose'
import User from '@/models/User'
// This imports your User model, which is used to interact with the user data in your database.
import Payment from '@/models/Payment'
import connectDb from '@/db/connectDb'
 export const authoptions = NextAuth({
  // This defines and exports your main authentication configuration object.
  providers: [
    // OAuth authentication providers...
    // This array lists all the sign-in methods you want to offer.
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    // AppleProvider({
    //   clientId: process.env.APPLE_ID,
    //   clientSecret: process.env.APPLE_SECRET
    // }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET
    // }),
    // // Passwordless / email sign in
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: 'NextAuth.js <no-reply@example.com>'
    // }),
  ],
  callbacks: {
    // Callbacks are special functions that run at specific points in the authentication process, allowing you to customize the default behavior.
  async signIn({ user, account, profile, email, credentials }) {
    // This function runs every time a user tries to sign in.
    if(account.provider=="github"){
      // It checks if the sign-in attempt is from GitHub.
    await connectDb()
    // check if the user already exist in database
    const currentUser = await User.findOne({email:email})
    // It checks if a user with this email already exists in your database.
    if(!currentUser){
    // If the user does not exist, create new user
    const newUser = await User.create({
      email:user.email,
      username:user.email.split("@")[0],
    }) 
// user.email.split("@") splits the string at the @ into an array: ['johndoe', 'example.com'].

// [0] then takes the first item from that array (at index 0), which is "johndoe".

// This result is then assigned as the value for the username.
    }
    return true
    }
  },
      async session({ session, user, token }) {
          await connectDb();  // added from chatgpt
        const dbUser = await User.findOne({email:session.user.email})
        session.user.name = dbUser.username
      return session
    },
    // Its main purpose is to replace the default username from GitHub with the username stored in your own database.
}
})

export {authoptions as GET, authoptions as POST}















