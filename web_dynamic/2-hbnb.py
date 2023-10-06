pt that runs an app with Flask framework
The application listens on 0.0.0.0, port 5000.
"""
from models import storage
from flask import Flask, render_template
import uuid

app = Flask(__name__)


@app.teardown_appcontext
def teardown(exception):
    """Close the storage session after each request."""
    storage.close()


@app.route("/2-hbnb/", strict_slashes=False)
def hbnb():
    """Displays the main HBnB HTML page."""
    states = storage.all("State")
    amenities = storage.all("Amenity")
    places = storage.all("Place")

    return render_template("2-hbnb.html",
                           states=states, amenities=amenities,
                           places=places,
                           cache_id=str(uuid.uuid4()))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
