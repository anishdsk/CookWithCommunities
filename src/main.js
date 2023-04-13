'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const passwordForm = document.getElementById('passwordForm');
    const formContainer = document.getElementById('formContainer');
    const initialPasswordHash = 'a794e600d504779d87143f73a48aa0f9553c3c3e2b9acdbb17a4ea4ff4c4f01f'; 

    // Store the hashed password in localStorage if it doesn't exist
    if (!localStorage.getItem('passwordHash')) {
        localStorage.setItem('passwordHash', initialPasswordHash);
    }

    // Hash the input password using SHA-3
    const hashPassword = async (password) => {
        const hash = sha3_256(password);
        return hash;
    };

    // Check if the hashed input password matches the stored password hash
    const checkPassword = async (password) => {
        const hashedPassword = await hashPassword(password);
        const storedHash = localStorage.getItem('passwordHash');
        return hashedPassword === storedHash;
    };

    // Replace the password form with the event form
    const showEventForm = () => {
        const eventForm = document.createElement('form');
        eventForm.id = 'eventForm';
        eventForm.innerHTML = `
            <label for="eventName">Event name:</label>
            <input type="text" id="eventName" name="eventName" required>
            <br>
            <label for="eventDate">Event date:</label>
            <input type="date" id="eventDate" name="eventDate" required>
            <br>
            <label for="eventTime">Event time:</label>
            <input type="time" id="eventTime" name="eventTime" required>
            <br>
            <button type="submit"><b>Create Event</b></button>
        `;
        formContainer.innerHTML = '';
        formContainer.appendChild(eventForm);

        // Handle the event form submission
        eventForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const eventName = event.target.eventName.value;
            const eventDate = event.target.eventDate.value;
            const eventTime = event.target.eventTime.value;

            const eventData = {
                eventName,
                eventDate,
                eventTime,
            };

            // Store the event data in localStorage
            const currentEvents = JSON.parse(localStorage.getItem('events')) || [];
            currentEvents.push(eventData);
            localStorage.setItem('events', JSON.stringify(currentEvents));

            // Display the event in the list
            const eventList = document.getElementById('eventList');
            const listItem = document.createElement('li');
            listItem.textContent = `Event Name: ${eventName}, Event Date: ${eventDate}, Event Time: ${eventTime}`;
            eventList.appendChild(listItem);
        });
    };

    // Function to load the event list from localStorage
    const loadEventList = () => {
        const eventList = document.getElementById('eventList');
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];

        storedEvents.forEach((eventData) => {
            const listItem = document.createElement('li');
            listItem.textContent = `Event Name: ${eventData.eventName}, Event Date: ${eventData.eventDate}, Event Time: ${eventData.eventTime}`;
            eventList.appendChild(listItem);
        });
    };

    // Function to filter out expired events from localStorage
    const removeExpiredEvents = () => {
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        const currentTime = new Date();

        const filteredEvents = storedEvents.filter(eventData => {
            const eventDateTime = new Date(`${eventData.eventDate}T${eventData.eventTime}`);
            const timeDifference = currentTime - eventDateTime;
            const timeDifferenceInHours = timeDifference / 1000 / 60 / 60;
            return timeDifferenceInHours <= 24;
        });

        localStorage.setItem('events', JSON.stringify(filteredEvents));
    };

    // Remove expired events from localStorage when the page is loaded
    removeExpiredEvents();

    // Load the event list from localStorage when the page is loaded
    loadEventList();

    // Check the password and show the event form if the password is correct
    passwordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const password = event.target.password.value;
        const isCorrectPassword = checkPassword(password);

        if (isCorrectPassword) {
            showEventForm();
        } else {
            alert('Incorrect password');
        }
    });
});
