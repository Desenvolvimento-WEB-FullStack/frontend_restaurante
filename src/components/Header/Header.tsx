import styles from "./Header.module.css";

type HeaderProps = {
  title: string;
  description: string;
};

function Header({ title, description }: HeaderProps) {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default Header;
