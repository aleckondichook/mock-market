import type { NextPage } from "next"
import { withSessionSsr } from "../../lib/withSession"
import { prisma } from "../../lib/prisma"
import Loading from "../components/Loading"
import Link from "next/link"
import { useRouter } from "next/router"
import useSwr from "swr"
import { useState } from "react"
import { Line } from "react-chartjs-2"
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Ticker: NextPage = (account: any) => {

  const [orderAmount, setOrderAmount] = useState<number | null>(null)
  const [currentHoldings, setCurrentHoldings] = useState<number>(0)
  const [holdingsError, setHoldingsError] = useState<boolean>(false)
  const [orderError, setOrderError] = useState<boolean>(false)

  const { query } = useRouter()
  const { data, error, isLoading } = useSwr(`/api/candles/${query.ticker}`, fetcher)
  const { data: data1, error: error1, isLoading: isLoading1 } = useSwr(`/api/quotes/${query.ticker}`, fetcher)
  
  // if (error || error1) return <div>failed to load users</div>
  if (isLoading || isLoading1) return <Loading />
  if (!data || !data1) return null
  
  const options: any = {
    plugins: {
      legend: {
        display: false
      }
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        borderColor: data.c[0] < data.c[11] ? "rgba(73, 233, 23, 1)" : "rgba(255,3,3,1)",
        fill: "start",
        backgroundColor: data.c[0] < data.c[11] ? "rgba(49, 148, 18, 0.3)" : "rgba(255,3,3,0.3)"
      },
      point: {
        radius: 0,
        hitRadius: 0
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 16
          }
        }
      },
      y: {
        ticks: {
          min: Math.min(...data.c),
          max: Math.max(...data.c),
          stepSize: 10,
          font: {
            size: 16
          }
        }
      }
    }    
  }
  
  const fakeData: any = {
    labels: getMonths(),
    datasets: [
      {
        data: data.c
      }
    ]
  }

  function getMonths(): string[] {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date(Date.now()).getMonth()
    return months.slice(currentMonth + 1, currentMonth + 13)
  }

  function checkHoldings(): number {
    let holdings: number = 0
    account.traderTrades.forEach((trade: any) => {
      if(trade.ticker === query.ticker && trade.direction === "BUY") {
        holdings += trade.amount
      }
      if(trade.ticker === query.ticker && trade.direction === "SELL") {
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
      }) //.then(() => console.log(`just posted this data ${data}`))
    }
    catch (e) {
      console.log('oops')
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
  }

  async function handleSell() {
    setHoldingsError(false)
    setOrderError(false)
    if(!orderAmount) {
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
    }
    else {
      setHoldingsError(true)
    }
  }

  return (
    <div className="flex flex-row mt-24 justify-around px-48 flex-1">
      <div className="w-[50vw] h-[50vh]">
        <Line data={fakeData} width={130} height={80} options={options}/>
      </div>
      <div className="flex flex-col w-[50%] items-center mt-16">
        <span className="text-[26px]">{query.ticker} stock</span>
        <span className="text-[26px]">${data1.c}</span>
        {
          account.loggedIn && <div className="flex flex-col mt-24">
            <input className={`px-6 py-3 ${orderError ? "bg-red-500" : "bg-slate-300"} w-[60%] mx-auto rounded-xl`} type="number" placeholder="0" onChange={(e) => setOrderAmount(parseInt(e.target.value))}/>
            <div className="flex flex-row mt-10 mx-auto">
              <button className="px-8 py-3 rounded-xl bg-slate-300 hover:bg-green-500" onClick={handleBuy}>buy</button>
              <button className="px-8 py-3 rounded-xl ml-10 bg-slate-300 hover:bg-red-500" onClick={handleSell} >sell</button>
            </div>
            <h3 className={`mx-auto mt-5 ${holdingsError ? "text-red-500" : "text-black"}`}>current holdings: {checkHoldings()} shares</h3>
          </div>
        }
        {
          !account.loggedIn && <div className="flex mt-24">
            <Link href="/login"><span className="text-[26px] hover:underline">please login or signup here</span></Link>
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