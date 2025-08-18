'use client'

import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Usaremos a instância global se você tiver, senão o axios direto
import Cookies from 'js-cookie';
import GoogleButton from "./GoogleButton";
import RememberMeCheckbox from "./RememberMeCheckbox";

export default function LoginForm() {
  const [marcado, setMarcado] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Estados para controle de erro e carregamento
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [patrimonio, setPatrimonio] = useState('');
  const [poolId, setPoolId] = useState(''); // Ex: O usuário seleciona "Manutenção" que corresponde ao ID 1

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... sua lógica de validação ...

    if (!user || !user.id) {
      alert("Sua sessão é inválida. Por favor, faça o login novamente.");
      return;
    }

    // O payload agora precisa corresponder ao que o ChamadoController.criar espera
    const payload = {
      titulo: titulo,
      descricao: descricao,
      numero_patrimonio: patrimonio, // <- DADO NOVO E OBRIGATÓRIO
      pool_id: poolId,              // <- DADO NOVO E OBRIGATÓRIO
      // usuario_id não é necessário enviar, o backend pega do token
    };

    try {
      // A rota correta é /chamados
      await api.post('/chamados', payload);

      setModalAberto(true);
      // ... limpar todos os campos do formulário ...
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Erro ao enviar chamado, tente novamente.';
      alert(errorMessage); // Usando .message aqui porque o controller retorna { message: '...' }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // 2. Limpa erros antigos e ativa o estado de carregamento
    setError('');
    setIsLoading(true);

    try {
      // Usamos a URL completa aqui. Se você tiver uma instância do axios configurada em `lib/api.js`, use `api.post(...)`
      const response = await axios.post('http://localhost:3001/auth/login', {
        username: email, // O backend espera 'username'
        password: password
      }, {
        withCredentials: true
      });

      const { user } = response.data;

      if (user && user.token) {
        Cookies.set('token', user.token, { expires: 1 / 24 });

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
            router.push('/');
        }
      } else {
        setError("Token de autenticação não foi recebido. Tente novamente.");
      }

    } catch (err) {
      // 3. Lógica robusta para extrair a mensagem de erro do backend
      if (err.response && err.response.data && err.response.data.error) {
        // Erro vindo da sua API (ex: res.status(401).json({ error: 'Credenciais inválidas' }))
        setError(err.response.data.error);
      } else if (err.request) {
        // Ocorreu um erro de rede (servidor fora do ar, etc)
        setError("Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else {
        // Algum outro erro inesperado
        setError("Ocorreu um erro inesperado. Por favor, tente novamente.");
      }
      console.error("Erro no login:", err);
    } finally {
      // 4. Garante que o estado de carregamento seja desativado, independente do resultado
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[40%] bg-white flex items-center justify-center">
      <div className="w-[70%] flex flex-col items-start">
        <Image src="/senailogo.svg" width={72} height={72} alt="logo" />

        <p className="mt-5 text-[36px] font-bold text-[#525252]">Login to your Account</p>
        <p className="mt-1 text-base font-normal text-[#525252]">See what is going on with your business</p>
        <GoogleButton />
        <p className="mt-5 text-[12px] text-[#A1A1A1] font-semibold text-center w-full">------------ or sign up with Email ------------</p>

        <form className="w-full" onSubmit={handleLogin}>
          <div className="w-full">
            <label className="text-base font-normal text-[#525252]">Email</label>
            <input
              name="email"
              placeholder="Insira sua matrícula ou email"
              className="focus:outline-none w-full border rounded-md h-[45px] border-[#DED2D9] text-black px-[10px] placeholder:text-gray-300 placeholder:text-[12px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading} // Desabilita o campo durante o carregamento
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
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading} // Desabilita o campo durante o carregamento
            />
          </div>

          {/* 5. Espaço para exibir a mensagem de erro */}
          {error && (
            <div className="w-full mt-4 text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <div className="w-full flex items-center justify-between mt-3">
            <RememberMeCheckbox marcado={marcado} setMarcado={setMarcado} />
            <p className="text-[12px] text-[#e7000b] font-semibold cursor-pointer">Esqueci a Senha</p>
          </div>

          <button
            type="submit"
            className="mt-10 w-full rounded-md bg-[#e7000b] h-[50px] flex items-center justify-center text-white font-extrabold cursor-pointer transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
            disabled={isLoading} // Botão desabilitado durante o carregamento
          >
            {isLoading ? 'Entrando...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}