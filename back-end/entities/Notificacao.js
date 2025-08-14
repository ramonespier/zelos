import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import Usuario from "./Usuario.js";

class Notificacao extends Model {}

Notificacao.init({
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
    mensagem: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    lida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: "Notificacao",
    tableName: "notificacoes",
    timestamps: true,
    createdAt: "criado_em",
    updatedAt: false, 
});

Notificacao.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

export default Notificacao;
