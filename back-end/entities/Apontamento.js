import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";
import Chamado from "./Chamado.js";
import Usuario from "./Usuario.js";

class Apontamento extends Model { }

Apontamento.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    comeco: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fim: {
        type: DataTypes.DATE,
    },
    descricao: {
        type: DataTypes.STRING,
    },
    duracao: {
        type: DataTypes.VIRTUAL,
        get() {
            const comeco = this.getDataValue('comeco');
            const fim = this.getDataValue('fim');
            if (comeco && fim) {
                return Math.floor((new Date(fim) - new Date(comeco)) / 60000 );
            }
            return null;
        }   
    },
    criado_em: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    chamado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Chamado, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    tecnico_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: { model: Usuario, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }
}, {
    sequelize,
    modelName: 'Apontamento',
    tableName: 'apontamentos',
    timestamps: false
})

Apontamento.belongsTo(Chamado, { foreignKey: 'chamado_id', as: 'chamado' });
Apontamento.belongsTo(Usuario, { foreignKey: 'tecnico_id', as: 'tecnico' });

export default Apontamento;