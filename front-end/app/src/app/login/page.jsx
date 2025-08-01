export default function Login() {
  return (
    <>
      <div className="bg-[url(/bglogin.jpg)] bg-cover bg-center h-screen w-full flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-lg w-80">
          {/* Botões de seleção de tipo de usuário - exatamente como na imagem */}
          <div className="flex mb-6 space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
              adm
            </button>
            <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
              user
            </button>
            <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
              técnico
            </button>
          </div>
          
          {/* Formulário de login - estilo idêntico ao da imagem */}
          <div className="space-y-4">
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                Username  
              </div>
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                Password  
              </div>
              <input
                type="password"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="text-right mb-4">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                Forgot Password?  
              </a>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}