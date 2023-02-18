import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from "next"

const sessionOptions = {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "mock_market_cookie",
  cookieOptions: {
    // secure: process.env.NODE_ENV === "production"
  }
}

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions)
}

export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown}>(handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>) {
  return withIronSessionSsr(handler, sessionOptions)
}

declare module "iron-session" {
  interface IronSessionData {
    trader?: {
      id: string,
      firstName: string,
      lastName?: string,
      email: string,
      password: string
    }
  }
}