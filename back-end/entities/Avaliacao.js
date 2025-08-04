import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import Chamado from "./Chamado.js";
import Usuario from "./Usuario.js";

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
    chamado_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: Chamado, key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    tecnico_id:{
        type:DataTypes.UUID,
        allowNull: false,
        references: {model: Usuario, key: 'id'}
    },
},{
    sequelize,
    modelName: 'Avaliacao',
    tableName: 'avaliacao',
    timestamps: false
})

Avaliacao.belongsTo(Chamado, {foreignKey: 'chamado_id', as:'chamado'});
Avaliacao.belongsTo(Usuario, {foreignKey: 'tecnico_id', as:'tecnico'});

export default Avaliacao;