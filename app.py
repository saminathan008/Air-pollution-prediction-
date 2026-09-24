from flask import Flask, render_template, request
import joblib
import pandas as pd

app = Flask(__name__)

# Load trained ML model
model = joblib.load("air_pollution_model.pkl")


@app.route("/", methods=["GET", "POST"])
def home():

    prediction = None
    category = None

    if request.method == "POST":

        # Get values from website
        pm25 = float(request.form["pm25"])
        pm10 = float(request.form["pm10"])
        no2 = float(request.form["no2"])
        so2 = float(request.form["so2"])
        co = float(request.form["co"])
        o3 = float(request.form["o3"])
        temperature = float(request.form["temperature"])
        humidity = float(request.form["humidity"])

        # Create input dataframe
        input_data = pd.DataFrame({
            "PM2.5": [pm25],
            "PM10": [pm10],
            "NO2": [no2],
            "SO2": [so2],
            "CO": [co],
            "O3": [o3],
            "Temperature": [temperature],
            "Humidity": [humidity]
        })

        # Predict AQI
        prediction = model.predict(input_data)[0]

        # AQI category
        if prediction <= 50:
            category = "Good"
        elif prediction <= 100:
            category = "Satisfactory"
        elif prediction <= 200:
            category = "Moderate"
        elif prediction <= 300:
            category = "Poor"
        elif prediction <= 400:
            category = "Very Poor"
        else:
            category = "Severe"

    return render_template(
        "index.html",
        prediction=prediction,
        category=category
    )


if __name__ == "__main__":
    app.run(debug=True)