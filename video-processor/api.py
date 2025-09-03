from flask import Flask, request, jsonify

app = Flask(__name__)

@app.get('/health')
def health():
    return jsonify({"ok": True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

