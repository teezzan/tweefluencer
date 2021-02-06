const mongoose = require('mongoose');

async function dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        try {
            await collection.drop()
        } catch (error) {
            if (error.message === 'ns not found') return

            if (error.message.includes('a background operation is currently running')) return

            console.log(error.message)
        }
    }
}




module.exports = {
    setupDB(databaseName) {
        // Connect to Mongoose
        beforeAll(async () => {
            const url = `mongodb://localhost:27017/${databaseName}`
            await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
            await dropAllCollections();
        })


        // Disconnect Mongoose
        afterAll(async () => {
            await dropAllCollections()
            await mongoose.connection.close()
        })
    }
}
