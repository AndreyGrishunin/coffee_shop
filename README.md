# Coffee4you

### Env Variables

Create a .env file in then root and add the following

```
NODE_ENV = development
PORT = 5000
MONGO_URI = your database
JWT_SECRET = 'abc123'
PAYPAL_CLIENT_ID = ''
```

### Install Dependencies (frontend & backend)

```
cd backend
npm install
cd frontend
npm install
```

### Run

```
# Run backend
cd backend
npm run server

# Run frontend 
cd frontend 
npm script-react start
```

```
### Seed Database

You can use the following commands to seed the database with some sample users and products as well as destroy all data

```
# Import data
npm run data:import

# Destroy data
npm run data:destroy
```