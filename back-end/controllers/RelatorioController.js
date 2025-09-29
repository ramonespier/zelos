import RelatorioChamados from '../entities/RelatorioChamados.js'; 
import RelatorioPool from '../entities/RelatorioPool.js';
import RelatorioTecnico from '../entities/RelatorioTecnico.js';
import ChamadosSemTecnico from '../entities/RelatorioChamadoSemTecnico.js';
import EficienciaApontamentosTecnicos from '../entities/RelatorioEficienciaApontamento.js';
import UsoPatrimoniosEmChamados from '../entities/RelatorioChamadoPatrimonio.js';


class RelatorioController {
  static async listar(req, res) {
    const { tipo } = req.query; 

    try {
      let resultado;

      switch (tipo) {
        case 'status': 
          resultado = await RelatorioChamados.findAll();
          break;
        case 'tipo': 
          resultado = await RelatorioPool.findAll();
          break;
        case 'tecnico':
          resultado = await RelatorioTecnico.findAll();
          break;
        case 'semTecnico':
        case 'espera': 
          resultado = await ChamadosSemTecnico.findAll();
          break;
        case 'eficienciaTecnico': 
        case 'apontamento':
          resultado = await EficienciaApontamentosTecnicos.findAll();
          break;
        case 'usoPatrimonio': 
        case 'inventario':
          resultado = await UsoPatrimoniosEmChamados.findAll();
          break;

        default:
          return res.status(400).json({ 
            message: 'Tipo de relatório inválido. Tipos permitidos: status, tipo, tecnico, espera, eficienciaTecnico, usoPatrimonio.' 
          });
      }
      return res.json(resultado);

    } catch (err) {
      console.error('Erro ao buscar relatório:', err);
      return res.status(500).json({ 
        message: 'Erro ao buscar relatório.', 
        error: err.message 
      });
    }
  }
}

export default RelatorioController;