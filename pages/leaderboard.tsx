import { NextPage } from "next"
import { useState, useEffect } from "react"
import useLeaderboard from "./hooks/useLeaderboard"
import Custom500 from "./500"
import Loading from "./components/Loading"
import useSwr from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Leaderboard: NextPage = () => {
  
  const { data, error, isLoading } = useSwr(`api/leaderboard`, fetcher)
  if (isLoading) return <Loading />
  if (!data || data.result === "failure") return <Custom500 />

  const leaderboardData = useLeaderboard(data).sort((a, b) => b.value - a.value)

  return (
    <div className="flex flex-col flex-1">
      <h1 className="font-german mx-auto text-[60px] mt-10">mock market leaderboard</h1>
      <div className="mt-8 mx-auto w-[60%] h-[70%] border-2 border-black bg-slate-100 rounded-xl flex flex-row px-64 overflow-auto pb-10" id="hide-scrollbar">
        <div className="flex flex-col w-[50%] items-center">
          <h1 className="font-german text-[30px] underline mt-5">trader</h1>
          {
            leaderboardData.map((data) => {
              return <div className="w-[100%] border-b-2 border-slate-300 flex justify-center mt-3" key={data.trader.id}>
                <span className="font-german text-[20px]">{data.trader.firstName} {data.trader.lastName}</span>
              </div>
            })
          }
        </div>
        <div className="flex flex-col w-[50%] items-center">
          <h1 className="font-german text-[30px] underline mt-5">portfolio value</h1>
          {
            leaderboardData.map((data) => {
              return <div className="w-[100%] border-b-2 border-slate-300 flex justify-center mt-3" key={data.trader.id}>
                <span className="text-[20px]">${data.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
              </div>
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Leaderboard