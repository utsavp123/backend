import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize'; // Adjust path as needed
import User from './user.model';

class ChatMessage extends Model {
    public id!: number;
    public senderId!: number;
    public receiverId!: number;
    public text!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ChatMessage.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        senderId: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        receiverId: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'ChatMessage', // Model name
        tableName: 'chat_messages', // Actual table name in PostgreSQL
        underscored: true, // Use snake_case for automatic table names
    }
);
ChatMessage.belongsTo(User, { foreignKey: 'senderId', as: 'senderDetails' });
ChatMessage.belongsTo(User, { foreignKey: 'receiverId', as: 'receiverDetails' });


export default ChatMessage;
