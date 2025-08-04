import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class RelatorioHistoricoPatrimonio extends Model { }

RelatorioHistoricoPatrimonio.init({
    patrimonio: {
        type: DataTypes.STRING(255)
    },
    titulo: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('pendente', 'em andamento', 'concluido')
    },
    criado_em: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'RelatorioHistoricoPatrimonio',
    tableName: 'vw_historico_patrimonio',
    timestamps: false
})

export default RelatorioHistoricoPatrimonio;