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
}, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
    // Desativa comportamentos padrão que podem procurar por senha
    defaultScope: {
        attributes: { exclude: ['senha', 'password'] } // Garante que não tentará buscar esses campos
    }
});

export default Usuario;