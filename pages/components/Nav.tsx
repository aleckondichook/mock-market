import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import Hamburger from "./Hamburger"

export default function Nav() {

  const [navOpen, setNavOpen] = useState<boolean>(false)
  const [isDesktop, setIsDesktop] = useState<boolean>(true)

  useEffect(() => {
    updateDimensions()

    window.addEventListener("resize", updateDimensions)
  
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  function updateDimensions() {
    if(window.innerWidth > 1024) {
      setIsDesktop(true)
    }
    else {
      setIsDesktop(false)
    }
  }

  function handleToggle() {
    setNavOpen(prev => !prev)
  }


  return (
    <nav className="top-0 z-50 py-8 px-4 lg:px-24 min-w-screen">
      <div className="flex flex-row items-center justify-between">
        <Link href="/"><div className="flex flex-row items-center hover:opacity-30 ">
          <Image className="mr-5" src="/logo.png" alt="logo" width="75" height="75"/>
          <span className="font-german text-[36px]">Mock Market</span>
        </div></Link>
        {
          isDesktop && <div className="flex flex-row space-x-8">
            <Link href="/trade/search"><button className="py-3 px-8 border-2 hover:border-white hover:bg-black hover:text-white border-black rounded-xl font-german text-[20px]" id="home-button">search</button></Link>
            <Link href="/leaderboard"><button className="py-3 px-8 border-2 hover:border-white hover:bg-black hover:text-white border-black rounded-xl font-german text-[20px]" id="home-button">leaderboard</button></Link>
            <Link href="/dashboard"><button className="py-3 px-8 border-2 hover:border-white hover:bg-black hover:text-white border-black rounded-xl font-german text-[20px]" id="home-button">dashboard</button></Link>
          </div>
        }
        {
          !isDesktop && <div onClick={handleToggle}>
            <Hamburger />
          </div>
        }
        {
          navOpen && <div className="h-[50vh] w-[90vw] bg-slate-200 mt-[600px] flex flex-col absolute justify-center items-center rounded-2xl opacity-95">
            <Link className="mt-7 font-bold text-[24px] hover:underline" onClick={handleToggle} href="/trade/search">search</Link>
            <Link className="mt-7 font-bold text-[24px] hover:underline" onClick={handleToggle} href="/leaderboard">leaderboard</Link>
            <Link className="mt-7 font-bold text-[24px] hover:underline" onClick={handleToggle} href="/dashboard">dashboard</Link>              
          </div>
        }
      </div>
    </nav>
  )
}