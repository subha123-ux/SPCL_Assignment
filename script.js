let bookedDates = JSON.parse(localStorage.getItem("bookedDates")) || {
    "2025-04-15": "Wedding Reception",
    "2025-04-20": "Corporate Meeting"
};

const upcomingEvents = [
    {
        name: "Tech Conference",
        date: "2025-04-22",
        location: "Delhi Expo Center"
    },
    {
        name: "Music Festival",
        date: "2025-04-25",
        location: "Greenfield Grounds"
    },
    {
        name: "Startup Meetup",
        date: "2025-04-28",
        location: "Nehru Place Auditorium"
    },
    {
        name: "Media Conference",
        date: "2025-04-30",
        location: "Kolkata"
    },
    {
        name: "Movie Festival",
        date: "2025-06-13",
        location: "Hydrabad"
    },
    {
        name: "Magic Show",
        date: "2025-10-15",
        location: "Pune"
    },
];

function showUpcomingEvents() {
    const container = document.getElementById("events-list");
    container.innerHTML = "";
    upcomingEvents.forEach(event => {
        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
        <h3>${event.name}</h3>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <button onclick="preFillBooking('${event.date}', '${event.name}')">Book Now</button>
      `;
        container.appendChild(card);
    });
}

function preFillBooking(date, details) {
    document.getElementById("event-date")._flatpickr.setDate(date, true);
    document.getElementById("details").value = details;
    document.getElementById("event-info").innerText = "Pre-filled event selected.";
}

let selectedCalendarDate = null;

flatpickr("#calendar", {
    inline: true,
    dateFormat: "Y-m-d",
    minDate: "today",
    onDayCreate: function (_, __, ___, dayElem) {
        const dateStr = flatpickr.formatDate(dayElem.dateObj, "Y-m-d");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dayElem.dateObj >= today) {
            if (bookedDates[dateStr]) {
                dayElem.classList.add("booked-date");
            } else {
                dayElem.classList.add("available-date");
            }
        }
    },
    onChange: function (_, dateStr) {
        selectedCalendarDate = dateStr;
        const info = document.getElementById("event-info");
        info.innerText = bookedDates[dateStr]
            ? `Booked: ${bookedDates[dateStr]}`
            : "Date is available for booking.";
    }
});

flatpickr("#event-date", {
    dateFormat: "Y-m-d",
    minDate: "today",
    disable: Object.keys(bookedDates),
    onChange: function (_, dateStr) {
        const info = document.getElementById("event-info");
        info.innerText = bookedDates[dateStr]
            ? `Booked: ${bookedDates[dateStr]}`
            : "Date is available for booking.";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    showUpcomingEvents();

    const form = document.getElementById("booking-form");
    const summaryBox = document.getElementById("booking-summary");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const contact = document.getElementById("contact").value.trim();
        const details = document.getElementById("details").value.trim();
        const selectedDate = document.getElementById("event-date").value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!name || !email || !contact || !details || !selectedDate) {
            alert("Please fill out all required fields including date.");
            return;
        }

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!phoneRegex.test(contact)) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        document.getElementById("summary-name").innerText = name;
        document.getElementById("summary-email").innerText = email;
        document.getElementById("summary-contact").innerText = contact;
        document.getElementById("summary-date").innerText = selectedDate;
        document.getElementById("summary-details").innerText = details;

        form.style.display = "none";
        summaryBox.style.display = "block";
    });

    document.getElementById("confirm-booking").addEventListener("click", function () {
        const selectedDateStr = document.getElementById("summary-date").innerText;
        const details = document.getElementById("summary-details").innerText;

        bookedDates[selectedDateStr] = details;

        localStorage.setItem("bookedDates", JSON.stringify(bookedDates));

        document.getElementById("calendar")._flatpickr.redraw();
        document.getElementById("event-date")._flatpickr.set("disable", Object.keys(bookedDates));

        alert("Thank you! Your event has been successfully booked.");
        location.reload();
    });
});

document.getElementById("cancel-date-btn").addEventListener("click", () => {
    if (!selectedCalendarDate) {
        alert("Please select a date from the calendar first.");
        return;
    }

    if (bookedDates[selectedCalendarDate]) {
        const confirmCancel = confirm(`Cancel booking on ${selectedCalendarDate}?`);
        if (confirmCancel) {
            delete bookedDates[selectedCalendarDate];
            localStorage.setItem("bookedDates", JSON.stringify(bookedDates));

            document.getElementById("calendar")._flatpickr.redraw();
            document.getElementById("event-date")._flatpickr.set("disable", Object.keys(bookedDates));

            alert(`Booking for ${selectedCalendarDate} has been cancelled.`);
        }
    } else {
        alert(`No booking found for ${selectedCalendarDate}.`);
    }

    selectedCalendarDate = null;
});
