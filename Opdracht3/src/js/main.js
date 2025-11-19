// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap’s JS
import * as bootstrap from 'bootstrap'
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM Elementen Selecteren ---
    const postIdInput = document.getElementById('ex3_post_id');
    const loadButton = document.getElementById('ex3_btn');
    const statusDiv = document.getElementById('ex3_status');
    const postCard = document.getElementById('ex3_post_card');
    const postTitle = document.getElementById('ex3_title');
    const postBody = document.getElementById('ex3_body');
    const commentsCard = document.getElementById('ex3_comments_card');
    const commentsList = document.getElementById('ex3_comments_list');
    
    // De basis URL van de API
    const BASE_URL = 'https://jsonplaceholder.typicode.com';

    // --- Hulpfuncties ---

    /**
     * Werkt de statusmelding bij in de #ex3_status div.
     * @param {string} message De te tonen tekst.
     * @param {('secondary'|'warning'|'success'|'danger')} type De Bootstrap alert klasse.
     */
    const updateStatus = (message, type = 'secondary') => {
        statusDiv.className = `alert alert-${type} mb-3`;
        statusDiv.textContent = message;
    };

    /**
     * Maakt de UI schoon en verbergt de resultaatkaarten.
     */
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

    // --- 2. Hoofd Logica Functie (`async/await` en `try/catch`) ---
    const loadPost = async () => {
        const postId = postIdInput.value.trim();

        // 1. Validatie: Controleer of het ID ingevuld is en een getal is.
        if (!postId || isNaN(postId) || parseInt(postId) <= 0) {
            resetUI();
            updateStatus('Fout: Gelieve een geldig Post ID (een positief getal) in te vullen.', 'danger');
            return;
        }

        // 2. Loading Status: Toon dat er geladen wordt.
        resetUI();
        updateStatus('Bezig met laden...', 'warning');

        try {
            const id = parseInt(postId);
            
            // Haal de post en comments parallel op met Promise.all
            const [postResponse, commentsResponse] = await Promise.all([
                fetch(`${BASE_URL}/posts/${id}`),
                fetch(`${BASE_URL}/comments?postId=${id}`)
            ]);

            // Controleer de Post Response op fouten (bv. 404 Not Found)
            if (!postResponse.ok) {
                // Werkt voor Post ID's die niet bestaan (bv. id 101)
                throw new Error(`Post met ID ${id} niet gevonden.`);
            }

            // --- 3. Post Verwerken ---
            const postData = await postResponse.json();
            
            // Titel tonen
            postTitle.textContent = postData.title;
            // Body tonen
            postBody.textContent = postData.body;
            
            // De kaart zichtbaar maken
            postCard.classList.remove('d-none');

            // --- 4. Comments Verwerken ---
            
            // Controleer de Comments Response (hoewel JSONPlaceholder vaak een lege array teruggeeft, niet een fout)
            if (!commentsResponse.ok) {
                 // Log de fout, maar toon de post wel
                 console.error("Fout bij het ophalen van comments.");
            }
            
            const commentsData = await commentsResponse.json();

            // Toon de comments kaart
            commentsCard.classList.remove('d-none');

            if (commentsData.length > 0) {
                // Verberg de 'Nog geen comments geladen' melding
                document.getElementById('ex3_comments_empty').classList.add('d-none');
                
                // Maak een lijstitem voor elke comment
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
                // Toon een melding als er geen comments zijn gevonden
                document.getElementById('ex3_comments_empty').classList.remove('d-none');
                document.getElementById('ex3_comments_empty').textContent = 'Er zijn geen comments gevonden voor deze post.';
            }
            
            // 5. Succesmelding tonen
            updateStatus('Post en comments succesvol geladen!', 'success');

        } catch (error) {
            // 5. Foutafhandeling: Toon een rode foutmelding
            console.error('Laadfout:', error);
            resetUI();
            updateStatus(`Fout: ${error.message || 'Er is een onbekende fout opgetreden.'} Controleer uw internetverbinding of het ID.`, 'danger');
        }
    };

    // --- 3. Event Listener ---
    loadButton.addEventListener('click', loadPost);
});