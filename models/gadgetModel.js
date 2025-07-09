const { DataTypes } = require('sequelize');
const { add } = require('winston');
const GadgetUtils = require('../utils/gadgetUtils')
module.exports = (sequelize) => {
  const Gadget = sequelize.define('Gadget', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    status: {
      type: DataTypes.ENUM("Available", "Deployed", "Destroyed", "Decommissioned"),
      defaultValue: "Available"
    },
    decommissionedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'gadgets',
    timestamps: true,
    hooks: {
      beforeUpdate: (gadget) => {
        if (gadget.changed('status') && gadget.status === 'Decommissioned') {
          gadget.decommissionedAt = new Date();
        }
      }
    }
  }
  );



Gadget.prototype.toJSON = function () {
  const values = this.get();
  const name = values.name;
  const probability = GadgetUtils.generateSuccessProbabilities();

  return `${name} - ${probability}% success probability`;
};

  return Gadget;
};
