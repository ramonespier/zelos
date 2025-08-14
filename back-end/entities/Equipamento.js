import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class Equipamento extends Model {}

Equipamento.init({
    patrimonio: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true
    },
    sala: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    equipamento:{
        type: DataTypes.STRING(255),
        allowNull: true
    }
},{
    sequelize,
    tableName: 'equipamentos',
    modelName: 'Equipamento',
    timestamps: false
})

export default Equipamento;