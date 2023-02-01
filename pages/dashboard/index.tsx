import type { NextPage } from "next"
import { withSessionSsr } from "../../lib/withSession"


const DashboardRedirect: NextPage = () => {


  return (
    <div className="flex flex-1">
      <h1 className="text-[24px] mx-auto mt-12">dashboardlogin page</h1>
    </div>
  )
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user

    if(!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      }
    }

    return {
      props: {
        user: req.session.user
      }
    }
  }
)


export default DashboardRedirect