import type { NextPage } from "next"
import { withSessionSsr } from "../../lib/withSession"
import { useRouter } from "next/router"
import { prisma } from "../../lib/prisma"
import Link from "next/link"
import Loading from "../components/Loading"
import Custom500 from "../500"
import useDashboard from "../../hooks/useDashboard"
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

const Dashboard: NextPage = (traderAccount: any) => {

  const router = useRouter()
  const { data, error, isLoading } = useSwr(`api/trades/${traderAccount.traderAccount.id}`, fetcher)

  if (isLoading) return <Loading />
  if (!data || data.result === "failure") return <Custom500 />

  const dashboardData = useDashboard(data)  

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
        borderColor: dashboardData.dataset[0] < dashboardData.dataset[dashboardData.dataset.length - 1] ? "rgba(73, 233, 23, 1)" : "rgba(255,3,3,1)",
        fill: "start",
        backgroundColor: dashboardData.dataset[0] < dashboardData.dataset[dashboardData.dataset.length - 1] ? "rgba(49, 148, 18, 0.3)" : "rgba(255,3,3,0.3)"
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
          min: Math.min(...dashboardData.dataset),
          max: Math.max(...dashboardData.dataset),
          stepSize: Math.round((Math.max(...dashboardData.dataset) - Math.min(...dashboardData.dataset)) / 2) == 0 ? 10 : Math.round((Math.max(...dashboardData.dataset) - Math.min(...dashboardData.dataset)) / 2),
          font: {
            size: 16
          }
        }
      }
    }
  }

  const candleData: any = {
    labels: dashboardData.labels,
    datasets: [
      {
        data: dashboardData.dataset
      }
    ]
  }

  async function handleLogout() {
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    router.push('/login')
  }
  
  function getChart() {
    if(!dashboardData.labels.length || !dashboardData.dataset.length || !dashboardData.holdings.length) {
      return <div className="font-german mt-[24%] ml-[18%] text-[50px]">you havent placed any trades yet</div> //todo css
    }
    else {
      return <div className="ml-[14%] mt-[16%]">
        <Line data={candleData} width={130} height={80} options={options} />
      </div>
    }
  }

  return (
    <div className="flex flex-1 flex-row">
      <div className="w-[50vw] h-[50vh]">
        {getChart()}
      </div>
      <div className="flex flex-col mx-auto">
        <h1 className="text-[60px] mx-auto mt-12 font-german">{traderAccount.traderAccount.firstName} {traderAccount.traderAccount.lastName}'s dashboard</h1>
        <div className="flex w-[75%] mx-auto flex-col mt-12 border-2 border-black bg-slate-100 rounded-xl overflow-auto h-[45%] pb-10" id="hide-scrollbar">
          <h1 className="font-german ml-5 underline text-[30px] my-5">current holdings</h1>
          {
            dashboardData.holdings.sort((a, b) => b.amount- a.amount).map((holding) => {
              return <div className="mt-4 mx-auto w-[90%] border-b-2 border-slate-300" key={holding.ticker}>
                <div className="flex flex-row justify-between">
                  <span className="text-[20px]">${holding.ticker} - {holding.amount} shares</span>
                  <Link href={`/trade/${holding.ticker}`}><span className="underline hover:opacity-25">trade</span></Link>
                </div>
              </div>
            })
          }
        </div>
        <button className="mx-auto px-3 py-3 w-48 border-2 border-black bg-white font-german hover:bg-black hover:border-white hover:text-white text-[24px] rounded-xl mt-10" id="home-button" onClick={handleLogout}>logout</button>
      </div>
    </div>
  )
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const trader = req.session.trader

    if(!trader) {
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      }
    }

    const traderAccount = await prisma.trader.findFirst({
      where: {
        email: trader.email
      }
    })

    return {
      props: {
        traderAccount
      }
    }
  }
)

export default Dashboard