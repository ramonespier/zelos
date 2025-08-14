import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class RelatorioTecnico extends Model {}

RelatorioTecnico.init({
    nome_tecnico: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tecnico_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    chamado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    numero_patrimonio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    criado_em: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    atualizado_em: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    duracao_total_minutos: {
        type: DataTypes.FLOAT,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'RelatorioTecnico',
    tableName: 'vw_atividades_tecnicos',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    defaultScope: {
        attributes: {
            exclude: ['id'] 
        }
    }
});

export default RelatorioTecnico;
