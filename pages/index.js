import Head from 'next/head'
//import components
import Homepage from "../components/home/Homepage"
import NavBar from "../components/NavBar"

export default function Home() {
  return (
    <div >
      <Head>
        <title>VIRAL</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/icon2.ico" />
      </Head>
        <div className="w-full m-0 p-0 ">
          <div>
            <NavBar />
            <Homepage />
          </div>
        </div>
    </div>
  )
}
