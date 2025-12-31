from flask import Flask, render_template,request

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/login/signin", methods=["POST"])
def signin():
    username = request.form.get("username")
    password = request.form.get("password")

    valid_users={
        'Nirupam':'123'
    }
    if username in valid_users and password == valid_users[username]:
        return render_template("welcome.html", name= username)
    else:
        return render_template("login.html")
if __name__ == '__main__':
    app.run(debug=True)