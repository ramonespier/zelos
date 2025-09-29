import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class RelatorioEficienciaApontamento extends Model { }

RelatorioEficienciaApontamento.init({
    tecnico_nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true, 
    },
    total_apontamentos_finalizados: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    duracao_media_apontamento_minutos: {
        type: DataTypes.FLOAT, 
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'RelatorioEficienciaApontamento',
    tableName: 'vw_eficiencia_apontamentos_tecnicos',
    timestamps: false
});

export default RelatorioEficienciaApontamento;