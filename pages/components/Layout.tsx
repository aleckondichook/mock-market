import { LayoutProps } from "../../interfaces"
import Nav from "./Nav"
import Footer from "./Footer"

const Layout = ({ children }: LayoutProps) => (
  <div className="m-0 p-0 overflow-hidden box-border flex flex-col h-[100vh]">
    <Nav />
    {children}
    <Footer />
  </div>
)

export default Layout