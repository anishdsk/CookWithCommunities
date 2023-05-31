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
            listItem.textContent = `Event: ${eventName} | Date: ${eventDate} | Time: ${eventTime} `;

            // Add a delete button next to each event
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                deleteEvent(currentEvents.indexOf(eventData));
            });

            listItem.appendChild(deleteButton);
            eventList.appendChild(listItem);
        });
    };

    // Function to load the event list from localStorage
    const loadEventList = (showDeleteButton = false) => {
        const eventList = document.getElementById('eventList');
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];

        storedEvents.forEach((eventData, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `Event: ${eventData.eventName} | Date: ${eventData.eventDate} | Time: ${eventData.eventTime} `;

            if (showDeleteButton) {
                // Add a delete button next to each event
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', () => deleteEvent(index));

                listItem.appendChild(deleteButton);
            }

            eventList.appendChild(listItem);
        });
    };

    // Function to delete an event from the list and localStorage
    const deleteEvent = (index) => {
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        storedEvents.splice(index, 1);
        localStorage.setItem('events', JSON.stringify(storedEvents));

        // Reload the event list
        const eventList = document.getElementById('eventList');
        eventList.innerHTML = '';
        loadEventList(true);
    };

    // Remove the passwordEntered flag from localStorage on page refresh
    localStorage.removeItem('passwordEntered');

    // Load the event list from localStorage when the page is loaded
    const showDeleteButton = JSON.parse(localStorage.getItem('passwordEntered')) || false;
    loadEventList(showDeleteButton);

    // Check password and show event form if password is correct
    passwordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const password = event.target.password.value;
        const isCorrectPassword = checkPassword(password);

        if (isCorrectPassword) {
            showEventForm();
            const eventList = document.getElementById('eventList');
            eventList.innerHTML = '';
            loadEventList(true); // Load the event list with the delete button visible
            localStorage.setItem('passwordEntered', JSON.stringify(true));
        } else {
            alert('Incorrect password');
        }
    });
});
