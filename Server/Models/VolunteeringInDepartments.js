import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const VolunteeringInDepartments = sequelize.define('VolunteersDepartments', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: { model: "volunteers", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  hospital: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: { model: "hospitals", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  department: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: { model: "departments", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
});

export default VolunteeringInDepartments;