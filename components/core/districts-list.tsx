import { http } from '@/libs/apis'
import { District } from '@/models/district.model'
import Link from 'next/link'
import React from 'react'

async function getData() {
  return await http.get(
    "/districts", {  next: { revalidate: 24 * 3600 }
                              //   -----------------------------
                              //.[NOTE] on time-based revalidations
                              // .. in this case after 10m, the next request will:
                              //  ..A still return the cached (now stale) data
                              //  ..B trigger a revalidation of the data in the background
                              //  ..C once the data is fetched:
                              //    ...a successfully, Next.js will update the Data Cache with the fresh data.
                              //    ...b unsuccessfully, the previous data will be kept unaltered.
  }) as District[]
}

export default async function DistrictsList({hrefPrefix}) {
  const districts = await getData()
  return (
    <ul className="text-lg underline leading-10">
      {districts &&
        districts.map(district => (
          <li key={district.id} className="tansition-all hover:opacity-45">
            <Link
              href={`${hrefPrefix}/${district.id}`}
              className="link pointer dark-gray"
            >
              {district.name}
            </Link>
          </li>
        ))}
    </ul>
  )
}
