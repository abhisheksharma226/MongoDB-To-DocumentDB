// Step 1: Import MongoClient from the mongodb package
const { MongoClient } = require('mongodb');
require('dotenv').config(); // Load environment variables from .env file

// Step 2: Use environment variables for MongoDB and DocumentDB URIs
const mongoUri = process.env.MONGODB_URI;
const docdbUri = process.env.DOCUMENTDB_URI;

// Step 3: Define the collections to be migrated
const collectionsToMigrate = ['AyuNxtDB']; // Add your collection names here

// Step 4: Asynchronous function to migrate data between MongoDB and DocumentDB
async function migrateData() {
  // Step 5: Create MongoDB client
  const mongoClient = new MongoClient(mongoUri);

  // Step 6: Create DocumentDB client
  const docDbClient = new MongoClient(docdbUri);

  try {
    // Step 7: Connect to MongoDB
    await mongoClient.connect();
    console.log("Connected to MongoDB");

    // Step 8: Connect to DocumentDB
    await docDbClient.connect();
    console.log("Connected to DocumentDB");

    // Step 9: Get database instances (MongoDB and DocumentDB)
    const mongoDb = mongoClient.db();  // This will use the default database in the URI
    const docDb = docDbClient.db();    // This will use the default database in the URI

    // Step 10: Loop through each collection in collectionsToMigrate
    for (const collectionName of collectionsToMigrate) {
      console.log(`Migrating collection: ${collectionName}`);

      // Step 11: Fetch all documents from MongoDB collection
      const mongoCollection = mongoDb.collection(collectionName);
      const data = await mongoCollection.find({}).toArray();  // Fetch all documents

      // Step 12: Transform the data if necessary (optional)
      const transformedData = data.map(doc => {
        // Apply any transformation logic if necessary (e.g., renaming fields)
        return doc;
      });

      // Step 13: Insert transformed data into the DocumentDB collection
      const docDbCollection = docDb.collection(collectionName);
      if (transformedData.length > 0) {
        await docDbCollection.insertMany(transformedData);  // Insert all documents at once
        console.log(`Migrated ${transformedData.length} documents to ${collectionName}`);
      } else {
        console.log(`No documents to migrate in ${collectionName}`);
      }
    }

    console.log("Data migration completed successfully!");

  } catch (err) {
    // Step 14: Handle any errors that occur during the process
    console.error("Error during migration:", err);
  } finally {
    // Step 15: Close both MongoDB and DocumentDB connections
    await mongoClient.close();
    await docDbClient.close();
  }
}

// Step 16: Run the migration function
migrateData();
