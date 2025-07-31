import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import Chamado from "./Chamado.js";
import Usuario from "./Usuario.js";

class Apontamento extends Model {}

Apontamento.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    inicio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fim: {
        type: DataTypes.DATE,
    },
    descricao: {
        type: DataTypes.STRING,
    },
    criado_em: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_chamado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: Chamado, key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    id_tecnico: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {model: Usuario, key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }
}, {
    sequelize,
    modelName: 'Apontamento',
    tableName: 'apontamentos',
    timestamps: false
})

Apontamento.belongsTo(Chamado, {foreignKey: 'id_chamado', as: 'chamado'});
Apontamento.belongsTo(Usuario, {foreignKey: 'id_tecnico', as: 'tecnico'});

export default Apontamento;