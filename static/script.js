// ==========================================
// AIRSENSE AI - INTERACTIVE JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // RANGE SLIDERS
    // ==========================================

    const sliders = [
        "pm25",
        "pm10",
        "no2",
        "so2",
        "co",
        "o3",
        "temperature",
        "humidity"
    ];


    sliders.forEach(function (id) {

        const slider = document.getElementById(id);

        const output =
            document.getElementById(id + "Value");


        if (!slider || !output) {
            console.warn(
                "Missing slider or value element:",
                id
            );

            return;
        }


        slider.addEventListener(
            "input",
            function () {

                output.value =
                    slider.value;

            }
        );

    });


    // ==========================================
    // FORM
    // ==========================================

    const form =
        document.getElementById(
            "predictionForm"
        );


    if (!form) {

        console.error(
            "predictionForm not found"
        );

        return;

    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==========================================
            // BUTTON
            // ==========================================

            const predictButton =
                document.querySelector(
                    ".predict-button"
                );


            if (predictButton) {

                predictButton.innerHTML =
                    "<span>Analyzing...</span><span>⏳</span>";

                predictButton.disabled = true;

            }


            // ==========================================
            // GET VALUE HELPER
            // ==========================================

            function getValue(id) {

                const element =
                    document.getElementById(id);


                if (!element) {

                    throw new Error(
                        "Element not found: " + id
                    );

                }


                const value =
                    parseFloat(element.value);


                if (Number.isNaN(value)) {

                    throw new Error(
                        "Invalid value for " + id
                    );

                }


                return value;

            }


            // ==========================================
            // COLLECT INPUTS
            // ==========================================

            let data;


            try {

                data = {

                    pm25: getValue("pm25"),

                    pm10: getValue("pm10"),

                    no2: getValue("no2"),

                    so2: getValue("so2"),

                    co: getValue("co"),

                    o3: getValue("o3"),

                    temperature:
                        getValue("temperature"),

                    humidity:
                        getValue("humidity")

                };

            }

            catch (error) {

                console.error(error);

                alert(
                    "Please check the input values."
                );

                resetPredictButton();

                return;

            }


            // ==========================================
            // SEND TO FLASK
            // ==========================================

            try {

                const response =
                    await fetch(
                        "/predict",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Server error: " +
                        response.status
                    );

                }


                const result =
                    await response.json();


                console.log(
                    "Prediction:",
                    result
                );


                // ==========================================
                // SERVER ERROR
                // ==========================================

                if (!result.success) {

                    alert(
                        "Prediction Error: " +
                        result.error
                    );

                    resetPredictButton();

                    return;

                }


                // ==========================================
                // AQI RESULT
                // ==========================================

                setText(
                    "aqiResult",
                    result.aqi
                );


                setText(
                    "categoryResult",
                    result.category
                );


                // ==========================================
                // HEALTH RESULT
                // ==========================================

                setText(
                    "statusTitle",
                    result.category
                );


                setText(
                    "healthMessage",
                    result.health
                );


                // ==========================================
                // SUMMARY
                // ==========================================

                setText(
                    "resultPm25",
                    data.pm25 + " µg/m³"
                );


                setText(
                    "resultPm10",
                    data.pm10 + " µg/m³"
                );


                setText(
                    "resultTemp",
                    data.temperature + " °C"
                );


                setText(
                    "resultHumidity",
                    data.humidity + " %"
                );


                // ==========================================
                // AQI COLOR
                // ==========================================

                updateAQITheme(
                    result.aqi
                );


            }

            catch (error) {

                console.error(
                    "Prediction request error:",
                    error
                );


                alert(
                    "Unable to connect to the prediction server.\n\n" +
                    "Make sure Flask is running."
                );

            }


            resetPredictButton();

        }
    );


    // ==========================================
    // RESET BUTTON
    // ==========================================

    const resetButton =
        document.getElementById(
            "resetButton"
        );


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetForm
        );

    }


    // ==========================================
    // HELPER: SET TEXT
    // ==========================================

    function setText(id, value) {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent = value;

        }

    }


    // ==========================================
    // RESET PREDICT BUTTON
    // ==========================================

    function resetPredictButton() {

        const button =
            document.querySelector(
                ".predict-button"
            );


        if (button) {

            button.innerHTML =
                "<span>Predict Air Quality</span><span>→</span>";

            button.disabled = false;

        }

    }


    // ==========================================
    // AQI THEME
    // ==========================================

    function updateAQITheme(aqi) {

        const circle =
            document.querySelector(
                ".aqi-circle"
            );


        const categoryText =
            document.getElementById(
                "categoryResult"
            );


        if (!circle) {
            return;
        }


        let color;


        if (aqi <= 50) {

            color = "#54dc91";

        }

        else if (aqi <= 100) {

            color = "#a7d84a";

        }

        else if (aqi <= 200) {

            color = "#f2bd4a";

        }

        else if (aqi <= 300) {

            color = "#f1844b";

        }

        else if (aqi <= 400) {

            color = "#ef5b68";

        }

        else {

            color = "#a63dba";

        }


        circle.style.background =
            `conic-gradient(
                ${color} 0deg,
                ${color} 250deg,
                #294038 250deg,
                #294038 360deg
            )`;


        if (categoryText) {

            categoryText.style.color =
                color;

        }

    }


    // ==========================================
    // RESET FORM
    // ==========================================

    function resetForm() {


        const defaults = {

            pm25: 35,

            pm10: 60,

            no2: 30,

            so2: 20,

            co: 1,

            o3: 40,

            temperature: 28,

            humidity: 60

        };


        Object.keys(defaults).forEach(
            function (id) {


                const slider =
                    document.getElementById(id);


                const output =
                    document.getElementById(
                        id + "Value"
                    );


                if (slider) {

                    slider.value =
                        defaults[id];

                }


                if (output) {

                    output.value =
                        defaults[id];

                }

            }
        );


        // ==========================================
        // RESET RESULTS
        // ==========================================

        setText(
            "aqiResult",
            "--"
        );


        setText(
            "categoryResult",
            "Waiting..."
        );


        setText(
            "statusTitle",
            "Ready to Predict"
        );


        setText(
            "healthMessage",
            "Enter the environmental parameters and click predict."
        );


        setText(
            "resultPm25",
            "--"
        );


        setText(
            "resultPm10",
            "--"
        );


        setText(
            "resultTemp",
            "--"
        );


        setText(
            "resultHumidity",
            "--"
        );


        // ==========================================
        // RESET CATEGORY COLOR
        // ==========================================

        const category =
            document.getElementById(
                "categoryResult"
            );


        if (category) {

            category.style.color =
                "#42a86b";

        }


        // ==========================================
        // RESET AQI CIRCLE
        // ==========================================

        const circle =
            document.querySelector(
                ".aqi-circle"
            );


        if (circle) {

            circle.style.background =
                "conic-gradient(" +
                "#54dc91 0deg, " +
                "#54dc91 180deg, " +
                "#294038 180deg, " +
                "#294038 360deg)";

        }

    }

});
