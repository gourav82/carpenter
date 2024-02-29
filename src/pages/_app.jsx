import { useEffect, useState } from "react";
import Header from "../component/header/Header";
import { ApplicationCtx } from "../context/ApplicatonCtx";
import "../styles/style.scss";
import 'react-modern-drawer/dist/index.css'
import 'react-responsive-modal/styles.css';
import MyAppProvider from "../../hooks/MyAppProvider";

export default function App({ Component, pageProps }) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  return (
    <>
        <MyAppProvider>
      <ApplicationCtx.Provider value={{ isUserLoggedIn, setIsUserLoggedIn }}>
        <Header />
        <Component {...pageProps} />
        {/* <Footer /> */}
      </ApplicationCtx.Provider>
      </MyAppProvider>

    </>
  );
}
