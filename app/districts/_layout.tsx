import NavBar from '@/components/common/NavBar'
import React from 'react'

export default function DistrictLayout(
  {children}: Readonly<{children: React.ReactNode}>
) {
  return (<>
    <NavBar />
    <section className="mt-8">
      <main role="main">
        {/* <p className="info"><%= get_flash(@conn, :info) %></p>
        <p className="error"><%= get_flash(@conn, :error) %></p> */}
        { children }
      </main>
    </section>
  </>)
}
