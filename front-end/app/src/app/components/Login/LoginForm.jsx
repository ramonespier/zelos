'use client'

import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation'; // Importado para redirecionamento
import axios from 'axios'; // Importado para requisições HTTP
import Cookies from 'js-cookie'; // Importado para manipular cookies
import GoogleButton from "./GoogleButton";
import RememberMeCheckbox from "./RememberMeCheckbox";

export default function LoginForm() {
  const [marcado, setMarcado] = useState(false);
  const [email, setEmail] = useState(''); // Estado para o email
  const [password, setPassword] = useState(''); // Estado para a senha
  const [error, setError] = useState(''); // Estado para mensagens de erro
  const router = useRouter();

  // Função para lidar com a submissão do formulário
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita o recarregamento da página
    setError(''); // Limpa erros anteriores

    try {
      // Faz a requisição POST para a API. [1, 2, 4]
      const response = await axios.post('http://localhost:3001/auth/login', {
        username: email, // O backend espera 'username', então enviamos o email
        password: password
      }, {
        withCredentials: true // Necessário para enviar cookies entre diferentes domínios (ex: localhost:3000 e localhost:3001)
      });

      const { user } = response.data;

      if (user && user.token) {
        // Armazena o token em um cookie que expira em 1 hora. [5, 7]
        Cookies.set('token', user.token, { expires: 1/24 }); 

        // Redireciona o usuário com base na sua função ('funcao'). [8, 9]
        switch (user.funcao) {
          case 'admin':
            router.push('/admin');
            break;
          case 'tecnico':
            router.push('/tecnico');
            break;
          case 'usuario':
            router.push('/usuario');
            break;
          default:
            router.push('/'); // Redireciona para a home se a função não for reconhecida
        }
      } else {
        setError("Token não recebido do servidor. Tente novamente.");
      }

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Exibe a mensagem de erro vinda do backend
      } else {
        setError("Erro de conexão. Verifique se o servidor está online.");
      }
      console.error("Erro no login:", err);
    }
  };

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

        {/* O formulário agora chama a função handleLogin no onSubmit */}
        <form className="w-full" onSubmit={handleLogin}>
          <div className="w-full">
            <label className="text-base font-normal text-[#525252]">Email</label>
            <input
              name="email"
              placeholder="Insira seu Email"
              className="focus:outline-none w-full border rounded-md h-[45px] border-[#DED2D9] text-black px-[10px] placeholder:text-gray-300 placeholder:text-[12px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado do email. [3]
              required
            />
          </div>

          <div className="w-full mt-7">
            <label className="text-base font-normal text-[#525252]">Senha</label>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              className="focus:outline-none w-full border rounded-md h-[45px] border-[#DED2D9] text-black px-[10px] placeholder:text-gray-300 placeholder:text-[12px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Atualiza o estado da senha. [3]
              required
            />
          </div>

          {/* Exibição de mensagem de erro */}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <div className="w-full flex items-center justify-between mt-3">
            <RememberMeCheckbox marcado={marcado} setMarcado={setMarcado} />
            <p className="text-[12px] text-[#e7000b] font-semibold cursor-pointer">Esqueci a Senha</p>
          </div>

          {/* O botão agora é do tipo 'submit' para acionar o formulário */}
          <button type="submit" className="mt-20 w-full rounded-md bg-[#e7000b] h-[50px] flex items-center justify-center text-white font-extrabold cursor-pointer">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}