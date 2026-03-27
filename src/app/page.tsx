import Image from "next/image"
import { ClientComponent } from "./page.client"

export default function Home() {
  return (
    <div className="p-8 flex flex-col gap-4 h-screen items-center justify-center">
      <div className="w-full max-w-2xl">
        <ClientComponent />
      </div>
    </div>
  )
}
