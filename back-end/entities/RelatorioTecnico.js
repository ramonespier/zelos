import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class RelatorioTecnico extends Model {}

RelatorioTecnico.init({
    tecnico_nome: {
        type: DataTypes.STRING,
        allowNull: false, 
        primaryKey: true 
    },
    total_chamados: {
        type: DataTypes.INTEGER,
    },
    tempo_medio_resolucao_minutos: {
        type: DataTypes.FLOAT,
    }
}, {
    sequelize,
    modelName: 'RelatorioTecnico',
    tableName: 'vw_atividades_tecnicos',
    timestamps: false,
    id: false
});

export default RelatorioTecnico;