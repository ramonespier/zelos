import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.js";

class UsoPatrimoniosEmChamados extends Model { }

UsoPatrimoniosEmChamados.init({
    patrimonio: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true, 
    },
    equipamento: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    sala: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    total_chamados_registrados: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'UsoPatrimoniosEmChamados',
    tableName: 'vw_uso_patrimonios_em_chamados',
    timestamps: false
});

export default UsoPatrimoniosEmChamados;