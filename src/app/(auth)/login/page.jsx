import LoginForm from "@/components/loginForm/loginForm";
import { handleGithubLogin } from "@/lib/action"; // Import the function
import styles from "./login.module.css";

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <form onSubmit={handleGithubLogin}>
          {" "}
          {/* Use onSubmit */}
          <button className={styles.github}>Login with Github</button>
        </form>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
