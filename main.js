const API_URL = "http://localhost:3000";

// LOAD POSTS
function loadPosts() {
    fetch(`${API_URL}/posts`)
        .then(res => res.json())
        .then(posts => {
            const body = document.getElementById("body-table");
            body.innerHTML = "";

            posts.forEach(p => {
                const tr = document.createElement("tr");

                if (p.isDeleted === true) {
                    tr.style.textDecoration = "line-through";
                    tr.style.color = "gray";
                }

                tr.innerHTML = `
                    <td>${p.id}</td>
                    <td>${p.title}</td>
                    <td>${p.views}</td>
                    <td>
                        <button onclick="softDeletePost('${p.id}')">Delete</button>
                    </td>
                `;

                body.appendChild(tr);
            });
        });
}

// AUTO LOAD
loadPosts();

// GENERATE ID
function generateNewId(posts) {
    let maxId = 0;
    posts.forEach(p => {
        const idNum = parseInt(p.id);
        if (idNum > maxId) maxId = idNum;
    });
    return (maxId + 1).toString();
}

// CREATE POST
function Save() {
    fetch(`${API_URL}/posts`)
        .then(res => res.json())
        .then(posts => {
            const newPost = {
                id: generateNewId(posts),
                title: document.getElementById("title_txt").value,
                views: document.getElementById("views_txt").value,
                isDeleted: false
            };

            fetch(`${API_URL}/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPost)
            }).then(() => loadPosts());
        });
}

// SOFT DELETE
function softDeletePost(id) {
    fetch(`${API_URL}/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    }).then(() => loadPosts());
}

/* ================= COMMENTS CRUD ================= */

// CREATE COMMENT
function createComment(text, postId) {
    fetch(`${API_URL}/comments`)
        .then(res => res.json())
        .then(comments => {
            let maxId = 0;
            comments.forEach(c => {
                const idNum = parseInt(c.id);
                if (idNum > maxId) maxId = idNum;
            });

            const newComment = {
                id: (maxId + 1).toString(),
                text,
                postId
            };

            fetch(`${API_URL}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newComment)
            });
        });
}

// READ COMMENT
function getCommentsByPost(postId) {
    fetch(`${API_URL}/comments?postId=${postId}`)
        .then(res => res.json())
        .then(data => console.log(data));
}

// UPDATE COMMENT
function updateComment(id, newText) {
    fetch(`${API_URL}/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText })
    });
}

// DELETE COMMENT
function deleteComment(id) {
    fetch(`${API_URL}/comments/${id}`, {
        method: "DELETE"
    });
}
