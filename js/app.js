const apiBaseUrl = "mongodb://127.0.0.1:27017/foro-trading";

// Elementos del DOM
const topicList = document.getElementById("topic-list");
const repliesSection = document.getElementById("replies");
const replyList = document.getElementById("reply-list");
const repliesTitle = document.getElementById("replies-title");
const newTopicForm = document.getElementById("new-topic-form");
const backToTopics = document.getElementById("back-to-topics");
const topicForm = document.getElementById("topic-form");
const replyForm = document.getElementById("reply-form");

// Estado
let currentTopicId = null;

// Mostrar los temas del foro
async function loadTopics() {
    const res = await fetch(`${apiBaseUrl}/forum/topics`);
    const topics = await res.json();

    topicList.innerHTML = ""; // Limpiar lista
    topics.forEach(topic => {
        const li = document.createElement("li");
        li.innerHTML = `
            <h3>${topic.title}</h3>
            <p>${topic.description}</p>
            <button onclick="viewReplies('${topic._id}')">Ver Respuestas</button>
        `;
        topicList.appendChild(li);
    });
}

// Ver respuestas de un tema
async function viewReplies(topicId) {
    currentTopicId = topicId;
    const res = await fetch(`${apiBaseUrl}/forum/topics/${topicId}/replies`);
    const replies = await res.json();

    replyList.innerHTML = ""; // Limpiar respuestas
    replies.forEach(reply => {
        const li = document.createElement("li");
        li.innerHTML = `<p>${reply.message} - <strong>${reply.author.username}</strong></p>`;
        replyList.appendChild(li);
    });

    repliesSection.classList.remove("hidden");
    repliesTitle.textContent = "Respuestas al tema";
}

// Crear un nuevo tema
topicForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("topic-title").value;
    const description = document.getElementById("topic-description").value;

    await fetch(`${apiBaseUrl}/forum/topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, author: "USER_ID" }), // Sustituir con el ID del usuario actual
    });

    newTopicForm.classList.add("hidden");
    loadTopics();
});

// Crear una nueva respuesta
replyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = document.getElementById("reply-message").value;

    await fetch(`${apiBaseUrl}/forum/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: currentTopicId, message, author: "USER_ID" }), // Sustituir con el ID del usuario actual
    });

    viewReplies(currentTopicId);
});

// Botón para volver a la lista de temas
backToTopics.addEventListener("click", () => {
    repliesSection.classList.add("hidden");
    loadTopics();
});

// Cargar los temas al inicio
loadTopics();
