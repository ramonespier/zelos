export default function Header() {
    return (
        <>
        <hr className="bg-red-500 h-5"></hr>
      <header
        role="banner"
        className="bg-white shadow-md flex justify-between items-center px-8 h-[60px] text-[1.1rem] font-medium"
      >
        <div className="text-[#800000] font-bold" aria-live="polite">
          Olá, <strong>Funcionário</strong>! Bem-vindo(a) ao sistema.
        </div>
  
        <div
          className="flex items-center gap-3 cursor-pointer"
          tabIndex={0}
          aria-label="Perfil do usuário"
        >
          <div
            role="img"
            aria-label="Foto do funcionário"
            className="w-10 h-10 rounded-full bg-[url('https://i.pravatar.cc/150?img=5')] bg-cover bg-center shadow-md shadow-[#b30000]/60"
          ></div>
          <div className="font-semibold text-[#b30000] select-none">
            Maria Silva
          </div>
        </div>
      </header>
        </>
    );
  }
  