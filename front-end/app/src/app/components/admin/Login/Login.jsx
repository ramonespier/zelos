'use client'

import Image from "next/image";
import { BiCheck } from 'react-icons/bi';
import { useState } from "react";

export default function () {
  const [marcado, setMarcado] = useState(false);

  return (
    <>
      <section className="w-full h-screen flex">
        <div className="w-[60%] h-full">
          <div className="w-full h-full bg-[url('/red3.png')] bg-cover bg-center"></div>
        </div>
        <div className="w-[40%] bg-white flex items-center justify-center">
          <div className="w-[70%] flex flex-col items-start">
            <Image
              src="/senailogo.svg"
              width={72}
              height={72}
              alt="logo"
            />
            <p className="mt-5text-[36px] font-bold text-[#525252]">
              Login to your Account
            </p>
            <p className="mt-1 text-base font-normal text-[#525252]">
              See what is going on with your business
            </p>
            <div className="mt-7 w-full py-[10px] border border-[#E8E8E8] rounded-md flex items-center justify-center gap-x-4">
              <Image src={'/google.png'}
                width={25}
                height={25}
                alt="google"
              />
              <p className="text-sm font-bold text-[#828282]">Continue com o Google</p>
            </div>
            <p className="mt-5 text-[12px] text-[#A1A1A1] font-semibold flex self-center justify-self-center">
              ------------or sign up with Email------------{" "}
            </p>
            <div className="w-full">
              <label htmlFor="" className="text-base font-normal text-[#525252]">
                Email
                </label>
              <input
                type="email"
                name="email"
                placeholder="Insira seu Email"
                className="focus:outline-none w-full border rounded-md h-[45px] border-[#DED2D9] text-black px-[10px] placeholder:text-gray-300 placeholder:text-[12px]"
              />
            </div>

            <div className="w-full mt-7">
              <label htmlFor="" className="text-base font-normaltext-[#525252]">
                Senha
              </label>
              <input
                type="password"
                name="password"
                placeholder="Senha"
                className="focus:outline-none w-full border rounded-md h-[45px] border-[#DED2D9] text-black px-[10px] placeholder:text-gray-300 placeholder:text-[12px]"
              />
            </div>

            <div className="w-full flex items-center justify-between mt-3">
              <div className="flex items-center justify-center gap-x-3">
                <button
                  onClick={() => setMarcado(!marcado)}
                  className={`w-[12px] h-[12px] rounded-[5px] flex items-center justify-center text-white transition-colors duration-200 cursor-pointer ${marcado ? "bg-[#e7000b]" : "bg-gray-300"}`}
                >
                  {marcado && <BiCheck size={10} />}
                </button>
                <p className="text-[12px] text-[#e7000b] font-normal">
                  Remember Me
                </p>

              </div>
              <p className="text-[12px] text-[#e7000b] font-semibold">Esqueci a Senha</p>
            </div>
            <button className="mt-20 w-full rounded-md bg-[#e7000b] h-[50px] flex items-center justify-center text-white font-extrabold cursor-pointer">
              Login
            </button>
          </div>
        </div>
      </section>
    </>
  )
}