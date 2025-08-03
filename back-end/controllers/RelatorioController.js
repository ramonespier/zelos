import RelatorioChamadoPatrimonio from '../entities/RelatorioChamadoPatrimonio.js';
import RelatorioChamados from '../entities/RelatorioChamados.js';
import RelatorioHistoricoPatrimonio from '../entities/RelatorioHistoricoPatrimonio.js';
import RelatorioPool from '../entities/RelatorioPool.js';
import RelatorioTecnico from '../entities/RelatorioTecnico.js';

class RelatorioController {
  static async listar(req, res) {
    const { tipo } = req.query;

    try {
      let resultado;

      // http://localhost:3000/relatorios?tipo=status
      // http://localhost:3000/relatorios?tipo=chamado
      // http://localhost:3000/relatorios?tipo=tecnico
      // http://localhost:3000/relatorios?tipo=historico_patrimonio
      // http://localhost:3000/relatorios?tipo=pool
      switch (tipo) {
        case 'status': 
          resultado = await RelatorioChamados.findAll();
          break;

        case 'chamado':
          resultado = await RelatorioChamadoPatrimonio.findAll();
          break;

        case 'tecnico':
          resultado = await RelatorioTecnico.findAll();
          break;

        case 'historico_patrimonio':
          resultado = await RelatorioHistoricoPatrimonio.findAll();
          break;

        case 'pool':
          resultado = await RelatorioPool.findAll();
          break;

        default:
          return res.status(400).json({ message: 'Tipo de relatório inválido.' });
      }

      return res.json(resultado);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao buscar relatório.' });
    }
  }
}

export default RelatorioController;
