import React from 'react'
import Link from 'next/link';
import { PlusCircle, Edit, Trash2, List, RefreshCw, RefreshCcw } from 'react-feather';
import IconButton from '@/components/common/buttons/IconButton';
import Icon from '@/components/common/Icon';
import { District } from '@models/district.model';
import { http } from '@/libs/apis';
import { deleteDistrictAction, revalidateDistricts } from '@/libs/server-actions/district.server-actions';
import RefreshButton from '@/components/common/buttons/RefreshButton';

async function getData() {
  // . we opt into cahcing by not providing any cache option ([DEFAULTS_TO] "force-cache")
  //   ..[REMINDER] we get stale data, when not using:
  //     .. Time-based revalidation
  //     .. On-demand revalidation (revalidatePath/revalidateTag)
  // .[REMINDER] opting-out explictly with:
  //   .. cache: no-store/no-cache
  //   .. next.revalidate: 0
  //   .. export const dynamic = "force-dynamic"
  //   .. export const revalidate = 0
  return await http.get(
    "/districts", {   next: { revalidate: 24 * 3600 }
                              //    -------------------------------
                              //.[NOTE] on time-based revalidations
                              // .. in this case after 1 day, the next request will:
                              //  ..A still return the cached (now stale) data
                              //  ..B trigger a revalidation of the data in the background
                              //  ..C once the data is fetched:
                              //    ...a successfully, Next.js will update the Data Cache with the fresh data.
                              //    ...b unsuccessfully, the previous data will be kept unaltered.
  }) as District[]
  
}

export default async function DistrictsHomePage() {
  const districts = await getData()
  return (
    <div className='space-y-10'>
      <h1>Districts</h1>

      <table>
        <thead>
          <tr>
            <th colSpan={2}>Name</th>
          </tr>
        </thead>
        <tbody>
          {districts.map(district => (
            <tr key={district.id}>
              <td>{district.name}</td>
              <td>
                <DistrictListActions district={district} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* New district action & refresh action */}
      <div className='actions'>
        <Link href="/districts/new">
          <IconButton IconRef={PlusCircle} label="New District" />
        </Link>
        
        <RefreshButton action={revalidateDistricts}/>
      </div>
    </div>
  );
}

function DistrictListActions({district}: {district: District}) {
  const deleteDistrictActionWithId = deleteDistrictAction.bind(null, district.id.toString())
  return (
    <form className="flex-row justify-end gap-3">
      {/* go to Questions home page */}
      <Link href={`/districts/${district.id}/questions`}>
        <Icon IconRef={List} />
      </Link>

      {/* edit district */}
      <Link href={`/districts/${district.id}/edit`}>
        <Icon IconRef={Edit} />
      </Link>

      {/* delete district */}
      <button type="submit" formAction={deleteDistrictActionWithId}>
        <Icon IconRef={Trash2} />
      </button>
    </form>
  )
}