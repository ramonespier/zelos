import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class PedidoChamado extends Model { }

PedidoChamado.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    chamado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tecnico_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pendente', 'aceito', 'recusado'),
        defaultValue: 'pendente',
    },
}, {
    sequelize,
    modelName: 'PedidoChamado',
    tableName: 'pedidos_chamado',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
});

export default PedidoChamado;