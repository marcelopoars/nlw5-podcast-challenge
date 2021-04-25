import { motion } from "framer-motion";

import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import Link from "next/link";

import styles from "./header.module.scss";

export function Header() {
  const currentDate = format(new Date(), "EEEEEE, d MMMM", {
    locale: ptBR,
  });

  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={styles.logo}
        >
          <img src="/logo.svg" alt="Podcastr" />
          <h1>FalaDev</h1>
        </motion.div>
      </Link>

      <p>O melhor para você ouvir sempre</p>

      <span>{currentDate}</span>
    </header>
  );
}
