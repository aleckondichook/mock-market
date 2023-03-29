import { useRouter } from "next/router"
import Custom500 from "./../500"
import useSwr from "swr"

export default function StockInfo(holdings: {"holdings": number}) {

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { query } = useRouter()

  const { data, error, isLoading } = useSwr(`/api/info/${query.ticker}`, fetcher)

  if (!data || data.result === "failure") return <div className="font-german mx-auto mt-14 text-[34px]">error loading data</div>

  return (
    <div className="flex flex-row w-[60%]">
      <div className="flex flex-col w-[50%]">
        <h2 className="font-german text-[25px]">current holdings</h2>
        <h3>{holdings.holdings} {holdings.holdings > 1 || holdings.holdings == 0 ? "shares" : "share"}</h3>
        <h2 className="font-german text-[25px] mt-3">52-week high</h2>
        <h3>${data?.high ? data.high.toLocaleString('en-US', { maximumFractionDigits: 2 }) : "0"}</h3>
        <h2 className="font-german text-[25px] mt-3">52-week low</h2>
        <h3>${data?.low ? data.low.toLocaleString('en-US', { maximumFractionDigits: 2 }) : "0"}</h3>
      </div>
      <div className="flex flex-col w-[50%] ml-6">
        <h2 className="font-german text-[25px]">market cap</h2>
        <h3>${data?.marketCap ? (data.marketCap / 1000).toLocaleString('en-US', { maximumFractionDigits: 2 }) : "0"}B</h3>
        <h2 className="font-german text-[25px] mt-3">P/E ratio</h2>
        <h3>{data?.peRatio ? data.peRatio.toLocaleString('en-US', { maximumFractionDigits: 2 }) : "0"}%</h3>
        <h2 className="font-german text-[25px] mt-3">dividend yield</h2>
        <h3>{data?.dividend ? data.dividend.toLocaleString('en-US', { maximumFractionDigits: 2 }) : "0"}%</h3>
      </div>
    </div>
  )
}