import type { NextPage } from "next"
import { useRouter } from "next/router"
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

const Ticker: NextPage = () => {

  const { query } = useRouter()
  const { data, error, isLoading } = useSwr(`/api/trade/${query.ticker}`, fetcher)
  
  if (error) return <div>failed to load users</div>
  if (isLoading) return <div>Loading...</div>
  if (!data) return null
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
        }
      },
      y: {
        ticks: {
          min: Math.min(...data.c),
          max: Math.max(...data.c),
          stepSize: 10
        }
      }
    }    
  }
  
  const fakeData: any = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        data: data.c
      }
    ]
  }

  async function trade(data: any) {
    try {
      fetch('http://localhost:3000/api/trade/fill', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then(() => console.log(`just posted this data ${data}`))
    }
    catch (e) {
      console.log('oops')
    }
  }

  async function handleBuy() {
    const buyData: any = {
      "ticker": query.ticker,
      "amount": 5,
      "price": data.c[11],
      "direction": "BUY",
      "filledAt": Date.now(),
      "traderId": "asdf",
    }
    trade(buyData)
  }

  return (
    <div className="flex flex-row mt-24 justify-around px-48 flex-1">
      <div className="w-[50vw] h-[50vh]">
        <Line data={fakeData} width={130} height={80} options={options}/>
      </div>
      <div className="flex flex-col w-[50%] items-center mt-16">
        <span className="text-[26px]">{query.ticker} stock</span>
        <span className="text-[26px]">${data.c[11]}</span>
        <div className="flex flex-row mt-24">
          <button className="px-8 py-3 rounded-xl bg-slate-300 hover:bg-green-500" onClick={handleBuy}>buy</button>
          <button className="px-8 py-3 rounded-xl ml-10 bg-slate-300 hover:bg-red-500">sell</button>
        </div>
      </div>
    </div>
  )
}

export default Ticker