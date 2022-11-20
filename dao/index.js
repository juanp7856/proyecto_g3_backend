const { Sequelize, DataTypes } = require("sequelize");

const CADENA_CONEXION = process.env.DATABASE_URL

const sequelize = new Sequelize(CADENA_CONEXION)



const Reporte = sequelize.define("reporte", {
    reporte_id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    usuario_id : {
        type : DataTypes.UUID,
        allowNull : false
    },
    correo : {
        type : DataTypes.STRING(30),
        allowNull : false
    },
    nombre : {
        type : DataTypes.STRING(30),
        allowNull : false
    },
    telefono : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    asunto : {
        type : DataTypes.string(200),
        allowNull : false
    },
    descripcion : {
        type : DataTypes.string(400),
        allowNull : false
    }
}, {
    timestamps : false,
    freezeTableName : true
})

