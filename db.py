from pymongo import MongoClient
import os

uri = os.environ.get('MONGODB_URI', 'mongodb://localhost')
client = MongoClient(uri)
#if not client:
#client = MongoClient("mongodb://127.0.0.1:27017")

db = client.os_db
data_collection = db.data

def add_datum(datum):
    insert_id = data.insert_one(datum)
    return insert_id

def get_all():
    print('getting some')
    all_data = data_collection.find()
    return all_data