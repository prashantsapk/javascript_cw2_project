/*
   Campus Connect – plain JavaScript only.
   No jQuery, no Bootstrap JavaScript and no other libraries.
   All sample data below is fictional and is used for coursework demonstration.
*/

const events = [
    { id: "creative-coding-jam", name: "Creative Coding Jam", university: "Ulster University", campus: "Belfast", category: "Technology", image: "images/event-tech.svg", description: "Try creative coding in a welcoming workshop for all experience levels." },
    { id: "campus-culture-night", name: "Campus Culture Night", university: "Queen's University Belfast", campus: "Belfast", category: "Creative", image: "images/event-culture.svg", description: "Share music, art and stories with students from different backgrounds." },
    { id: "future-makers-meetup", name: "Future Makers Meetup", university: "Ulster University", campus: "Belfast", category: "Careers", image: "images/event-careers.svg", description: "Explore career ideas and meet other students preparing for what comes next." },
    { id: "mindful-monday", name: "Mindful Monday", university: "Queen's University Belfast", campus: "Belfast", category: "Wellbeing", image: "images/event-wellbeing.svg", description: "Enjoy a relaxed introduction to mindful habits and healthy study routines." },
    { id: "student-ideas-fair", name: "Student Ideas Fair", university: "Belfast Metropolitan College", campus: "Belfast", category: "Community", image: "images/event-careers.svg", description: "Share project ideas and discover other creative student initiatives." },
    { id: "photography-walk", name: "Belfast Photo Walk", university: "Ulster University", campus: "Belfast", category: "Creative", image: "images/event-culture.svg", description: "Discover fresh perspectives with other photography enthusiasts." }
];

const clubs = [
    { id: "code-collective", name: "Code Collective", university: "Ulster University", category: "Technology", image: "images/event-tech.svg", description: "Build beginner-friendly projects and learn together." },
    { id: "shutter-society", name: "Shutter Society", university: "Queen's University Belfast", category: "Creative", image: "images/event-culture.svg", description: "Meet students who love cameras, storytelling and art." },
    { id: "active-campus", name: "Active Campus", university: "Ulster University", category: "Sports", image: "images/event-wellbeing.svg", description: "Enjoy casual sport, team games and friendly activities." },
    { id: "music-room", name: "Music Room", university: "Belfast Metropolitan College", category: "Music", image: "images/event-culture.svg", description: "Create, listen and share your favourite sounds." },
    { id: "design-makers", name: "Design Makers", university: "Queen's University Belfast", category: "Creative", image: "images/event-careers.svg", description: "Try new design ideas with other curious students." },
    { id: "nature-and-wellbeing", name: "Nature & Wellbeing", university: "Ulster University", category: "Wellbeing", image: "images/event-wellbeing.svg", description: "Take gentle walks and recharge between study sessions." }
];

// Small helper functions keep the code easy to read.
function getElement(id) {
    return document.getElementById(id);
}

