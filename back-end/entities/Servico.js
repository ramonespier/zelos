import { Model,DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class Pool extends Model {}

Pool.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Pool',
    tableName: 'pools',
    timestamps: false,
})

export default Pool;
        