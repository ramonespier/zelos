import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import { encrypt, decrypt } from "../utils/crypto.js";

class Usuario extends Model { }

Usuario.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        // criptografar nome
        set(value) {
            this.setDataValue('nome', encrypt(value));
        },
        get() {
            const val = this.getDataValue('nome');
            if (!val) return null;
            return decrypt(val);
        }
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        // criptografar email
        set(value) {
            this.setDataValue('email', encrypt(value));
        },
        // descriptografar  
        get() {
            const val = this.getDataValue('email');
            if (!val) return null;
            return decrypt(val);
        }
    },
    funcao: {
        type: DataTypes.ENUM('admin', 'tecnico', 'usuario'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo',
    },
}, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
    defaultScope: {
        attributes: { exclude: ['senha', 'password'] }
    }
});

export default Usuario;
