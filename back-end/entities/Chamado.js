import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import Usuario from "./Usuario.js";
import Pool from "./Pool.js";

class Chamado extends Model { }

Chamado.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    patrimonio: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prioridade: {
        type: DataTypes.ENUM('baixa', 'média', 'alta', 'urgente'),
        defaultValue: 'média',
    },
    status: {
        type: DataTypes.ENUM('aberto', 'em_andamento', 'finalizado', 'cancelado'),
        defaultValue: 'aberto',
    },
    criado_em: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    atualizado_em: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    id_usuario: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {model: Usuario, key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    id_tecnico: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {model: Usuario, key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    id_pool: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: Pool, key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    
},{
    sequelize,
    modelName:'Chamado',
    tableName: 'chamados',
    timestamps: false
});

Chamado.belongsTo(Usuario, {foreignKey: 'id_usuario', as: 'usuario'});
Chamado.belongsTo(Usuario, {foreignKey: 'id_tecnico', as: 'tecnico'});
Chamado.belongsTo(Pool, {foreignKey: 'id_pool', as: 'pool'});

export default Chamado;

