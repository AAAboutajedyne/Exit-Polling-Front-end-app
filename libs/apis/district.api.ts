import "server-only"
import { District } from "@/models/district.model"
import { http } from "."

/**
 * get district from cache (cause GET /districts is already performed when visiting HomePage)
 * @param id 
 * @returns 
 */
export async function getDistrictById(id: string) {
  const districts = await http.get(
    "/districts", {
      next: { revalidate: 24 * 3600 }
    }
  ) as District[]

  return districts
    .filter(district => district.id.toString() === id)
    .at(0) as District | undefined
}