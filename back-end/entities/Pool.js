import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import Usuario from "./Usuario.js";

class Pool extends Model { }

Pool.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.ENUM('externo', 'manutencao', 'apoio_tecnico', 'limpeza', 'outro'),
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('aguardando aprovação', 'ativo', 'rejeitado'),
        defaultValue: 'aguardando aprovação',
    },
    usuario_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: Usuario, key: 'id' },
    },
    created_by: {
        type: DataTypes.UUID,
        references: {
            model: Usuario,
            key: 'id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        }
    },
    updated_by: {
        type: DataTypes.UUID,
        references: {
            model: Usuario,
            key: 'id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        }
    },
}, {
    sequelize,
    modelName: 'Pool',
    tableName: 'pools',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
})

Pool.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuarioResponsavel' });
Pool.belongsTo(Usuario, { foreignKey: 'created_by', as: 'usuarioCriador' });
Pool.belongsTo(Usuario, { foreignKey: 'updated_by', as: 'usuarioAtualizador' });

export default Pool;
