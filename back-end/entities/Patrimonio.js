import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class Patrimonio extends Model { }

Patrimonio.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    numero_serie: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    criado_em: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
}, {
    sequelize,
    modelName: 'Patrimonio',
    tableName: 'patrimonios',
    timestamps: false,
})

export default Patrimonio;