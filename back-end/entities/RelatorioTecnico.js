import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class RelatorioTecnico extends Model {}

RelatorioTecnico.init({
    nome_tecnico:{
        type: DataTypes.STRING(255),
    },
    tecnico_id: {
        type: DataTypes.UUID,
    },
    total_chamados:{
        type: DataTypes.INTEGER,
    },
    tempo_medio_minutos:{
        type: DataTypes.INTEGER, 
    }
}, {  sequelize,
    modelName: 'RelatorioTecnico',
    tableName: 'vw_atividades_tecnicos',
    timestamps: false,
  })

export default RelatorioTecnico;