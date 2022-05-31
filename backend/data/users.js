import bcrypt from 'bcryptjs';
const users = [
    {
        name: 'Андрей Гришунин',
        email: 'andreygrishunin@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Иванов Иван',
        email: 'ivanov@gmail.com',
        password: bcrypt.hashSync('123456', 10)
    },
    {
        name: 'Смирнов Иван',
        email: 'smirnov@gmail.com',
        password: bcrypt.hashSync('123456', 10)
    }
]
export default users;