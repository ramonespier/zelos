import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import Usuario from "./Usuario.js";

class Mensagem extends Model {}

Mensagem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    usuario_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: { model: Usuario, key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    admin_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: { model: Usuario, key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
    },
    conteudo: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    respondida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: "Mensagem",
    tableName: "mensagens",
    timestamps: true,
    createdAt: "criado_em",
    updatedAt: false, 
});

Mensagem.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });
Mensagem.belongsTo(Usuario, { foreignKey: "admin_id", as: "admin" });

export default Mensagem;
