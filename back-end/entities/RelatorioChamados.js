import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class RelatorioChamados extends Model {}

RelatorioChamados.init({
    status: {
        type: DataTypes.ENUM('pendente', 'em andamento', 'concluido'),
        allowNull: false,
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'RelatorioChamados',
    tableName: 'vw_relatorio_chamados',
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    defaultScope: {
        attributes: ['status', 'total']
    }
});

export default RelatorioChamados;
