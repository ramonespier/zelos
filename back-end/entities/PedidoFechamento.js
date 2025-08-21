import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import Chamado from "./Chamado.js";
import Usuario from "./Usuario.js";

class PedidoFechamento extends Model {}

PedidoFechamento.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chamado_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'chamados', key: 'id' } },
    tecnico_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'usuarios', key: 'id' } },
    status: { type: DataTypes.ENUM('pendente', 'aprovado', 'reprovado'), defaultValue: 'pendente' }
}, {
    sequelize,
    modelName: 'PedidoFechamento',
    tableName: 'pedidos_fechamento',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
});

PedidoFechamento.belongsTo(Chamado, { foreignKey: 'chamado_id', as: 'chamado' });
PedidoFechamento.belongsTo(Usuario, { foreignKey: 'tecnico_id', as: 'tecnico' });

export default PedidoFechamento;