from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/status')
def status():
    return jsonify({"status": "OK"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6001)

# docker build -t articles-python-service .  
# docker run -d -p 6001:6001 --name=kz  articles-python-service