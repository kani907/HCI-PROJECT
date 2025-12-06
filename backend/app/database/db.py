from pymongo import MongoClient

DATABASE_URL = "mongodb://localhost:27017/"

client = MongoClient(DATABASE_URL)
database = client["mongodb_local"]

# test if works
# print(database.list_collection_names())
# print(client.server_info())

users_collection = database['users']
timer_collection = database['timer']
movie_collection = database['movies']
