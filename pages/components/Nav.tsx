import Image from "next/image"
import Link from "next/link"

export default function Nav() {
  return (
    <nav className="top-0 py-8 px-36 min-w-screen">
      <div className="flex flex-row items-center justify-between">
        <Link href="/"><Image className="hover:opacity-30" src="/logo.png" alt="logo" width="75" height="75"/></Link>
        <div className="flex flex-row space-x-8">
          <Link href="/trade/search"><button className="py-3 px-8 bg-slate-300 hover:bg-slate-500 rounded-xl">search</button></Link>
          <Link href="/dashboard"><button className="py-3 px-8 bg-slate-300 hover:bg-slate-500 rounded-xl">dashboard</button></Link>
        </div>
      </div>
    </nav>
  )
}