import Router, { useRouter } from "next/router"
import type { NextPage } from "next"
import { useState } from "react"

const Search: NextPage = () => {

  const [inputText, setInputText] = useState<string>('')

  function stockSearch() {
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

  return (
    <div className="min-w-screen flex flex-col flex-1">
      <div className="flex flex-col justify-center mt-24 w-[100%]">
        <h1 className="mx-auto text-[40px]">search for a stock</h1>
        <input className="py-5 px-10 bg-slate-300 rounded-xl w-[25%] mx-auto mt-10" type="text" onKeyDown={handleKeyDown} onChange={(e) => setInputText(e.target.value)}/>
        <button className="py-4 px-6 bg-slate-300 hover:bg-slate-500 mt-10 mx-auto rounded-xl w-[10%]" onClick={stockSearch}>search</button>
      </div>
    </div>
  )
}

export default Search