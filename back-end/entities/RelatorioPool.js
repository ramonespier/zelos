import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class RelatorioPool extends Model { }

RelatorioPool.init({

    tipo_chamado:{
      type: DataTypes.ENUM('externo', 'manutencao', 'apoio_tecnico', 'limpeza'),
    },
    total: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize,
    modelName: 'RelatorioPool', 
    tableName: 'vw_relatorio_por_pool',
    timestamps: false,
    indexes: [],
    defaultScope: {
        attributes: {
            exclude: ['id']
        }
    }
});

export default RelatorioPool;