import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class Relatorio extends Model {}

Relatorio.init({
    status:{
        type: DataTypes.ENUM('pendente', 'em andamento', 'concluido'),
        allowNull: false,
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    sequelize,
    tableName: 'vw_relatorio_chamados',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
    underscored: true,
    defaultScope: {
        attributes: ['status', 'total']
    }
});

export default Relatorio;