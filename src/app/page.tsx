import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <img src="https://images.squarespace-cdn.com/content/v1/5913379febbd1a6fb635dafc/e518d3a6-de50-4714-99ec-8cced394c57d/AIESEC-Human-White.png"
        alt="AIESEC Human"
        height={200}
           />
      <h1>AIESEC One</h1>
    </main>
  );
}
