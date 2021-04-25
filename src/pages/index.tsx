import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { motion } from "framer-motion";

import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import { usePlayer } from "../contexts/PlayerContext";

import styles from "./home.module.scss";
// SPA
// SSR
// SSG *

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
};

type HomeProps = {
  latesEpisodes: Episode[];
  allEpisodes: Episode[];
};

export default function Home({ latesEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodeList = [...latesEpisodes, ...allEpisodes];

  return (
    <>
      <Head>
        <title>FalaDev | Podcast sobre desenvolvimento</title>
      </Head>

      <div className={styles.homePage}>
        <section className={styles.latesEpisodes}>
          <h2>Últimos podcasts</h2>
          <ul>
            {latesEpisodes.map((episode, index) => {
              return (
                <motion.li
                  key={episode.id}
                  layout
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  // transition={{ delay: 0.2 }}
                >
                  <div className={styles.row}>
                    <Image
                      width={192}
                      height={330}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                    <div className={styles.episodeDetails}>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                      <p>{episode.members}</p>
                      <span>{episode.publishedAt}</span>
                      <span>{episode.durationAsString}</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => playList(episodeList, index)}
                    >
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </motion.button>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </section>

        <section className={styles.allEpisodes}>
          <h2>Lista completa</h2>
          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcasts</th>
                <th className={styles.members}>Integrantes</th>
                <th className={styles.publishedAt}>Data</th>
                <th className={styles.duration}>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td className={styles.thumb}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                        quality={100}
                        // loading="lazy"
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td className={styles.members}>{episode.members}</td>
                    <td className={styles.publishedAt}>
                      {episode.publishedAt}
                    </td>
                    <td className={styles.duration}>
                      {episode.durationAsString}
                    </td>
                    <td>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() =>
                          playList(episodeList, index + latesEpisodes.length)
                        }
                      >
                        <img src="/play-green.svg" alt="Tocar episódio" />
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      url: episode.file.url,
    };
  });

  const latesEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latesEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
