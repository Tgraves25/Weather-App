//Programmer: Trevone Graves

document.getElementById("getWeather").addEventListener("click", async () => {
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();

    if (!city || !state) {
        alert("Please enter both city and state.");
        return;
    }

    try {
        // Get latitude and longitude
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?city=${city}&state=${state}&format=json`;
        const geoResponse = await fetch(geocodeUrl);
        const geoData = await geoResponse.json();

        if (!geoData || geoData.length === 0) {
            throw new Error("Location not found.");
        }

        const latitude = geoData[0].lat;
        const longitude = geoData[0].lon;

        // Get weather data
        const pointsUrl = `https://api.weather.gov/points/${latitude},${longitude}`;
        const pointsResponse = await fetch(pointsUrl, { headers: { "User-Agent": "ClimaSense (your-email@example.com)" } });
        const pointsData = await pointsResponse.json();

        const forecastUrl = pointsData.properties.forecast;
        const forecastResponse = await fetch(forecastUrl, { headers: { "User-Agent": "ClimaSense (your-email@example.com)" } });
        const forecastData = await forecastResponse.json();

        // Update UI
        const periods = forecastData.properties.periods;
        document.getElementById("location").textContent = `${city}, ${state}`;
        document.getElementById("date").textContent = new Date().toLocaleDateString();
        document.getElementById("temperature").textContent = `${periods[0].temperature}°${periods[0].temperatureUnit}`;
        document.getElementById("condition").textContent = periods[0].shortForecast;

        // Populate forecast
        for (let i = 0; i < 5; i++) {
            const forecastDay = document.getElementById(`day-${i + 1}`);
            forecastDay.innerHTML = `
                <p>${new Date(periods[i].startTime).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <p>${periods[i].temperature}°${periods[i].temperatureUnit}</p>
                <p>${periods[i].shortForecast}</p>
            `;
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error(error);
    }
});
