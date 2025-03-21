document.addEventListener('DOMContentLoaded', () => {
    const eventsList = document.getElementById('events-list');
    const bookmarkedEvents = document.getElementById('bookmarked-events');
    const searchInput = document.getElementById('search');
    const filterType = document.getElementById('filter-type');
    const uploadEventForm = document.getElementById('upload-event-form');

    let events = JSON.parse(localStorage.getItem('events')) || [];
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

    // Display events on page load
    displayEvents(events);
    displayBookmarkedEvents();

    // Event listener for search input
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredEvents = events.filter(event => event.name.toLowerCase().includes(searchTerm));
        displayEvents(filteredEvents);
    });

    // Event listener for filter type
    filterType.addEventListener('change', () => {
        const selectedType = filterType.value;
        const filteredEvents = selectedType ? events.filter(event => event.type === selectedType) : events;
        displayEvents(filteredEvents);
    });

    // Display events
    function displayEvents(eventsToDisplay) {
        eventsList.innerHTML = '';
        eventsToDisplay.forEach(event => {
            const eventDiv = document.createElement