"use client";
import { User } from "@/models/user.model";
import { ReactNode, createContext, memo, useContext, useEffect, useState } from "react";
import { http } from "../apis";

export const CurrentUserContext = createContext<User | null>(null)


export const CurrentUserProvider = memo(function (
  { userId = undefined, children }: {userId?: string | undefined, children: ReactNode }
) {
  console.group("[CurrentUserProvider]");
  console.log("userId: ", userId)
  
  const [user, setUser] = useState<User | null>(null)
  
  useEffect(() => {
    console.log(`running user effect...`)
    if(userId) {
      console.log(`retrieving user ${userId}...`)
      const fetchUser = async () => {
        const user = await http.get(`/users/${userId}`, {
          next: { revalidate: 600 /*= 10min */ }
        }) as User
        setUser(user)
      }
      fetchUser()
        .catch(console.error);
    } else {
      console.log(`setting user to null...`)
      setUser(null)
    }
    
  }, [userId])
  

  console.groupEnd()

  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  )
}, 
(prevProps, nextProps) => prevProps.userId === nextProps.userId)


export function useCurrentUser() {
  const context = useContext(CurrentUserContext)
  if(context === undefined) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider")
  }

  return context
}

export function CurrentUser() {
  const user = useCurrentUser()

  return (
    <div>CurrentUser: {user?.email}</div>
  )
}