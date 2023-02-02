import { withSessionRoute } from "../../lib/withSession"
import type { NextApiRequest, NextApiResponse  } from "next"

export default withSessionRoute(loginRoute)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {

  req.session.destroy()
  res.send("logged out")

}