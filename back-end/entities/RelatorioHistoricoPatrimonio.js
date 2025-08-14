import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class RelatorioHistoricoPatrimonio extends Model { }

RelatorioHistoricoPatrimonio.init({
    numero_patrimonio: {
        type: DataTypes.STRING(255)
    },
    titulo: {
        type: DataTypes.STRING
    },
    descricao: {
        type: DataTypes.STRING(255),
    },
    status: {
        type: DataTypes.ENUM('pendente', 'em andamento', 'concluido')
    },
    criado_em: {
        type: DataTypes.DATE
    },
    tecnico_nome: {
        type: DataTypes.STRING(255),
    },
    tecnico_id: {
        type: DataTypes.UUID,
    }
}, {
    sequelize,
    modelName: 'RelatorioHistoricoPatrimonio',
    tableName: 'vw_historico_patrimonio',
    timestamps: false,
    indexes: [],
    defaultScope:{
        attributes: {
            exclude: ['id']
        }
    }
})

export default RelatorioHistoricoPatrimonio;