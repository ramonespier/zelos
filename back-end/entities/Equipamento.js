import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class Equipamento extends Model { }

Equipamento.init({
    patrimonio: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    sala: {
        type: DataTypes.STRING,
    },
    equipamento: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    modelName: 'Equipamento',
    tableName: 'equipamentos',
    timestamps: false 
});

export default Equipamento;