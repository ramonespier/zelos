import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class RelatorioTecnico extends Model {}

RelatorioTecnico.init({
    nome_tecnico: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    tecnico_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    total_chamados: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tempo_medio_minutos: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'RelatorioTecnico',
    tableName: 'vw_atividades_tecnicos',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    indexes: [], 
    defaultScope: {
        attributes: {
            exclude: ['id'] 
        }
    }
});

export default RelatorioTecnico;