function loadItems(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

function saveItems(key, items) {
    try {
        localStorage.setItem(key, JSON.stringify(items));
        return true;
    } catch (error) {
        return false;
    }
}

function createText(tagName, value, className) {
    const element = document.createElement(tagName);
    element.textContent = value;
    if (className) element.className = className;
    return element;
}

// Build cards safely using DOM methods, without inserting user input as HTML.
function makeCard(item, type) {
    const column = document.createElement("div");
    column.className = "col-md-6 col-xl-4";

    const article = document.createElement("article");
    article.className = "listing-card";

    const image = document.createElement("img");
    image.className = "listing-image";
    image.src = item.image;
    image.alt = type === "event" ? "Illustration for " + item.name : "Illustration for " + item.name + " club";
    image.loading = "lazy";

    const content = document.createElement("div");
    content.className = "listing-content";
    content.appendChild(createText("span", item.category.toUpperCase(), "tag"));
    content.appendChild(createText("h3", item.name));
    content.appendChild(createText("p", item.description));
    content.appendChild(createText("div", item.university + (item.campus ? " · " + item.campus : ""), "listing-meta"));

    const bottom = document.createElement("div");
    bottom.className = "listing-bottom";
    bottom.appendChild(createText("span", type === "event" ? "Open to exploring students" : "Meet your people", "small text-muted"));

    const button = document.createElement("a");
    button.className = "btn btn-dark";
    button.textContent = type === "event" ? "Request to join ↗" : "Join this club ↗";
    button.href = "register.html?type=" + encodeURIComponent(type) + "&id=" + encodeURIComponent(item.id);
    bottom.appendChild(button);
    content.appendChild(bottom);
    article.appendChild(image);
    article.appendChild(content);
    column.appendChild(article);
    return column;
}

function initEventPage() {
    const search = getElement("eventSearch");
    if (!search) return;
    const university = getElement("eventUniversity");
    const category = getElement("eventCategory");
    const grid = getElement("eventGrid");
    const empty = getElement("eventEmpty");

    function render() {
        const query = search.value.trim().toLowerCase();
        const matching = events.filter(function (item) {
            const matchesSearch = (item.name + " " + item.description + " " + item.university).toLowerCase().includes(query);
            return matchesSearch && (university.value === "all" || item.university === university.value) &&
                (category.value === "all" || item.category === category.value);
        });
        grid.replaceChildren();
        matching.forEach(function (item) { grid.appendChild(makeCard(item, "event")); });
        getElement("eventCount").textContent = matching.length + " event(s) found";
        empty.classList.toggle("d-none", matching.length > 0);
    }

    search.addEventListener("input", render);
    university.addEventListener("change", render);
    category.addEventListener("change", render);
    getElement("resetFilters").addEventListener("click", function () {
        search.value = "";
        university.value = "all";
        category.value = "all";
        render();
    });
    render();
}

function initClubPage() {
    const search = getElement("clubSearch");
    if (!search) return;
    const university = getElement("clubUniversity");
    const grid = getElement("clubGrid");
    const empty = getElement("clubEmpty");

    function render() {
        const query = search.value.trim().toLowerCase();
        const matching = clubs.filter(function (item) {
            return (item.name + " " + item.description + " " + item.category).toLowerCase().includes(query) &&
                (university.value === "all" || item.university === university.value);
        });
        grid.replaceChildren();
        matching.forEach(function (item) { grid.appendChild(makeCard(item, "club")); });
        getElement("clubCount").textContent = matching.length + " club(s) found";
        empty.classList.toggle("d-none", matching.length > 0);
    }

    search.addEventListener("input", render);
    university.addEventListener("change", render);
    getElement("resetClubFilters").addEventListener("click", function () {
        search.value = "";
        university.value = "all";
        render();
    });
    render();
}

function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showFeedback(id, message, success) {
    const alert = getElement(id);
    alert.textContent = message;
    alert.className = "alert mt-4 " + (success ? "alert-success" : "alert-danger");
}

function setFieldValidity(field, valid) {
    field.classList.toggle("is-invalid", !valid);
    field.setAttribute("aria-invalid", String(!valid));
    return valid;
}

function initJoinForm() {
    const form = getElement("joinForm");
    if (!form) return;
    const type = getElement("activityType");
    const activity = getElement("activityId");
    const home = getElement("homeUniversity");
    const hostNote = getElement("hostNote");

    function fillActivities() {
        const list = type.value === "event" ? events : type.value === "club" ? clubs : [];
        activity.replaceChildren(new Option(list.length ? "Choose an activity" : "First choose an activity type", ""));
        list.forEach(function (item) {
            activity.add(new Option(item.name + " — " + item.university, item.id));
        });
        activity.disabled = list.length === 0;
        hostNote.textContent = "Choose an activity to see its host university.";
    }

    function updateHost() {
        const list = type.value === "event" ? events : clubs;
        const selected = list.find(function (item) { return item.id === activity.value; });
        if (!selected) {
            hostNote.textContent = "Choose an activity to see its host university.";
            return;
        }
        let message = "Host university: " + selected.university + ".";
        if (home.value) {
            message += home.value === selected.university ? " This is at your home university." : " This is a cross-university request!";
        }
        hostNote.textContent = message;
    }

    type.addEventListener("change", function () { fillActivities(); updateHost(); });
    home.addEventListener("change", updateHost);
    activity.addEventListener("change", updateHost);

    const query = new URLSearchParams(window.location.search);
    if (query.get("type") === "event" || query.get("type") === "club") {
        type.value = query.get("type");
    }
    fillActivities();
    if (query.get("id") && Array.from(activity.options).some(function (option) { return option.value === query.get("id"); })) {
        activity.value = query.get("id");
    }
    updateHost();

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const nameField = getElement("studentName");
        const emailField = getElement("studentEmail");
        const consent = getElement("demoConsent");
        const name = nameField.value.trim();
        const email = emailField.value.trim();
        let valid = true;
        if (!setFieldValidity(nameField, name.length >= 2)) valid = false;
        if (!setFieldValidity(emailField, isEmail(email))) valid = false;
        if (!setFieldValidity(home, home.value !== "")) valid = false;
        if (!setFieldValidity(type, type.value !== "")) valid = false;
        if (!setFieldValidity(activity, activity.value !== "")) valid = false;
        if (!setFieldValidity(consent, consent.checked)) valid = false;
        if (!valid) { showFeedback("joinAlert", "Please complete the highlighted fields correctly.", false); return; }

        const list = type.value === "event" ? events : clubs;
        const selected = list.find(function (item) { return item.id === activity.value; });
        if (!selected) { showFeedback("joinAlert", "Please choose a valid activity.", false); return; }

        const joins = loadItems("campusConnectJoins");
        const isDuplicate = joins.some(function (item) {
            return item.email.toLowerCase() === email.toLowerCase() && item.activityId === selected.id && item.type === type.value;
        });
        if (isDuplicate) { showFeedback("joinAlert", "You already saved a request for this activity with this email. See My Activity.", false); return; }

        joins.push({
            id: Date.now().toString() + "-" + Math.random().toString(36).slice(2, 7),
            name: name,
            email: email,
            homeUniversity: home.value,
            hostUniversity: selected.university,
            type: type.value,
            activityId: selected.id,
            activityName: selected.name,
            message: getElement("joinMessage").value.trim(),
            created: new Date().toLocaleDateString("en-GB")
        });
        if (!saveItems("campusConnectJoins", joins)) { showFeedback("joinAlert", "Could not save, fill the details properly", false); return; }
        form.reset();
        fillActivities();
        showFeedback("joinAlert", "Request submitted", true);
    });
}

