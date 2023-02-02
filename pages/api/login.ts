import { withSessionRoute } from "../../lib/withSession"
import type { NextApiRequest, NextApiResponse  } from "next"
import { prisma } from "../../lib/prisma"

export default withSessionRoute(loginRoute)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {

  const findUser = await prisma.trader.findMany({
    where: {
      email: req.body.email
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      password: true
    }
  })

  req.session.trader = {
    id: findUser[0].id,
    firstName: findUser[0].firstName,
    lastName: findUser[0].lastName || undefined,
    email: findUser[0].email,
    password: findUser[0].password
  }

  await req.session.save()
  res.send("logged in")

}