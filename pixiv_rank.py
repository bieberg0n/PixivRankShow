import json
import requests
import pprint
from datetime import datetime
from flask import (
    Flask,
    send_file,
    jsonify,
    # , redirect, abort
)
from gevent.wsgi import WSGIServer


app = Flask(__name__)


def log(*args):
    if len(args) == 1:
        pprint.pprint(*args)
    else:
        print(*args)


def yesterday():
    t = datetime.today()
    y = t.replace(day=t.day-1)
    return y.strftime('%Y%m%d')


class PixivRank():
    def __init__(self):
        self.s = requests.session()
        self.api = 'https://www.pixiv.net/ranking.php?\
                    mode=daily&p=1&format=json'
        self.date = ''
        self.urls = {}

    def rank(self):
        if self.date != yesterday():
            log('update', self.date, yesterday())
            r = self.s.get(self.api)
            result = json.loads(r.text)
            self.date = result['date']
            self.urls = {
                'date': self.date,
                'urls': [c['url'] for c in result['contents']],
            }
        return self.urls


@app.route('/', methods=['GET'])
def index():
    return send_file('static/pixivRank.html')


@app.route('/rank', methods=['GET'])
def rank():
    urls = pr.rank()
    return jsonify(urls)


if __name__ == '__main__':
    pr = PixivRank()
    WSGIServer(('', 8081), app).serve_forever()
