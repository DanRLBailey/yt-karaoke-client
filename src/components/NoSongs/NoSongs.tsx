import { useEffect, useLayoutEffect, useRef } from "react";
import styles from "./NoSongs.module.scss";
import DvdBounce from "../DvdBounce/DvdBounce";

const NoSongs = () => {
  return (
    <div className={styles.noSongs}>
      <DvdBounce>
        <span>Happy birthday, Linda! 🎉</span>
      </DvdBounce>
      <span className={styles.tagline}>KittDansKaraoke</span>
      <span className={styles.tagline}>Queue some songs to start singing!</span>
    </div>
  );
};

export default NoSongs;
