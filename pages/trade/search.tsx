import { useRouter } from "next/router"
import type { NextPage } from "next"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"

const Search: NextPage = () => {

  const [inputText, setInputText] = useState<string>('')
  const [colorToggle, setColorToggle] = useState<boolean>(false)
  const [existsError, setExistsError] = useState<boolean>(false)

  const router = useRouter()

  async function stockSearch() {
    changeColor()
    if(!inputText) {
      return
    }
    const { exists } = await checkTicker()
    if(exists === "no") {
      toast.error("this stock does not exist")
      setExistsError(true)
    }
    else {
      router.push(`/trade/${inputText}`)
    }
  }

  async function checkTicker() {
    return await fetch(`/api/search/${inputText}`)
      .then((response) => response.json())
      .then((data) => {
        return data
      })
  }

  const handleKeyDown = (event: { key: string }) => {
    if(event.key === 'Enter') {
      stockSearch()
    }
  }

  function changeColor() {
    setColorToggle(true)
    setTimeout(() => {
      setColorToggle(false)
    }, 2000)
  }

  return (
    <div className="min-w-screen flex flex-col flex-1">
      <Toaster position="top-center" reverseOrder={true} />
      <div className="flex flex-col justify-center mt-24 w-[90%] lg:w-[40%] mx-auto border-2 border-black bg-slate-100 rounded-2xl py-6" id="home-button">
        <h1 className="mx-auto text-[45px] font-german">search for a stock</h1>
        <div className="w-[75%] lg:w-[50%] mx-auto flex flex-col mt-10">
          <span className={`${existsError ? "text-red-600" : "text-black"}`}>ticker</span>
          <input className={`${existsError ? "border-red-600" : "border-black"} outline-0 py-2 px-5 bg-white border-2 border-black font-german text-[24px] rounded-xl`} type="text" onKeyDown={handleKeyDown} onChange={(e) => setInputText(e.target.value)} value={inputText.toUpperCase()} />
        </div>
        <button className={`py-2 px-10 border-2 border-black bg-white hover:bg-black hover:border-white hover:text-white mt-14 mx-auto rounded-xl w-[50%] lg:w-[25%] font-german text-[24px] ${colorToggle ? "bg-black text-white border-white" : "bg-white text-black border-black"}`} id="home-button" onClick={stockSearch}>search</button>
      </div>
    </div>
  )
}

export default Search