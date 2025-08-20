import RelatorioChamados from '../entities/RelatorioChamados.js'; 
import RelatorioPool from '../entities/RelatorioPool.js';
import RelatorioTecnico from '../entities/RelatorioTecnico.js';

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
        default:
          return res.status(400).json({ message: 'Tipo de relatório inválido.' });
      }
      return res.json(resultado);
    } catch (err) {
      return res.status(500).json({ message: 'Erro ao buscar relatório.', error: err.message });
    }
  }
}
export default RelatorioController;