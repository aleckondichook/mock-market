import { withSessionRoute } from "../../lib/withSession"
import type { NextApiRequest, NextApiResponse  } from "next"

export default withSessionRoute(loginRoute)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  req.session.user = {
    id: 230,
    admin: true
  }
  await req.session.save()
  res.send("logged in")
} 