from flask import Flask, render_template, request, redirect, url_for, jsonify
import db
import requests
import json

app = Flask(__name__)



@app.route('/')
def home_page():
    return('hi')

@app.route('/data', methods=['GET'])
def all_data():
    output = []
    # datapoint = mongo.db.data
    print('before.;..')
    for i in db.get_all():
        print('here')
        output.append({'title': i['title'], 'num_vars': i['num_vars']})
       
    return jsonify({'data_result': output})


if __name__ == '__main__':
    app.run()