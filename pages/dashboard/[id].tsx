import type { NextPage } from "next"
import { useRouter } from "next/router"

const Dashboard: NextPage = () => {

  const { query } = useRouter()

  return (
    <div>dashboard {query.id} page</div>
  )
}

export default Dashboard