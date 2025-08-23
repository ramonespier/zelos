import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import Chamado from "./Chamado.js";
import Usuario from "./Usuario.js";

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
        references: { model: 'chamados', key: 'id' }
    },
    tecnico_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: { model: 'usuarios', key: 'id' }
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

PedidoChamado.belongsTo(Chamado, { foreignKey: 'chamado_id', as: 'chamado' });
PedidoChamado.belongsTo(Usuario, { foreignKey: 'tecnico_id', as: 'tecnico' });

export default PedidoChamado;