// ContentArea.jsx
'use client';
import InicioTec from '../Inicio/InicioTecnico';
import ChamadosAtribuidos from '../ChamadosAtribuidos/ChamadosAtribuidos';
import ChamadosAbertos from '../ChamadosAbertos/ChamadosAbertos';
import MeusChamadosTec from '../MeusChamados/MeusChamados';
import ChamadoTec from '../SolicitarChamado/Chamado';
import ContatosTec from '../Contato/FormularioContato';

export default function ContentArea({ activeTab, setActiveTab, funcionario }) {
  switch(activeTab) {
    case 'inicio': return <InicioTec setActiveTab={setActiveTab} />;
    case 'atribuidos': return <ChamadosAtribuidos />;
    case 'abertos': return <ChamadosAbertos />;
    case 'meus': return <MeusChamadosTec />;
    case 'abrir': return <ChamadoTec />;
    case 'contatos': return <ContatosTec />;
    case 'info': 
      return (
        <section>
          {/* perfil poderia ficar aqui ou em outro componente */}
        </section>
      );
    default: return null;
  }
}
