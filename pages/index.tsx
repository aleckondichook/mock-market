import type { NextPage } from "next"

const Home: NextPage = () => {

  return (
    <div className="min-w-screen flex flex-col flex-1">
      <p className="mt-36 text-[65px] lg:text-[100px] text-center font-german">Welcome to Mock Market</p>
      <p className="mx-auto text-[15px] lg:text-[30px]">where the prices are real, but the trades are not</p>
    </div>
  )
}

export default Home