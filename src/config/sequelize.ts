// sequelize.ts

import { Sequelize } from 'sequelize';

// const sequelize = new Sequelize({
//     dialect: 'postgres', // specify your database
//     host: 'dpg-cq1efbd6l47c73amdtg0-a',    // specify your host
//     port: 5432,
//     username: 'admin',
//     password: 'pSmgvVv5cda2oRDuFSaU9UMdIphTsNJo',
//     database: 'chat_app_mke9',

// });

const sequelize = new Sequelize('postgresql://admin:z7LzfJZM7JCxeRuGIx4mr2ojwFQJnJT7@dpg-cq1efbd6l47c73amdtg0-a.oregon-postgres.render.com/chat_app_ne77', {
    // logging: true, // Disable logging (optional)
    dialectOptions: {
        ssl: {
            require: true, 
            rejectUnauthorized: false, 
        },
    },
});


export const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
export default sequelize;