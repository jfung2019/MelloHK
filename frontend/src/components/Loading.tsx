import { LoaderCircle } from "lucide-react"

function Loading() {
  return (
     <div className="flex justify-center items-center min-h-screen w-full">
      <div className='flex gap-2 items-center'>
        <LoaderCircle className='h-10 w-10 animate-spin' />
        Loading...
      </div>
    </div>
  )
}

export default Loading