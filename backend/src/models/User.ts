import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import Role from "./Role"; 

interface UserAttributes {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  roleId: number;
  isApproved: boolean;
  createdAt?: Date;
  updatedAt?: Date | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public roleId!: number;
  public isApproved!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date | null;
  public role!: Role; 
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

export default User;
