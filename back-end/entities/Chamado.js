import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import { encrypt, decrypt } from '../utils/crypto.js';
import Usuario from "./Usuario.js";
import Pool from "./Pool.js";

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
        set(value) {
            this.setDataValue('numero_patrimonio', encrypt(value));
        },
        get() {
            const val = this.getDataValue('numero_patrimonio');
            if (!val) return null;
            return decrypt(val);
        }
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
        set(value) {
            this.setDataValue('descricao', encrypt(value));
        },
        get() {
            const val = this.getDataValue('descricao');
            if (!val) return null;
            return decrypt(val);
        }
    },
    status: {
        type: DataTypes.ENUM('aberto', 'em andamento', 'concluido'),
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
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
});

Chamado.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Chamado.belongsTo(Usuario, { foreignKey: 'tecnico_id', as: 'tecnico' });
Chamado.belongsTo(Pool, { foreignKey: 'pool_id', as: 'pool' });

export default Chamado;

