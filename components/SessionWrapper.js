"use client"
import { SessionProvider } from "next-auth/react"

export default function SessionWrapper({children}) {
   // It takes some children...
  return (
    <SessionProvider>
     {children}
      {/* and place then inside sessionProvider which actually provide login information to childrens */}
    </SessionProvider>
  )
}

// This file says: "I am a component named SessionWrapper. Give me any other components as children, and I will wrap them with a SessionProvider."
// here children is passed by layout.js in which sessionwrapper is taking children as navbar,main page content and footer