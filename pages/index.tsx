import type { NextPage } from "next"
import Link from "next/link"

const Home: NextPage = () => {

  return (
    <div className="min-w-screen flex flex-col flex-1">
      <p className="mt-36 text-[65px] lg:text-[100px] text-center font-german">Welcome to Mock Market</p>
      <p className="mx-auto text-[15px] lg:text-[30px]">where the prices are real, but the trades are not</p>
      <Link className="mx-auto mt-10" href="/trade/VICI"><button className="py-3 px-8 border-2 hover:border-white hover:bg-black hover:text-white border-black rounded-xl font-german text-[20px]" id="home-button">trade $VICI</button></Link>
    </div>
  )
}

export default Home