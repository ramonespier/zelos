import Image from "next/image";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <section className="w-full h-screen flex">
      <div className="md:w-[100%] h-full">
        <div className="w-full h-full bg-[url('/red3.png')] bg-cover bg-center"></div>
      </div>
      <LoginForm />
    </section>
  );
}
