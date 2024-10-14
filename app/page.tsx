import { http } from "@/libs/apis";
import { serverDomainUrl } from "@/libs/apis/constants";
import { CurrentUser } from "@/libs/contexts/current-user.context";
import Link from "next/link";

async function getData() {
  try {
    await http.get("/", { 
      cache: "no-store",
    }, `${serverDomainUrl() + "/"}`)
  } catch {}
  
}

export default async function Home({ searchParams }) {
  // await getData();
  const errorMessage = searchParams.error

  return (<>
    <ErrorPanel message={errorMessage} />

    <h1>Welcome to Exit polling app!</h1>
    {/*
    <CurrentUser />
    
    <div className="mt-10">
      <Link href="/districts" className="underline">go to /districts</Link>
    </div>
    */}
  </>);
}

function ErrorPanel({message}: {message: string | undefined}) {
  return (
    message && (
      <div className="error">
        {message}
      </div>
    )
  )
}