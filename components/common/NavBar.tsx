"use client";
import { useCurrentUser } from '@/libs/contexts/current-user.context';
import { logoutAction } from '@/libs/server-actions/auth.server-action';
import Link from 'next/link'
import React, { startTransition } from 'react'

export default function NavBar() {
  const currentUser = useCurrentUser()
  return (
    <header className='w-auto flex justify-center'>
      <nav className='w-full flex justify-between my-5 text-xl font-medium'>
        <div>
          <Link href="/" className="nav-link">Poller</Link>
        </div>
        <div>
          <div className="flex gap-10">
            {
              currentUser ? (<>
                {/* Districts */}
                {currentUser?.admin && <Link href="/districts" className="nav-link">Districts</Link>}
                
                {/* Poll */}
                <Link href="/poll" className="nav-link">Poll</Link>

                {/* Results */}
                <Link href="/results" className="nav-link">Results</Link>

                {/* Logout */}
                <div className="nav-link" onClick={() => startTransition(logoutAction)}>Logout</div>
              
              </>) : (<>
                {/* Results */}
                <Link href="/results" className="nav-link">Results</Link>
                
                {/* Login */}
                <Link href="/login" className="nav-link">Login</Link>
              </>)
            }
          </div>
        </div>
      </nav>
    </header>
  )
}
