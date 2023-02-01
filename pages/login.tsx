import type { NextPage } from "next"
import Link from "next/link"

const Login: NextPage = () => {
  return (
    <div className="flex flex-1">
      <div className="mx-auto mt-20 h-[70%] w-[50%] rounded-xl border-2 border-slate-700 flex flex-col">
        <h1 className="mx-auto text-[40px] mt-10">login to mock market</h1>
        <div className="w-[40%] h-[10%] mx-auto mt-20">
          <span>email</span>
          <input className="rounded-xl py-4 px-10 border-2 border-black" type="text" />
        </div>
        <div className="w-[40%] h-[10%] mx-auto mt-12">
          <span>password</span>
          <input className="rounded-xl py-4 px-10 border-2 border-black" type="text" />
        </div>
        <button className="rounded-xl py-3 px-8 bg-slate-300 hover:bg-slate-500 mx-auto mt-16">login</button>
        <div className="mx-auto mt-10">
          <Link href="/signup"><span className="hover:underline">if you do not have an account, please sign up here</span></Link>
        </div>
      </div>
    </div>
  )
}

export default Login