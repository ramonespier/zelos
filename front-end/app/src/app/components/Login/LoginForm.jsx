'use client'

import { useState } from "react";
import Image from "next/image";
import GoogleButton from "./GoogleButton";
import RememberMeCheckbox from "./RememberMeCheckbox";

export default function LoginForm() {
  const [marcado, setMarcado] = useState(false);

  return (
    <div className="w-[40%] bg-white flex items-center justify-center">
      <div className="w-[70%] flex flex-col items-start">
        <Image src="/senailogo.svg" width={72} height={72} alt="logo" />
        
        <p className="mt-5 text-[36px] font-bold text-[#525252]">
          Login to your Account
        </p>
        <p className="mt-1 text-base font-normal text-[#525252]">
          See what is going on with your business
        </p>

        <GoogleButton />

        <p className="mt-5 text-[12px] text-[#A1A1A1] font-semibold text-center w-full">
          ------------ or sign up with Email ------------
        </p>

        <div className="w-full">
          <label className="text-base font-normal text-[#525252]">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Insira seu Email"
            className="focus:outline-none w-full border rounded-md h-[45px] border-[#DED2D9] text-black px-[10px] placeholder:text-gray-300 placeholder:text-[12px]"
          />
        </div>

        <div className="w-full mt-7">
          <label className="text-base font-normal text-[#525252]">Senha</label>
          <input
            type="password"
            name="password"
            placeholder="Senha"
            className="focus:outline-none w-full border rounded-md h-[45px] border-[#DED2D9] text-black px-[10px] placeholder:text-gray-300 placeholder:text-[12px]"
          />
        </div>

        <div className="w-full flex items-center justify-between mt-3">
          <RememberMeCheckbox marcado={marcado} setMarcado={setMarcado} />
          <p className="text-[12px] text-[#e7000b] font-semibold cursor-pointer">Esqueci a Senha</p>
        </div>

        <button className="mt-20 w-full rounded-md bg-[#e7000b] h-[50px] flex items-center justify-center text-white font-extrabold cursor-pointer">
          Login
        </button>
      </div>
    </div>
  );
}
