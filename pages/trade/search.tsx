import Router, { useRouter } from "next/router"
import type { NextPage } from "next"
import { useState } from "react"

const Search: NextPage = () => {

  const [inputText, setInputText] = useState<string>('')
  const [colorToggle, setColorToggle] = useState<boolean>(false)

  function stockSearch() {
    changeColor()
    if(!inputText) {
      return
    }
    Router.push(`/trade/${inputText}`)
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
      <div className="flex flex-col justify-center mt-24 w-[90%] lg:w-[40%] mx-auto border-2 border-black bg-slate-100 rounded-2xl py-6">
        <h1 className="mx-auto text-[45px] font-german">search for a stock</h1>
        <input className="outline-0 py-2 px-5 bg-white border-2 border-black font-german text-[24px] rounded-xl w-[75%] lg:w-[50%] mx-auto mt-14" type="text" onKeyDown={handleKeyDown} onChange={(e) => setInputText(e.target.value)} value={inputText.toUpperCase()} />
        <button className={`py-2 px-10 border-2 border-black bg-white hover:bg-black hover:border-white hover:text-white mt-14 mx-auto rounded-xl w-[50%] lg:w-[25%] font-german text-[24px] ${colorToggle ? "bg-black text-white border-white" : "bg-white text-black border-black"}`} id="home-button" onClick={stockSearch}>search</button>
      </div>
    </div>
  )
}

export default Search