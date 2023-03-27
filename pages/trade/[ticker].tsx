import type { NextPage } from "next"
import { withSessionSsr } from "../../lib/withSession"
import { prisma } from "../../lib/prisma"
import { useState } from "react"
import { useRouter } from "next/router"
import toast, { Toaster } from "react-hot-toast"
import Loading from "../components/Loading"
import StockInfo from "../components/StockInfo"
import TradeGraph from "../components/TradeGraph"
import Custom500 from "../500"
import Link from "next/link"
import useSwr from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Ticker: NextPage = (account: any) => {

  const [orderAmount, setOrderAmount] = useState<number | null>(null)
  const [recentTrade, setRecentTrade] = useState<string>('')
  const [holdingsError, setHoldingsError] = useState<boolean>(false)
  const [orderError, setOrderError] = useState<boolean>(false)

  const { query } = useRouter()
  const { data, error, isLoading } = useSwr(`/api/candles/${query.ticker}`, fetcher)
  const { data: data1, error: error1, isLoading: isLoading1 } = useSwr(`/api/quotes/${query.ticker}`, fetcher)
  
  if (isLoading || isLoading1) return <Loading />
  if (!data || !data1 || data.result === "failure" || data1.result === "failure" || data.year.s === "no_data" || data.day.s === "no_data" || data1 === "no_data" ) return <Custom500 />

  function checkHoldings(): number {
    let holdings: number = 0
    account.traderTrades.forEach((trade: any) => {
      if(trade.ticker.toUpperCase() === query.ticker && trade.direction === "BUY") {
        holdings += trade.amount
      }
      if(trade.ticker.toUpperCase() === query.ticker && trade.direction === "SELL") {
        holdings -= trade.amount
      }
    })
    return holdings
  }

  async function trade(data: any) {
    try {
      fetch('http://localhost:3000/api/fill', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then(() => setRecentTrade(`you just ${data.direction === "BUY" ? "bought" : "sold"} ${JSON.stringify(data.amount)} ${data.amount > 1 ? "shares" : "share"} of ${data.ticker.toUpperCase()} for $${(data.amount * data.price).toLocaleString('en-US', { maximumFractionDigits: 2 })}`))
    }
    catch (e) {
      console.log('whoops', e)
    }
  }

  async function handleBuy() {
    setOrderError(false)
    if(!orderAmount) {
      setOrderError(true)
      return
    }
    const buyData: any = {
      trader: {
        connect: {
          id: account.trader.id
        }
      },
      ticker: query.ticker,
      amount: orderAmount,
      price: data1.c,
      direction: "BUY"
    }
    await trade(buyData)
    toast.success("trade successful")
  }

  async function handleSell() {
    setHoldingsError(false)
    setOrderError(false)
    if(!orderAmount) {
      toast.error("amount is empty")
      setOrderError(true)
      return
    }
    if(checkHoldings() >= orderAmount) {
      const sellData: any = {
        trader: {
          connect: {
            id: account.trader.id
          }
        },
        ticker: query.ticker,
        amount: orderAmount,
        price: data1.c,
        direction: "SELL"
      }
      await trade(sellData)
      toast.success("trade successful")
    }
    else {
      toast.error("you do not hold enough shares")
      setHoldingsError(true)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row mt-24 justify-around px-28 flex-1">
      <Toaster position="top-center" reverseOrder={true} />
      <TradeGraph data={data}/>
      <div className="flex flex-col w-[50%] bg-slate-100 border-2 border-black rounded-xl h-[70%] ml-10 mt-8 px-10">
        <div className="mt-5 flex flex-col">
          <span className="text-[46px] font-german">${typeof query.ticker === "string" ? (query.ticker).toUpperCase() : ""}</span>
          <span className="ml-2 text-[26px]">${data1.c.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
        </div>
        {
          account.loggedIn && 
          <div className="flex flex-row">
            <div className="flex flex-col mt-8 w-[50%] ml-5">
              <div className="flex flex-col">
                <span>amount</span>
                <input className={`px-6 py-3 w-[70%] ${orderError || holdingsError ? "border-red-600" : "border-black"} outline-0 bg-white border-2 border-black rounded-xl`} type="number" onChange={(e) => setOrderAmount(parseInt(e.target.value))}/>
              </div>
              <div className="flex flex-row justify-around w-[70%] mt-6">
                <button className="px-8 py-2 rounded-xl border-2 border-black bg-white font-german text-[20px] hover:bg-green-500" id="home-button" onClick={handleBuy}>buy</button>
                <button className="px-8 py-2 rounded-xl border-2 border-black bg-white font-german text-[20px] hover:bg-red-500" id="home-button" onClick={handleSell} >sell</button>
              </div>
            </div>
            <StockInfo holdings={checkHoldings()} />
          </div>
        }
        <h3 className="mx-auto mt-14 font-german text-[30px]">{recentTrade && recentTrade}</h3>
        {
          !account.loggedIn && <div className="flex mt-12 mx-auto">
            <Link href={`/login/?lastpage=${query.ticker}`}><span className="text-[46px] hover:underline font-german">please login or signup here</span></Link>
          </div>
        }
      </div>
    </div>
  )
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const trader = req.session.trader
    let loggedIn = true

    if(trader) {
      const traderAccount = await prisma.trader.findFirst({
        where: {
          email: trader.email
        }
      })

      const traderTrades = await prisma.trade.findMany({
        where: {
          traderId: trader.id
        }
      })
  
      return {
        props: {
          trader: traderAccount,
          loggedIn: loggedIn,
          traderTrades: JSON.parse(JSON.stringify(traderTrades))
        }
      }
    }
    else {
      loggedIn = false
      return {
        props: {
          trader: {
            email: "",
            firstName: "",
            id: "",
            lastName: "",
            password: ""
          },
          loggedIn: loggedIn,
          traderTrades: []
        }
      }
    }
    
  }
)

export default Ticker