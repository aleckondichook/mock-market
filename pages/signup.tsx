import type { NextPage } from "next"
import type { SignupFormData } from "../interfaces"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
import { withSessionSsr } from "../lib/withSession"
import { prisma } from "../lib/prisma"
import toast, { Toaster } from "react-hot-toast"

const Signup: NextPage = (allTraders: any) => {

  const [colorToggle, setColorToggle] = useState<boolean>(false)
  const [nameEmpty, setNameEmpty] = useState<boolean>(false)
  const [emailEmpty, setEmailEmpty] = useState<boolean>(false)
  const [passwordEmpty, setPasswordEmpty] = useState<boolean>(false)
  const [formDataObject, setFormDataObject] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })

  const router = useRouter()

  const handleKeyDown = (event: { key: string }) => {
    if(event.key === 'Enter') {
      handleSubmit()
    }
  }

  function handleEmpties() {
    if(!formDataObject.firstName) {
      setNameEmpty(true)
    }
    if(!formDataObject.email) {
      setEmailEmpty(true)
    }
    if(!formDataObject.password) {
      setPasswordEmpty(true)
    }
    if(!formDataObject.firstName || !formDataObject.email || !formDataObject.password) {
      toast.error("please enter all required info")
      return false
    }
    else {
      return true
    }
  }
  
  async function handleSubmit() {
    changeColor()
    setNameEmpty(false)
    setEmailEmpty(false)
    setPasswordEmpty(false)

    const traderExist = allTraders.allTraders.some((trader: { email: string }) => trader.email === formDataObject.email)
    if(traderExist) {
      toast.error("this account already exists")
      setEmailEmpty(true)
      return
    }

    if(!handleEmpties()) {
      return
    }
    else {
      await fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify(formDataObject)
      })
        .then(json => json.json())
        .then(data => data.result === "success" ? toast.success("successfully signed up") : toast.error("error signing up"))
        setFormDataObject({firstName: '', lastName: '', email: '', password: ''})
        setTimeout(() => {
          router.push('/login')
        }, 2000)
    }
  }

  function changeColor() {
    setColorToggle(true)
    setTimeout(() => {
      setColorToggle(false)
    }, 2000)
  }

  return (
    <div className="flex flex-1">
      <Toaster position="top-center" reverseOrder={true} />
      <div className="mx-auto mt-10 h-[90%] w-[90%] lg:w-[60%] rounded-xl border-2 border-black bg-slate-100 flex flex-col">
        <h1 className="mx-auto text-[50px] mt-10 font-german">signup for mock market</h1>
        <div className="w-[40%] h-[10%] mx-auto mt-10 flex flex-col">
          <span className={`${nameEmpty ? "text-red-600" : "text-black"}`}>first name</span>
          <input className={`rounded-xl py-4 px-4 border-2 ${nameEmpty ? "border-red-600" : "border-black"}`} type="text" value={formDataObject.firstName} onKeyDown={handleKeyDown} onChange={(e) => setFormDataObject(old => ({...old, firstName: e.target.value}))}/>
        </div>
        <div className="w-[40%] h-[10%] mx-auto mt-6 flex flex-col">
          <span>last name</span>
          <input className="rounded-xl py-4 px-4 border-2 border-black" type="text" value={formDataObject.lastName} onKeyDown={handleKeyDown} onChange={(e) => setFormDataObject(old => ({...old, lastName: e.target.value}))}/>
        </div>
        <div className="w-[40%] h-[10%] mx-auto mt-6 flex flex-col">
          <span className={`${emailEmpty ? "text-red-600" : "text-black"}`}>email address</span>
          <input className={`rounded-xl py-4 px-4 border-2 ${emailEmpty ? "border-red-600" : "border-black"}`} type="text" value={formDataObject.email} onKeyDown={handleKeyDown} onChange={(e) => setFormDataObject(old => ({...old, email: e.target.value}))}/>
        </div>
        <div className="w-[40%] h-[10%] mx-auto mt-6 flex flex-col">
          <span className={`${passwordEmpty ? "text-red-600" : "text-black"}`}>password</span>
          <input className={`rounded-xl py-4 px-4 border-2 ${passwordEmpty ? "border-red-600" : "border-black"}`} type="text" value={formDataObject.password} onKeyDown={handleKeyDown} onChange={(e) => setFormDataObject(old => ({...old, password: e.target.value}))}/>
        </div>
        <button className={`rounded-xl py-2 px-6 bg-white hover:bg-black border-2 border-black hover:border-white hover:text-white font-german text-[28px] w-[25%] mx-auto mt-12 ${colorToggle ? "bg-black text-white border-white" : "bg-white text-black border-black"}`} onClick={handleSubmit} id="home-button">signup</button>
        <div className="mx-auto mt-6">
          <Link href="/login"><span className="hover:underline">back to login</span></Link>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const trader = req.session.trader

    if(trader) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    const allTraders = await prisma.trader.findMany()

    return {
      props: {
        allTraders
      }
    }
  }
)

export default Signup