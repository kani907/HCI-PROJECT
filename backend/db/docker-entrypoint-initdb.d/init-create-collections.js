/*
    init-create-collections.js
    Creates the "users" and "movies" collections in the "appdb" database.
*/
db = db.getSiblingDB('appdb');

if (!db.getCollectionNames().includes('users')) {
    db.createCollection('users');
    print('Created collection: users');
}

if (!db.getCollectionNames().includes('movies')) {
    db.createCollection('movies');
    print('Created collection: movies');
}