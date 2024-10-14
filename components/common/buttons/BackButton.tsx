import { ArrowLeftCircle } from "react-feather";
import IconButton from "./IconButton";
import Link from "next/link";

export function BackButton({backUrl}: {backUrl: string}) {
  return (
    <Link href={backUrl}>
      <IconButton IconRef={ArrowLeftCircle} label="Back" className="btn-white" />
    </Link>
  )
}