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
    // 👇 força o Sequelize a aceitar que não há chave primária
    createdAt: false,
    updatedAt: false,
    indexes: [], // impede erro de PK implícita
    defaultScope: {
        attributes: {
            exclude: ['id'] // garante que ele não tente buscar um campo id
        }
    }
});

export default RelatorioTecnico;
