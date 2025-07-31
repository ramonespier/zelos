import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import Usuario from "./Usuario.js";
import Pool from "./Pool.js";

class PoolTecnico extends Model { }

PoolTecnico.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_tecnico: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: { model: Usuario, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    id_pool: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Pool, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    sequelize,
    modelName: 'PoolTecnico',
    tableName: 'pool_tecnicos',
    timestamps: false
});

PoolTecnico.belongsTo(Usuario, { foreignKey: 'id_tecnico', as: 'tecnico' });
PoolTecnico.belongsTo(Pool, { foreignKey: 'id_pool', as: 'pool' });

export default PoolTecnico;