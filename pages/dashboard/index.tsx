import type { NextPage } from "next"
import { withSessionSsr } from "../../lib/withSession"
import { useRouter } from "next/router"
import { prisma } from "../../lib/prisma"
import Loading from "../components/Loading"
import Custom500 from "../500"
import useDashboard from "../hooks/useDashboard"
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
  console.log(dashboardData)

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
      return <div>you havent placed any trades yet</div> //todo css
    }
    else {
      return <Line data={candleData} width={130} height={80} options={options} />
    }
  }

  return (
    <div className="flex flex-1 flex-row">
      <div className="w-[50vw] h-[50vh]">
        {getChart()}
      </div>
      <div className="flex flex-col mx-auto">
        <h1 className="text-[24px] mx-auto mt-12">dashboard page</h1>
        <h1 className="text-[24px] mx-auto mt-24">welcome {traderAccount.traderAccount.firstName} {traderAccount.traderAccount.lastName}</h1>
        <div className="flex flex-col mt-12">
          {
            dashboardData.holdings.map((holding) => {
              return <div className="mt-2 mx-auto" key={holding.ticker}>
                <span className="">{holding.amount} shares of {holding.ticker}</span>
              </div>
            })
          }
        </div>
        <button className="mx-auto px-3 py-3 w-48 bg-slate-300 hover:bg-slate-600 rounded-xl mt-24" onClick={handleLogout}>logout</button>
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