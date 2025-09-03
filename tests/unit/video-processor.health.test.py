import json
import urllib.request
import sys

API_BASE = 'http://localhost:5000'

try:
    with urllib.request.urlopen(API_BASE + '/health') as res:
        body = res.read().decode('utf-8')
        obj = json.loads(body)
        assert obj.get('ok') is True
        print('video-processor /health OK')
except Exception as e:
    print(e)
    sys.exit(1)

