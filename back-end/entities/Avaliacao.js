import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import Chamado from "./Chamado.js";

class Avaliacao extends Model{}

Avaliacao.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    comentario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id_chamado:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: Chamado, key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
},{
    sequelize,
    modelName: 'Avaliacao',
    tableName: 'avaliacoes',
    timestamps: false
})

Avaliacao.belongsTo(Chamado, {foreignKey: 'id_chamado', as:'chamado'});

export default Avaliacao;