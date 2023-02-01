import type { NextPage } from "next"
import type { FormData } from "../interfaces"
import { useState } from "react"

const Signup: NextPage = () => {

  const [formDataObject, setFormDataObject] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })

  async function handleSubmit() {
    await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(formDataObject)
    }).then((json) => console.log(json))
    console.log('just posted to api/signup yo')
  }

  return (
    <div className="flex flex-1">
      <div className="mx-auto mt-20 h-[70%] w-[50%] rounded-xl border-2 border-slate-700 flex flex-col">
        <h1 className="mx-auto text-[40px] mt-10">signup to mock market</h1>
        <div className="w-[35%] h-[10%] mx-auto mt-10 flex flex-col">
          <span>first name</span>
          <input className="rounded-xl py-2 px-2 border-2 border-black" type="text" onChange={(e) => setFormDataObject(old => ({...old, firstName: e.target.value}))}/>
        </div>
        <div className="w-[35%] h-[10%] mx-auto mt-4 flex flex-col">
          <span>last name</span>
          <input className="rounded-xl py-2 px-2 border-2 border-black" type="text" onChange={(e) => setFormDataObject(old => ({...old, lastName: e.target.value}))}/>
        </div>
        <div className="w-[35%] h-[10%] mx-auto mt-4 flex flex-col">
          <span>email address</span>
          <input className="rounded-xl py-2 px-2 border-2 border-black" type="text" onChange={(e) => setFormDataObject(old => ({...old, email: e.target.value}))}/>
        </div>
        <div className="w-[35%] h-[10%] mx-auto mt-4 flex flex-col">
          <span>password</span>
          <input className="rounded-xl py-2 px-2 border-2 border-black" type="text" onChange={(e) => setFormDataObject(old => ({...old, password: e.target.value}))}/>
        </div>
        <button className="rounded-xl py-3 px-8 bg-slate-300 hover:bg-slate-500 mx-auto mt-16" onClick={handleSubmit}>signup</button>
      </div>
    </div>
  )
}

export default Signup