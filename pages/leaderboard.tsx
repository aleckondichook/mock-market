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

  const leaderboardData = useLeaderboard(data)

  return (
    <div className="flex flex-col flex-1">
      <div className="mt-24 mx-auto">
        {
          leaderboardData.sort((a, b) => b.value - a.value).map((data) => {
            return <div key={data.trader.id}>
              <span>{data.trader.firstName} {data.trader.lastName} ${data.value.toFixed(2)}</span>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default Leaderboard