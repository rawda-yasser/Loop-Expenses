import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@mui/material";

export default function Home() {
  return (
    <main className={styles.main}>
      <Button variant="contained">Loop Expenses MUI</Button>
    </main>
  );
}
