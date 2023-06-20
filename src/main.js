document.getElementById("addEventBtn").addEventListener("click", function () {
    const password = prompt("Enter the admin password:");

    if (password === "cwcadminpassword") {
        const event = prompt("Enter event name:");
        const location = prompt("Enter location:");
        const time = prompt("Enter time:");
        const foods = prompt("Enter foods:");

        const table = document.getElementById("eventsTable").getElementsByTagName("tbody")[0];
        const newRow = table.insertRow();

        newRow.insertCell(0).textContent = event;
        newRow.insertCell(1).textContent = location;
        newRow.insertCell(2).textContent = time;
        newRow.insertCell(3).textContent = foods;
    } else {
        alert("Incorrect password!");
    }
});

document.getElementById("deleteEventBtn").addEventListener("click", function () {
    const password = prompt("Enter the admin password:");

    if (password === "cwcadminpassword") {
        const eventName = prompt("Enter the name of the event to be deleted:");
        const table = document.getElementById("eventsTable").getElementsByTagName("tbody")[0];

        let isDeleted = false;
        for (let i = 0; i < table.rows.length; i++) {
            const row = table.rows[i];
            const eventCell = row.cells[0];
            if (eventCell.textContent === eventName) {
                table.deleteRow(i);
                isDeleted = true;
                break;
            }
        }
        if (!isDeleted) {
            alert("Event not found!");
        }
    } else {
        alert("Incorrect password!");
    }
});
