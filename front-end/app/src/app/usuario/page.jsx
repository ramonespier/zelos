import Dashboard from "../components/usuario/Dashboard/Dashboard";
import Chamado from "../components/usuario/AbrirChamado/Chamado";
import Contato from "../components/usuario/Contato/Contato";

export default function UsuarioPage() {
    return <>
        <Dashboard />
        <Chamado />;
        <Contato/>
    </>
}