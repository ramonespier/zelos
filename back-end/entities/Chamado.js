import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import Usuario from "./Usuario.js";
import Pool from "./Pool.js";
import Equipamento from "./Equipamento.js";

class Chamado extends Model { }

Chamado.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    numero_patrimonio: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: { model: Equipamento, key: 'patrimonio' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    img_url: {
        type: DataTypes.STRING(1000)
    },
     status: {
        type: DataTypes.ENUM('aberto', 'em andamento', 'concluido', 'cancelado'),
        defaultValue: 'aberto',
    },
    usuario_id: {
        type: DataTypes.UUID,
        references: { model: Usuario, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    tecnico_id: {
        type: DataTypes.UUID,
        references: { model: Usuario, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Pool, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },

}, {
    sequelize,
    modelName: 'Chamado',
    tableName: 'chamados',
    indexes: [
        {
            unique: true,
            fields: ['numero_patrimonio', 'status']
        }
    ],
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
});

Chamado.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Chamado.belongsTo(Usuario, { foreignKey: 'tecnico_id', as: 'tecnico' });
Chamado.belongsTo(Pool, { foreignKey: 'pool_id', as: 'pool' });
Chamado.belongsTo(Equipamento, { foreignKey: 'numero_patrimonio', targetKey: 'patrimonio', as: 'equipamento' });


export default Chamado;

