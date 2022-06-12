import '../styles/globals.css';
import {StoreProvider} from "../lib/Store";
import { SessionProvider } from "next-auth/react"
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <StoreProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </StoreProvider>
  )
}