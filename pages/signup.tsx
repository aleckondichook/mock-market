import type { NextPage } from "next"
import type { SignupFormData } from "../interfaces"
import { useState } from "react"
import { useRouter } from "next/router"
import { withSessionSsr } from "../lib/withSession"
import { prisma } from "../lib/prisma"
import toast, { Toaster } from "react-hot-toast"

const Signup: NextPage = (allTraders: any) => {

  const [formSuccess, setFormSuccess] = useState<boolean>(false)
  const [formFailure, setFormFailure] = useState<boolean>(false)
  const [nameEmpty, setNameEmpty] = useState<boolean>(false)
  const [emailEmpty, setEmailEmpty] = useState<boolean>(false)
  const [passwordEmpty, setPasswordEmpty] = useState<boolean>(false)
  const [formEmpty, setFormEmpty] = useState<boolean>(false)
  const [formDataObject, setFormDataObject] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })

  const router = useRouter()

  function handleEmpties() {
    setNameEmpty(false)
    setEmailEmpty(false)
    setPasswordEmpty(false)
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
      setFormEmpty(true)
      return false
    }
    else {
      return true
    }
  }

  async function handleSubmit() {
    setFormEmpty(false)
    setFormSuccess(false)
    setFormFailure(false)

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
        .then(data => data.result === "success" ? setFormSuccess(true) : setFormFailure(true))
        setFormDataObject({firstName: '', lastName: '', email: '', password: ''})
        setTimeout(() => {
          router.push('/login')
        }, 2000)
    }
  }

  return (
    <div className="flex flex-1">
      <Toaster position="top-center" reverseOrder={true} />
      <div className="mx-auto mt-20 h-[75%] w-[50%] rounded-xl border-2 border-slate-700 flex flex-col">
        <h1 className="mx-auto text-[40px] mt-10">signup to mock market</h1>
        <div className="w-[35%] h-[10%] mx-auto mt-10 flex flex-col">
          <span className={`${nameEmpty ? "text-red-600" : "text-black"}`}>first name</span>
          <input className={`rounded-xl py-2 px-2 border-2 ${nameEmpty ? "border-red-600" : "border-black"}`} type="text" value={formDataObject.firstName} onChange={(e) => setFormDataObject(old => ({...old, firstName: e.target.value}))}/>
        </div>
        <div className="w-[35%] h-[10%] mx-auto mt-4 flex flex-col">
          <span>last name</span>
          <input className="rounded-xl py-2 px-2 border-2 border-black" type="text" value={formDataObject.lastName} onChange={(e) => setFormDataObject(old => ({...old, lastName: e.target.value}))}/>
        </div>
        <div className="w-[35%] h-[10%] mx-auto mt-4 flex flex-col">
          <span className={`${emailEmpty ? "text-red-600" : "text-black"}`}>email address</span>
          <input className={`rounded-xl py-2 px-2 border-2 ${emailEmpty ? "border-red-600" : "border-black"}`} type="text" value={formDataObject.email} onChange={(e) => setFormDataObject(old => ({...old, email: e.target.value}))}/>
        </div>
        <div className="w-[35%] h-[10%] mx-auto mt-4 flex flex-col">
          <span className={`${passwordEmpty ? "text-red-600" : "text-black"}`}>password</span>
          <input className={`rounded-xl py-2 px-2 border-2 ${passwordEmpty ? "border-red-600" : "border-black"}`} type="text" value={formDataObject.password} onChange={(e) => setFormDataObject(old => ({...old, password: e.target.value}))}/>
        </div>
        <button className="rounded-xl py-3 px-8 bg-slate-300 hover:bg-slate-500 mx-auto mt-8" onClick={handleSubmit}>signup</button>
        <div className="mt-4 flex mx-auto">
          {
            formSuccess && <p className="text-green-600">created new account</p>
          }
          {
            formFailure && <p className="text-red-600">error creating account</p>
          }
          {
            formEmpty && <p className="text-red-600">please enter all required info</p>
          }
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