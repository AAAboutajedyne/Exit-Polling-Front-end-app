import LoadingIcon from "./LoadingIcon";

export default function LoadingBanner({text}: {text: string}) {
  return (
    <div className="w-[50%] bg-gray-100 rounded-lg px-[10px] py-[10px]">
      <div className="flex items-center gap-2 animate-pulse">
        <LoadingIcon /> {text}
      </div>

    </div>
  )
}