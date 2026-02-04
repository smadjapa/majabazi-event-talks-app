# Majabazi Event Talks App

## Overview

This project is a single-page website for a 1-day technical event, showcasing a schedule of technical talks. Users can view the full schedule, including talk details, speaker information, categories, and timings. The application also provides functionality to filter talks based on their categories.

The backend is built with Node.js and Express.js, serving both the static frontend files and the dynamic event schedule data. The frontend is developed using standard HTML, CSS, and JavaScript.

## Features

*   **Dynamic Schedule Display:** Shows a chronological schedule for the entire day, including talks, lunch breaks, and transition times.
*   **Talk Details:** Each talk card displays the title, speaker(s), categories, duration, and a description (expandable/collapsible).
*   **Category Filtering:** Users can filter talks by selecting one or more categories using interactive tags.
*   **Responsive Design:** The website is designed to be accessible and visually appealing on various screen sizes.
*   **Simple Backend API:** A Node.js/Express.js server provides the event schedule data via a REST API endpoint.

## Technologies Used

*   **Frontend:**
    *   HTML5
    *   CSS3
    *   JavaScript (Vanilla JS)
*   **Backend:**
    *   Node.js
    *   Express.js (for web server and API)

## Project Structure

The project is organized into two main directories: `server` for the backend and `public` for the frontend assets.

```
event-website/
├── public/
│   ├── index.html          # Main HTML page
│   ├── style.css           # Styling for the website
│   └── script.js           # Frontend logic (fetching data, rendering, filtering)
├── server/
│   ├── node_modules/       # Node.js dependencies
│   ├── package.json        # Backend project dependencies (Express.js)
│   ├── package-lock.json   # Dependency lock file
│   └── server.js           # Node.js backend server and API
├── .gitignore              # Specifies intentionally untracked files to ignore
└── README.md               # This file
```

## Setup and Installation

To get this project up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/smadjapa/majabazi-event-talks-app.git
    cd majabazi-event-talks-app
    ```

2.  **Install backend dependencies:**
    Navigate to the `server` directory and install the Node.js packages.
    ```bash
    cd server
    npm install
    cd ..
    ```

## How to Run the Application

1.  **Start the backend server:**
    From the `server` directory, run the following command:
    ```bash
    cd server
    npm start
    ```
    You should see a message in your console indicating that the server is running, typically on `http://localhost:3000`.

2.  **Access the website:**
    Open your web browser and navigate to `http://localhost:3000`.

## How to Use the Application

*   **View Schedule:** The full event schedule will be displayed on the main page.
*   **Filter by Category:** Click on the category tags at the top of the page (e.g., "AI", "Web Development") to filter the displayed talks. You can select multiple categories. Click "All" to clear filters and view all talks.
*   **Toggle Description:** For each talk, you can click the "Show Description" button to reveal more details, and "Hide Description" to collapse it.

## Event Schedule Logic

The `server/server.js` dynamically generates the schedule with the following structure:
*   Event starts at 10:00 AM.
*   Each talk is 60 minutes long.
*   There is a 10-minute transition period between all events (talks and the lunch break).
*   A 60-minute lunch break is included in the schedule.

## License

This project is open-source and available under the [MIT License](LICENSE).
(Note: A `LICENSE` file would typically be added to the repository for this.)
