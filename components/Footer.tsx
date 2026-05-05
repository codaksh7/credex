import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.brand}>credex</span>
        <span className={styles.copy}>Built with conviction, not templates.</span>
      </div>
    </footer>
  );
}
