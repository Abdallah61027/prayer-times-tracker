A sophisticated, responsive, and highly accurate web application designed to display Islamic prayer timings globally. This app calculates real-time remaining time for the next prayer and adapts to various time zones and calculation methods.



## 🚀 Key Features

* **Dynamic Location Support:** Users can select their country and city from a comprehensive database.
* **Smart Countdown:** A real-time countdown timer that calculates the hours, minutes, and seconds remaining until the next Athan.
* **Timezone Independence:** Uses server-side timezones to ensure accuracy even if the user's local device clock is incorrectly set.
* **12/24 Hour Toggle:** Integrated settings to switch between standard 12-hour and military 24-hour time formats.
* **Persistence:** Saves user preferences (Country, City, Time Format) locally using `LocalStorage` for a personalized experience on return visits.
* **Cross-Day Logic:** Sophisticated algorithm to handle the countdown from the Isha prayer to the next day's Fajr prayer.

## 🛠️ Technical Stack

* **HTML5 & CSS3:** For a clean, modern, and mobile-responsive UI.
* **JavaScript (ES6+):** Core logic for time manipulation and DOM updates.
* **Axios:** For handling asynchronous API requests.
* **Aladhan API:** The primary engine for precise astronomical calculations of prayer timings.

## ⚙️ How It Works (The Logic)

The application follows a **Sequential API Request** architecture to guarantee precision:

1.  **Initial Fetch:** On load or city change, the app requests the specific timezone for the target city.
2.  **Calendar Integration:** It then fetches the full monthly calendar. This is crucial for calculating the "Next Fajr" when the user is currently between Isha and midnight.
3.  **Real-time Synchronization:** A background interval synchronizes the application clock with the fetched timezone every second, triggering UI updates and countdown recalculations.



## 📂 Project Structure

```text
├── css/
│   └── style.css      # Custom styling and transitions
├── js/
│   └── main.js        # Core logic, API handlers, and Countdown
├── countries.json     # Local database for countries and supported cities
└── index.html         # Main application entry point
🚀
