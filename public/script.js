document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const categoryTagsContainer = document.getElementById('category-tags');
    const speakerSearchInput = document.getElementById('speaker-search-input');
    const clearFiltersBtn = document.getElementById('clear-filters-btn'); // New: Get clear filters button
    let allScheduleData = [];
    let activeCategories = new Set();
    let speakerSearchTerm = '';

    speakerSearchInput.addEventListener('input', (event) => {
        speakerSearchTerm = event.target.value.toLowerCase();
        filterSchedule();
    });

    clearFiltersBtn.addEventListener('click', () => { // New: Event listener for clear filters button
        activeCategories.clear();
        speakerSearchInput.value = '';
        speakerSearchTerm = '';
        updateCategoryTagsUI();
        filterSchedule();
    });

    async function fetchSchedule() {
        scheduleContainer.innerHTML = '<p class="loading-message">Loading schedule...</p>'; // Show loading message

        try {
            const response = await fetch('/api/schedule');
            allScheduleData = await response.json();
            renderSchedule(allScheduleData);
            renderCategoryFilters(allScheduleData);
        } catch (error) {
            console.error('Error fetching schedule:', error);
            scheduleContainer.innerHTML = '<p class="error-message">Failed to load schedule. Please try again later.</p>'; // Show specific error message
        }
    }

    function renderSchedule(scheduleToRender) {
        scheduleContainer.innerHTML = ''; // Clear previous schedule

        scheduleToRender.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');
            if (event.type === 'break') {
                eventCard.classList.add('break');
            } else if (event.type === 'transition') {
                eventCard.classList.add('transition');
            }

            let detailsHtml = '';
            if (event.type === 'talk') {
                const speakersHtml = event.speakers ? `<p class="speakers">Speaker(s): ${event.speakers.join(', ')}</p>` : '';
                const categoriesHtml = event.categories ?
                    `<div class="event-categories">
                        ${event.categories.map(cat => `<span class="event-category-item">${cat}</span>`).join('')}
                    </div>` : '';
                detailsHtml = `
                    <h3>${event.title}</h3>
                    ${speakersHtml}
                    ${categoriesHtml}
                    <button class="description-toggle">Show Description</button>
                    <div class="event-description hidden">
                        <p>${event.description}</p>
                    </div>
                `;
            } else if (event.type === 'break' || event.type === 'transition') {
                detailsHtml = `<h3>${event.title}</h3>`;
            }

            eventCard.innerHTML = `
                <div class="event-time">
                    ${event.startTime} - ${event.endTime} (${event.duration} min)
                </div>
                <div class="event-details">
                    ${detailsHtml}
                </div>
            `;
            scheduleContainer.appendChild(eventCard);

            if (event.type === 'talk') {
                const toggleButton = eventCard.querySelector('.description-toggle');
                const descriptionDiv = eventCard.querySelector('.event-description');
                if (toggleButton) {
                    toggleButton.addEventListener('click', () => {
                        descriptionDiv.classList.toggle('hidden');
                        toggleButton.textContent = descriptionDiv.classList.contains('hidden') ? 'Show Description' : 'Hide Description';
                    });
                }
            }
        });
    }

    function renderCategoryFilters(schedule) {
        const uniqueCategories = new Set();
        schedule.forEach(event => {
            if (event.type === 'talk' && event.categories) {
                event.categories.forEach(cat => uniqueCategories.add(cat));
            }
        });

        categoryTagsContainer.innerHTML = ''; // Clear previous tags

        // Add an "All" button
        const allTag = document.createElement('span');
        allTag.classList.add('category-tag');
        allTag.textContent = 'All';
        allTag.addEventListener('click', () => {
            activeCategories.clear();
            updateCategoryTagsUI();
            filterSchedule();
        });
        categoryTagsContainer.appendChild(allTag);

        Array.from(uniqueCategories).sort().forEach(category => {
            const tag = document.createElement('span');
            tag.classList.add('category-tag');
            tag.textContent = category;
            tag.addEventListener('click', () => {
                if (activeCategories.has(category)) {
                    activeCategories.delete(category);
                } else {
                    activeCategories.add(category);
                }
                updateCategoryTagsUI();
                filterSchedule();
            });
            categoryTagsContainer.appendChild(tag);
        });
        updateCategoryTagsUI(); // Initial update to set 'All' as active
    }

    function updateCategoryTagsUI() {
        const allTags = categoryTagsContainer.querySelectorAll('.category-tag');
        allTags.forEach(tag => {
            if (tag.textContent === 'All') {
                if (activeCategories.size === 0) {
                    tag.classList.add('active');
                } else {
                    tag.classList.remove('active');
                }
            } else {
                if (activeCategories.has(tag.textContent)) {
                    tag.classList.add('active');
                } else {
                    tag.classList.remove('active');
                }
            }
        });
    }


    function filterSchedule() {
        let filteredSchedule = allScheduleData;

        const isCategoryFilterActive = activeCategories.size > 0;
        const isSpeakerFilterActive = speakerSearchTerm.trim() !== '';

        if (!isCategoryFilterActive && !isSpeakerFilterActive) {
            renderSchedule(allScheduleData); // Show all if no filters active
            return;
        }

        filteredSchedule = allScheduleData.filter(event => {
            if (event.type !== 'talk') {
                return true; // Always show breaks and transitions
            }

            let matchesCategory = true;
            if (isCategoryFilterActive) {
                matchesCategory = event.categories && event.categories.some(cat => activeCategories.has(cat));
            }

            let matchesSpeaker = true;
            if (isSpeakerFilterActive) {
                matchesSpeaker = event.speakers && event.speakers.some(speaker =>
                    speaker.toLowerCase().includes(speakerSearchTerm)
                );
            }

            // A talk must match BOTH active category filters (if any) AND speaker filter (if any)
            return matchesCategory && matchesSpeaker;
        });
        renderSchedule(filteredSchedule);
    }

    fetchSchedule();
});
