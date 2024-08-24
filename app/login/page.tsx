// pages/login.js or app/login/page.js
import dynamic from "next/dynamic";

const LoginPage = dynamic(
  () => import("../../components/Login/LoginPageComponents"),
  {
    ssr: false, 
  },
);

export default LoginPage;
