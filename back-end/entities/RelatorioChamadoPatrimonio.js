import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class RelatorioChamadoPatrimonio extends Model { }

RelatorioChamadoPatrimonio.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pendente', 'em andamento', 'concluido'),
        defaultValue: 'pendente'
    },
    criado_em: {
        type: DataTypes.DATE,
    },
    nome_patrimonio: {
        type: DataTypes.STRING(255),
    }
}, {
    sequelize,
    modelName: 'RelatorioChamadoPatrimonio',
    tableName: 'vw_chamados_com_patrimonio',
    timestamps: false
});

export default RelatorioChamadoPatrimonio;