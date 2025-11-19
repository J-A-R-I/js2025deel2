// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap’s JS
import * as bootstrap from 'bootstrap'
document.addEventListener('DOMContentLoaded', () => {

    const postIdInput = document.getElementById('ex3_post_id');
    const loadButton = document.getElementById('ex3_btn');
    const statusDiv = document.getElementById('ex3_status');
    const postCard = document.getElementById('ex3_post_card');
    const postTitle = document.getElementById('ex3_title');
    const postBody = document.getElementById('ex3_body');
    const commentsCard = document.getElementById('ex3_comments_card');
    const commentsList = document.getElementById('ex3_comments_list');
    
    const BASE_URL = 'https://jsonplaceholder.typicode.com';



    const updateStatus = (message, type = 'secondary') => {
        statusDiv.className = `alert alert-${type} mb-3`;
        statusDiv.textContent = message;
    };

    const resetUI = () => {
        postCard.classList.add('d-none');
        commentsCard.classList.add('d-none');
        postTitle.textContent = '';
        postBody.textContent = '';
        commentsList.innerHTML = '';
        // Zorg ervoor dat de 'Nog geen comments geladen' boodschap niet dubbel verschijnt
        // We verwijderen alle li's, dus we hebben de div niet echt nodig
        document.getElementById('ex3_comments_empty').classList.remove('d-none');
    };

    const loadPost = async () => {
        const postId = postIdInput.value.trim();

        if (!postId || isNaN(postId) || parseInt(postId) <= 0) {
            resetUI();
            updateStatus('Fout: Gelieve een geldig Post ID (een positief getal) in te vullen.', 'danger');
            return;
        }

        resetUI();
        updateStatus('Bezig met laden...', 'warning');

        try {
            const id = parseInt(postId);
            
            const [postResponse, commentsResponse] = await Promise.all([
                fetch(`${BASE_URL}/posts/${id}`),
                fetch(`${BASE_URL}/comments?postId=${id}`)
            ]);

            if (!postResponse.ok) {
                throw new Error(`Post met ID ${id} niet gevonden.`);
            }

            const postData = await postResponse.json();
            
            postTitle.textContent = postData.title;
            postBody.textContent = postData.body;
            
            postCard.classList.remove('d-none');

            

            if (!commentsResponse.ok) {
                 console.error("Fout bij het ophalen van comments.");
            }
            
            const commentsData = await commentsResponse.json();

            commentsCard.classList.remove('d-none');

            if (commentsData.length > 0) {
                document.getElementById('ex3_comments_empty').classList.add('d-none');
                
                commentsData.forEach(comment => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.innerHTML = `
                        <p class="mb-1"><strong>${comment.name}</strong> &mdash; <em>${comment.email}</em></p>
                        <p class="mb-0 small">${comment.body}</p>
                    `;
                    commentsList.appendChild(listItem);
                });
            } else {
                document.getElementById('ex3_comments_empty').classList.remove('d-none');
                document.getElementById('ex3_comments_empty').textContent = 'Er zijn geen comments gevonden voor deze post.';
            }
            
            updateStatus('Post en comments succesvol geladen!', 'success');

        } catch (error) {
            console.error('Laadfout:', error);
            resetUI();
            updateStatus(`Fout: ${error.message || 'Er is een onbekende fout opgetreden.'} Controleer uw internetverbinding of het ID.`, 'danger');
        }
    };

    loadButton.addEventListener('click', loadPost);
});