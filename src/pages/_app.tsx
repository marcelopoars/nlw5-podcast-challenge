import "../styles/global.scss";

import { AnimateSharedLayout } from "framer-motion";

import { PlayerContextProvider } from "../contexts/PlayerContext";
import { Header } from "../components/Header";
import { Player } from "../components/Player";

import styles from "../styles/app.module.scss";

// Carrega toda vez que troca de rota
function MyApp({ Component, pageProps }) {
  return (
    <AnimateSharedLayout>
      <PlayerContextProvider>
        <div className={styles.appWrapper}>
          <main>
            <Header />
            <Component {...pageProps} />
          </main>
          <Player />
        </div>
      </PlayerContextProvider>
    </AnimateSharedLayout>
  );
}

export default MyApp;
