import type { NextPage } from "next"
import { withSessionSsr } from "../../lib/withSession"
import { prisma } from "../../lib/prisma"
import { useState } from "react"
import { useRouter } from "next/router"
import Loading from "../components/Loading"
import Custom500 from "../500"
import Link from "next/link"
import useSwr from "swr"
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
  Filler,
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

  const dayInMilliseconds: number = 86400000

  const [orderAmount, setOrderAmount] = useState<number | null>(null)
  const [recentTrade, setRecentTrade] = useState<string>('')
  const [holdingsError, setHoldingsError] = useState<boolean>(false)
  const [orderError, setOrderError] = useState<boolean>(false)
  const [dayToggle, setDayToggle] = useState<boolean>(false)
  const [weekToggle, setWeekToggle] = useState<boolean>(false)
  const [monthToggle, setMonthToggle] = useState<boolean>(false)
  const [yearToggle, setYearToggle] = useState<boolean>(true)
  const [yearMonths, setYearMonths] = useState<string[]>(getYearMonths())

  const { query } = useRouter()
  const { data, error, isLoading } = useSwr(`/api/candles/${query.ticker}`, fetcher)
  const { data: data1, error: error1, isLoading: isLoading1 } = useSwr(`/api/quotes/${query.ticker}`, fetcher)
  
  if (isLoading || isLoading1) return <Loading />
  if (data.year.s === "no_data" || data.day.s === "no_data" || data1 === "no_data" || data.result === "failure" || data1.result === "failure") return <Custom500 />
  console.log(data)

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
        borderColor: getBorderColor() ? "rgba(73, 233, 23, 1)" : "rgba(255,3,3,1)",
        fill: "start",
        backgroundColor: getBackgroundColor() ? "rgba(49, 148, 18, 0.3)" : "rgba(255,3,3,0.3)"
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
            size: getLabelSize()
          }
        }
      },
      y: {
        ticks: {
          min: getMinTick(),
          max: getMaxTick(),
          stepSize: getStepSize(),
          font: {
            size: 16
          }
        }
      }
    }    
  }
  
  const candleData: any = {
    labels: getTimeframe(),
    datasets: [
      {
        data: getDataset()
      }
    ]
  }

  function getStepSize() {
    if(dayToggle) {
      return Math.round((Math.max(...data.day.c.slice(-14)) - Math.min(...data.day.c.slice(-14))) / 2) == 0 ? 10 : Math.round((Math.max(...data.day.c.slice(-14)) - Math.min(...data.day.c.slice(-14))) / 2)
    }
    if(weekToggle) {
      return Math.round((Math.max(...data.year.c.slice(-6)) - Math.min(...data.year.c.slice(-6))) / 2) == 0 ? 10 : Math.round((Math.max(...data.year.c.slice(-6)) - Math.min(...data.year.c.slice(-6))) / 2)
    }
    if(monthToggle) {
      return Math.round((Math.max(...data.year.c.slice(-23)) - Math.min(...data.year.c.slice(-23))) / 2) == 0 ? 10 :  Math.round((Math.max(...data.year.c.slice(-23)) - Math.min(...data.year.c.slice(-23))) / 2)
    }
    if(yearToggle) {
      return Math.round((Math.max(...data.year.c) - Math.min(...data.year.c)) / 2) == 0 ? 10 : Math.round((Math.max(...data.year.c) - Math.min(...data.year.c)) / 2)
    }
  }

  function getMinTick() {
    if(dayToggle) {
      return Math.min(...data.day.c.slice(-14))
    }
    if(weekToggle) {
      return Math.min(...data.year.c.slice(-6))
    }
    if(monthToggle) {
      return Math.min(...data.year.c.slice(-21))
    }
    if(yearToggle) {
      return Math.min(...data.year.c)
    }
  }

  function getMaxTick() {
    if(dayToggle) {
      return Math.max(...data.day.c.slice(-14))
    }
    if(weekToggle) {
      return Math.max(...data.year.c.slice(-6))
    }
    if(monthToggle) {
      return Math.max(...data.year.c.slice(-21))
    }
    if(yearToggle) {
      return Math.max(...data.year.c)
    }
  }

  function getDataset() {
    if(dayToggle) {
      return checkTimeOfDay()
    }
    if(weekToggle) {
      return data.year.c.slice(-6)
    }
    if(monthToggle) {
      return data.year.c.slice(-21)
    }
    if(yearToggle) {
      return data.year.c
    }
  }

  function checkTimeOfDay() {
    const rn = new Date(Date.now())
    if(rn.getHours() < 16 && rn.getHours() >= 9) {
      if(rn.getHours() == 9 && rn.getMinutes() < 30) {
        return data.day.c.slice(-14)
      }
      if(rn.getDay() == 0 || rn.getDay() == 6) {
        return data.day.c.slice(-14)
      }
      return getDayDataset()
    }
    return data.day.c.slice(-14)
  }
  
  function getDayDataset() {
    const rn = new Date(Date.now())
    let time = rn.getHours()
    if(rn.getMinutes() >= 30) {
      time = ((time - 9) * 2) + 1
    }
    else {
      time = (time - 9) * 2
    }
    return data.day.c.slice(-time)
  }

  function getBorderColor() {
    if(dayToggle) {
      return data.day.c[9] < data.day.c[data.day.c.length - 1]
    }
    if(weekToggle) {
      return data.year.c[245] < data.year.c[data.year.c.length - 1]
    }
    if(monthToggle) {
      return data.year.c[228] < data.year.c[data.year.c.length - 1]
    }
    if(yearToggle) {
      return data.year.c[0] < data.year.c[data.year.c.length - 1]
    }
  }

  function getBackgroundColor() {
    if(dayToggle) {
      return data.day.c[9] < data.day.c[data.day.c.length - 1]
    }
    if(weekToggle) {
      return data.year.c[245] < data.year.c[data.year.c.length - 1]
    }
    if(monthToggle) {
      return data.year.c[228] < data.year.c[data.year.c.length - 1]
    }
    if(yearToggle) {
      return data.year.c[0] < data.year.c[data.year.c.length - 1]
    }
  }

  function getLabelSize(): number {
    if(dayToggle) {
      return 12
    }
    if(yearToggle) {
      return 1
    }
    return 16
  }

  function getTimeframe() {
    if(dayToggle) {
      return ["9:30am", "10am", "10:30am", "11am", "11:30am", "12pm", "12:30pm", "1pm", "1:30pm", "2pm", "2:30pm", "3pm", "3:30pm", "4pm"]
    }
    if(weekToggle) {
      const dates = getWeekTimeframe()
      return dates
    }
    if(monthToggle) {
      const dates = getMonthTimeframe()
      return dates
    }
    if(yearToggle) {
      const months = getYearTimeframe()
      return months
    }
  }

  function getWeekTimeframe(): string[] {
    const dates: string[] = []
    const todayDate: Date = new Date(Date.now())
    const lastWeekDate: Date = new Date(Date.now() - (dayInMilliseconds * 7))
    let start: number = Date.parse(lastWeekDate.toString())
    while(start <= Date.parse(todayDate.toString())) {
      let tempDate = new Date(start)
      if(tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
        dates.push(`${tempDate.getMonth() + 1}/${tempDate.getDate()}`)
      }
      start += dayInMilliseconds
    }
    return dates
  }

  function getMonthTimeframe(): string[] {
    const dates: string[] = []
    const todayDate: Date = new Date(Date.now())
    const lastMonthDate: Date = new Date(Date.now() - (dayInMilliseconds * 30))
    let start: number = Date.parse(lastMonthDate.toString())
    while(start <= Date.parse(todayDate.toString())) {
      let tempDate = new Date(start)
      if(tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
        dates.push(`${tempDate.getMonth() + 1}/${tempDate.getDate()}`)
      }
      start += dayInMilliseconds
    }
    return dates
  }

  function getYearTimeframe(): (string | undefined)[] {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date(Date.now()).getMonth()
    const currentMonths = months.slice(currentMonth + 1, currentMonth + 13)
    const modifiedMonths = []
    for(let month of currentMonths) {
      for(let i = 0; i < 20; i++) {
        modifiedMonths.push('')
      }
      modifiedMonths.push(month)
    }
    while(modifiedMonths.length > data.year.c.length) {
      modifiedMonths.pop()
    }
    return modifiedMonths
  }

  function getYearMonths(): string[] {
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

  function handleToggle(newToggle: string) {
    if(newToggle === "D") {
      setDayToggle(true)
      setWeekToggle(false)
      setMonthToggle(false)
      setYearToggle(false)
    }
    if(newToggle === "W") {
      setDayToggle(false)
      setWeekToggle(true)
      setMonthToggle(false)
      setYearToggle(false)
    }
    if(newToggle === "M") {
      setDayToggle(false)
      setWeekToggle(false)
      setMonthToggle(true)
      setYearToggle(false)
    }
    if(newToggle === "Y") {
      setDayToggle(false)
      setWeekToggle(false)
      setMonthToggle(false)
      setYearToggle(true)
    }
  }

  async function trade(data: any) {
    try {
      fetch('http://localhost:3000/api/fill', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then(() => setRecentTrade(`you just ${data.direction === "BUY" ? "bought" : "sold"} ${JSON.stringify(data.amount)} shares of ${data.ticker.toUpperCase()} for $${(data.amount * data.price).toFixed(2)}`))
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
      <div className="w-[50vw] h-[50vh] flex flex-col">
        <div className="flex flex-row self-end border-black border-2 rounded-2xl">
          <div className={`w-14 py-1 text-center ${dayToggle ? "bg-slate-300" : "bg-white"} hover:bg-slate-400 rounded-l-xl cursor-pointer border-black border-r-2`} onClick={() => handleToggle("D")}>D</div>
          <div className={`w-14 py-1 text-center ${weekToggle ? "bg-slate-300" : "bg-white"} hover:bg-slate-400 cursor-pointer border-black border-r-2`} onClick={() => handleToggle("W")}>W</div>
          <div className={`w-14 py-1 text-center ${monthToggle ? "bg-slate-300" : "bg-white"} hover:bg-slate-400 cursor-pointer border-black border-r-2`} onClick={() => handleToggle("M")}>M</div>
          <div className={`w-14 py-1 text-center ${yearToggle ? "bg-slate-300" : "bg-white"} hover:bg-slate-400 rounded-r-xl cursor-pointer`} onClick={() => handleToggle("Y")}>Y</div>
        </div>
        <Line data={candleData} width={130} height={80} options={options}/>
        <div className="flex flex-row absolute bottom-[20%] min-[1900px]:bottom-[21%]">
          {
            yearToggle && yearMonths.map((month) => {
              return <span key={month} className="text-[#666666] ml-10">{month}</span>
            })
          }
        </div>
      </div>
      <div className="flex flex-col w-[50%] items-center mt-16">
        <span className="text-[26px]">{typeof query.ticker === "string" ? (query.ticker).toUpperCase() : ""} stock</span>
        <span className="text-[26px]">${data1.c.toFixed(2)}</span>
        {
          account.loggedIn && <div className="flex flex-col mt-24">
            <input className={`px-6 py-3 ${orderError ? "bg-red-500" : "bg-slate-300"} w-[60%] mx-auto rounded-xl`} type="number" placeholder="0" onChange={(e) => setOrderAmount(parseInt(e.target.value))}/>
            <div className="flex flex-row mt-10 mx-auto">
              <button className="px-8 py-3 rounded-xl bg-slate-300 hover:bg-green-500" onClick={handleBuy}>buy</button>
              <button className="px-8 py-3 rounded-xl ml-10 bg-slate-300 hover:bg-red-500" onClick={handleSell} >sell</button>
            </div>
            <h3 className={`mx-auto mt-5 ${holdingsError ? "text-red-500" : "text-black"}`}>current holdings: {checkHoldings()} shares</h3>
            <h3 className="mx-auto mt-5">{recentTrade && recentTrade}</h3>
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