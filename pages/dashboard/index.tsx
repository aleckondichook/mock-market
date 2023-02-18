import type { NextPage } from "next"
import type { TradeData } from "../../interfaces"
import { useState } from "react"
import { withSessionSsr } from "../../lib/withSession"
import { useRouter } from "next/router"
import { prisma } from "../../lib/prisma"
import Loading from "../components/Loading"
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

  const [dataset, setDataset] = useState()

  const router = useRouter()
  const { data, error, isLoading } = useSwr(`api/trades/${traderAccount.traderAccount.id}`, fetcher)

  if (isLoading) return <Loading />
  if (!data) return null

  // console.log('before', data)
  const dashboardData = useDashboard(data)
  // console.log('after', data)
  // console.log(reduced)

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
        borderColor: true ? "rgba(73, 233, 23, 1)" : "rgba(255,3,3,1)",
        fill: "start",
        backgroundColor: true ? "rgba(49, 148, 18, 0.3)" : "rgba(255,3,3,0.3)"
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
          // min: Math.min(...data.c),
          // max: Math.max(...data.c),
          min: 0,
          max: 11,
          stepSize: 10,
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
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
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

  return (
    <div className="flex flex-1 flex-row">
      <div className="w-[50vw] h-[50vh]">
        <Line data={candleData} width={130} height={80} options={options} />
      </div>
      <div className="flex flex-col mx-auto">
        <h1 className="text-[24px] mx-auto mt-12">dashboard page</h1>
        <h1 className="text-[24px] mx-auto mt-24">welcome {traderAccount.traderAccount.firstName} {traderAccount.traderAccount.lastName}</h1>
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