function initContactForm() {
    const form = getElement("contactForm");
    if (!form) return;
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = getElement("contactName");
        const email = getElement("contactEmail");
        const from = getElement("contactFrom");
        const to = getElement("contactTo");
        const subject = getElement("contactSubject");
        const message = getElement("contactMessage");
        const consent = getElement("contactConsent");
        let valid = true;
        if (!setFieldValidity(name, name.value.trim().length >= 2)) valid = false;
        if (!setFieldValidity(email, isEmail(email.value.trim()))) valid = false;
        if (!setFieldValidity(from, from.value !== "")) valid = false;
        if (!setFieldValidity(to, to.value !== "")) valid = false;
        if (!setFieldValidity(subject, subject.value.trim().length >= 3)) valid = false;
        if (!setFieldValidity(message, message.value.trim().length >= 10)) valid = false;
        if (!setFieldValidity(consent, consent.checked)) valid = false;
        if (!valid) { showFeedback("contactAlert", "Please complete the highlighted fields correctly.", false); return; }

        const saved = loadItems("campusConnectMessages");
        saved.push({
            id: Date.now().toString() + "-" + Math.random().toString(36).slice(2, 7),
            name: name.value.trim(), email: email.value.trim(),
            from: from.value, to: to.value,
            subject: subject.value.trim(), message: message.value.trim(),
            created: new Date().toLocaleDateString("en-GB")
        });
        if (!saveItems("campusConnectMessages", saved)) { showFeedback("contactAlert", "Could not save your message locally.", false); return; }
        form.reset();
        showFeedback("contactAlert", "Message draft saved in My Activity. It was not sent to the university.", true);
    });
}

function savedCard(title, details, id, key, onDelete) {
    const card = document.createElement("article");
    card.className = "saved-card";
    card.appendChild(createText("h4", title));
    details.forEach(function (detail) { card.appendChild(createText("p", detail)); });
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-danger";
    button.textContent = "Remove";
    button.setAttribute("aria-label", "Remove " + title);
    button.addEventListener("click", function () {
        const remaining = loadItems(key).filter(function (item) { return item.id !== id; });
        if (saveItems(key, remaining)) onDelete();
    });
    card.appendChild(button);
    return card;
}

function initDashboard() {
    const joinList = getElement("joinList");
    if (!joinList) return;
    const messageList = getElement("messageList");

    function emptyMessage(text, target, href, linkText) {
        const box = document.createElement("div");
        box.className = "saved-empty";
        box.appendChild(createText("p", text));
        const link = createText("a", linkText, "btn btn-dark btn-sm");
        link.href = href;
        box.appendChild(link);
        target.appendChild(box);
    }

    function render() {
        const joins = loadItems("campusConnectJoins");
        const messages = loadItems("campusConnectMessages");
        getElement("totalJoins").textContent = String(joins.length);
        getElement("totalMessages").textContent = String(messages.length);
        getElement("totalUniversities").textContent = String(new Set(joins.map(function (item) { return item.hostUniversity; })).size);
        joinList.replaceChildren();
        messageList.replaceChildren();
        if (!joins.length) emptyMessage("No join requests saved yet.", joinList, "events.html", "Find an event");
        joins.slice().reverse().forEach(function (item) {
            joinList.appendChild(savedCard(item.activityName, [
                "Type: " + item.type,
                "From: " + item.homeUniversity + " → Host: " + item.hostUniversity,
                "Student: " + item.name + " · " + item.email,
                "Saved: " + item.created
            ], item.id, "campusConnectJoins", render));
        });
        if (!messages.length) emptyMessage("No message drafts saved yet.", messageList, "connect.html", "Write a message");
        messages.slice().reverse().forEach(function (item) {
            messageList.appendChild(savedCard(item.subject, [
                "To: " + item.to,
                "From: " + item.name + " (" + item.from + ")",
                "Message: " + item.message,
                "Saved: " + item.created
            ], item.id, "campusConnectMessages", render));
        });
    }
    render();
}

document.addEventListener("DOMContentLoaded", function () {
    initEventPage();
    initClubPage();
    initJoinForm();
    initContactForm();
    initDashboard();
});