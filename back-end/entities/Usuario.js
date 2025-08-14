import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

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
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    funcao: {
        type: DataTypes.ENUM('admin', 'tecnico', 'usuario'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo',
    },
    especialidade:{
        type: DataTypes.STRING(255),
        allowNull: true
    }
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
