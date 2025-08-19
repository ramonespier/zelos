import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class RelatorioChamados extends Model {}

RelatorioChamados.init({
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    total: {
        type: DataTypes.INTEGER,
    },
}, {
    sequelize,
    modelName: 'RelatorioChamados',
    tableName: 'vw_chamados_por_status',
    timestamps: false,
    id: false
});

export default RelatorioChamados;