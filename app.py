from flask import Flask, render_template, request

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

    # In a real app, use a database or environment variables!
    valid_users = {
        'Nirupam': '123'
    }
    
    if username in valid_users and password == valid_users[username]:
        # Successfully logged in
        return render_template("welcome.html", name=username)
    else:
        return render_template("login.html")

# --- NEW ROUTE ADDED ---
# This is required because text.html has a "Back" button linking to 'dashboard'
@app.route("/dashboard")
def dashboard():
    # In a real app, you'd get the name from a session. 
    # For now, we default to "User" or "Nirupam" so the page doesn't break.
    return render_template("welcome.html", name="Nirupam")

@app.route("/interview/text")
def text_interview():
    return render_template('text.html')

@app.route("/interview/audio")
def audio_interview():
    return render_template('audio.html')

# Fixed the URL to be consistent (removed .html)
@app.route('/interview/video')
def video_interview():
    return render_template('video.html')

if __name__ == '__main__':
    app.run(debug=True)