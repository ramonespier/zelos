import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class RelatorioPool extends Model { }

RelatorioPool.init({
    tipo_chamado: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    total: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize,
    modelName: 'RelatorioPool', 
    tableName: 'vw_chamados_por_tipo',
    timestamps: false,
    id: false
});
 
export default RelatorioPool;   