import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js"; 

class RelatorioChamadoSemTecnico extends Model { }

RelatorioChamadoSemTecnico.init({
    chamado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    tipo_pool: {
        type: DataTypes.ENUM('externo', 'manutencao', 'apoio_tecnico', 'limpeza', 'outro'),
        allowNull: false,
    },
    horas_em_espera: {
        type: DataTypes.INTEGER, 
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'RelatorioChamadoSemTecnico',
    tableName: 'vw_chamados_sem_tecnico',
    timestamps: false
});

export default RelatorioChamadoSemTecnico;