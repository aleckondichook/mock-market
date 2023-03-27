import type { NextPage } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"
import { LoginFormData } from "../interfaces"
import { withSessionSsr } from "../lib/withSession"
import { prisma } from "../lib/prisma"
import toast, { Toaster } from "react-hot-toast"
import bcrypt from "bcryptjs"
import { useRouter } from "next/router"

const Login: NextPage = (allTraders: any) => {

  const [queryTicker, setQueryTicker] = useState<string>('')
  const [noAccountExist, setNoAccountExist] = useState<boolean>(false)
  const [noPasswordMatch, setNoPasswordMatch] = useState<boolean>(false)
  const [colorToggle, setColorToggle] = useState<boolean>(false)
  const [formDataObject, setFormDataObject] = useState<LoginFormData>({
    email: "",
    password: ""
  })

  useEffect(() => {
    const url: string[] = window.location.href.split('=')
    if(url[1]) {
      setQueryTicker(url[1])
    }
  }, [])
  
  const router = useRouter()

  const handleKeyDown = (event: { key: string }) => {
    if(event.key === 'Enter') {
      handleSubmit()
    }
  }
  
  async function handleSubmit() {
    changleColor()
    setNoPasswordMatch(false)
    setNoAccountExist(false)
    const checkTrader = allTraders.allTraders.find((trader: { email: string }) => trader.email === formDataObject.email)
    
    if(!checkTrader) {
      toast.error("this account does not exist")
      setNoAccountExist(true)
      return
    }

    const hashPassword = checkTrader.password
    const passwordMatch = await bcrypt.compare(formDataObject.password, hashPassword)

    if(!passwordMatch) {
      toast.error("your password is incorrect")
      setNoPasswordMatch(true)
      return
    }

    await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formDataObject)
    })

    if(!queryTicker) {
      router.push('/dashboard')
    }
    else {
      router.push(`/trade/${queryTicker}`)
    }
  }

  function changleColor() {
    setColorToggle(true)
    setTimeout(() => {
      setColorToggle(false)
    }, 2000)
  }

  return (
    <div className="flex flex-1">
      <Toaster position="top-center" reverseOrder={true} />
      <div className="mx-auto mt-20 h-[70%] w-[90%] lg:w-[50%] rounded-2xl border-2 border-black bg-slate-100 flex flex-col">
        <h1 className="mx-auto text-[50px] mt-10 font-german">login to mock market</h1>
        <div className="w-[75%] lg:w-[40%] h-[10%] mx-auto mt-10 flex flex-col">
          <span className={`${noAccountExist ? "text-red-600" : "text-black"}`}>email</span>
          <input className={`rounded-xl py-4 px-4 border-2 ${noAccountExist ? "border-red-600" : "border-black"}`} type="text" value={formDataObject.email} onKeyDown={handleKeyDown} onChange={(e) => setFormDataObject(old => ({...old, email: e.target.value}))}/>
        </div>
        <div className="w-[75%] lg:w-[40%] h-[10%] mx-auto mt-12 flex flex-col">
          <span className={`${noPasswordMatch ? "text-red-600" : "text-black"}`}>password</span>
          <input className={`rounded-xl py-4 px-4 border-2 ${noPasswordMatch ? "border-red-600" : "border-black"}`} type="text" value={formDataObject.password} onKeyDown={handleKeyDown} onChange={(e) => setFormDataObject(old => ({...old, password: e.target.value}))}/>
        </div>
        <button className={`rounded-xl py-2 px-6 bg-white hover:bg-black border-2 border-black hover:border-white hover:text-white font-german text-[28px] w-[50%] lg:w-[25%] mx-auto mt-20 ${colorToggle ? "bg-black text-white border-white" : "bg-white text-black border-black"}`} onClick={handleSubmit} id="home-button" >login</button>
        <div className="mx-auto mt-6">
          <Link href="/signup"><span className="hover:underline">if you do not have an account, please sign up here</span></Link>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const trader = req.session.trader
    let allTraders

    if(trader) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
        }
      }
    }

    try {
      allTraders = await prisma.trader.findMany()
    }
    catch(e) {
      return {
        redirect: {
          destination: '/500',
          permanent: false
        }
      }
    }

    return {
      props: {
        allTraders
      }
    }
  }
)

export default Login