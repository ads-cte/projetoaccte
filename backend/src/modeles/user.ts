import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

class User extends Model {
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
}

User.init(
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    sequelize,
    tableName: 'usuarios',

    hooks: {
      beforeSave: async (user: any) => {
        user.senha = await bcrypt.hash(user.senha, 10);
      },
    },
  }
);

export default User;