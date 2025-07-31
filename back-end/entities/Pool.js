    import { Model,DataTypes } from "sequelize";
    import sequelize from "../configs/database.js";
import Usuario from "./Usuario.js";

    class Pool extends Model {}

    Pool.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        titulo: {
            type: DataTypes.ENUM('externo', 'manutencao', 'apoio_tecnico', 'limpeza'),
            allowNull: false,
        },
        descricao: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM('ativo', 'inativo'),
            defaultValue: 'ativo',
        },
        criado_em: {
            type: DataTypes.DATE,
        },
        atualizado_em: {
            type: DataTypes.DATE,
        },
        usuario_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {model: Usuario, key : 'id'},
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }, {
        sequelize,
        modelName: 'Pool',
        tableName: 'pools',
        timestamps: false,
    })

    export default Pool;
            