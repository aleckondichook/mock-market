import type { NextPage } from "next"
import { withSessionSsr } from "../../lib/withSession"
import { useRouter } from "next/router"
import { prisma } from "../../lib/prisma"

const Dashboard: NextPage = (traderAccount: any) => {

  const router = useRouter()

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
    <div className="flex flex-1">
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