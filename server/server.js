const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Helper function to format time
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Function to generate the schedule dynamically
function generateSchedule() {
    let currentDateTime = new Date();
    currentDateTime.setHours(10, 0, 0, 0); // Start at 10:00 AM

    const schedule = [];
    const rawEvents = [
        { type: 'talk', title: 'Opening Keynote: Future of AI', speakers: ['Dr. Ada Lovelace'], categories: ['AI', 'Keynote'], duration: 60, description: 'An insightful look into the advancements and future implications of Artificial Intelligence.' },
        { type: 'talk', title: 'Web Assembly for Modern Web Apps', speakers: ['John Doe', 'Jane Smith'], categories: ['Web Development', 'Performance'], duration: 60, description: 'Explore how Web Assembly is changing the landscape of web application development, enabling near-native performance.' },
        { type: 'talk', title: 'Data Science with Python', speakers: ['Emily White'], categories: ['Data Science', 'Python'], duration: 60, description: 'A practical session on using Python libraries like Pandas and Scikit-learn for data analysis and machine learning.' },
        { type: 'break', title: 'Lunch Break', duration: 60 },
        { type: 'talk', title: 'Cloud Native Architectures', speakers: ['Robert Green'], categories: ['Cloud', 'DevOps'], duration: 60, description: 'Understanding the principles and patterns of designing and deploying applications in a cloud-native environment.' },
        { type: 'talk', title: 'Effective Unit Testing in JavaScript', speakers: ['Alice Brown'], categories: ['Testing', 'JavaScript'], duration: 60, description: 'Learn best practices and popular frameworks for writing robust and maintainable unit tests in JavaScript.' },
        { type: 'talk', title: 'Securing Your APIs', speakers: ['David Lee', 'Sarah Clark'], categories: ['Security', 'API'], duration: 60, description: 'A deep dive into common API vulnerabilities and strategies to secure your web services.' }
    ];

    rawEvents.forEach((event, index) => {
        const startTime = formatTime(currentDateTime);
        currentDateTime.setMinutes(currentDateTime.getMinutes() + event.duration);
        const endTime = formatTime(currentDateTime);

        schedule.push({
            ...event,
            id: index + 1, // Simple ID for now
            startTime,
            endTime
        });

        // Add 10 minutes transition after each event, except the very last one.
        if (index < rawEvents.length - 1) {
            const transitionStartTime = formatTime(currentDateTime);
            currentDateTime.setMinutes(currentDateTime.getMinutes() + 10);
            const transitionEndTime = formatTime(currentDateTime);
            schedule.push({
                type: 'transition',
                title: 'Transition',
                duration: 10,
                id: `T${index + 1}`,
                startTime: transitionStartTime,
                endTime: transitionEndTime
            });
        }
    });

    return schedule;
}

// API endpoint to get the schedule
app.get('/api/schedule', (req, res) => {
    const schedule = generateSchedule();
    res.json(schedule);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
