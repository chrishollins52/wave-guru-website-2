// --- Global State and Utility Functions ---
// Use global variables for Firebase configuration and authentication token
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- Firebase Imports and Initialization ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithCustomToken, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

let db, auth;
let userId;

// This will store the data from Firestore
let waveTips = [];

let waverData = [
    { id: 1, name: 'Waver 1', team: 'Team: Elite Waves', origin: 'Origin: Los Angeles, CA' },
    { id: 2, name: 'Waver 2', team: 'Team: The Wave Gods', origin: 'Origin: New York, NY' },
    { id: 3, name: 'Waver 3', team: 'Team: Crown Control', origin: 'Origin: Atlanta, GA' },
    { id: 4, name: 'Waver 4', team: 'Team: The Gauntlet', origin: 'Origin: Houston, TX' },
    { id: 5, name: 'Waver 5', team: 'Team: Wave Chasers', origin: 'Origin: Chicago, IL' },
    { id: 6, name: 'Waver 6', team: 'Team: Master Combers', origin: 'Origin: Miami, FL' },
    { id: 7, name: 'Waver 7', team: 'Team: Spiral Kings', origin: 'Origin: Washington, DC' },
    { id: 8, name: 'Waver 8', team: 'Team: The Unravelers', origin: 'Origin: Philadelphia, PA' },
    { id: 9, name: 'Waver 9', team: 'Team: Deep Tides', origin: 'Origin: Dallas, TX' },
    { id: 10, name: 'Waver 10', team: 'Team: The Monarchs', origin: 'Origin: Oakland, CA' }
];

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    document.getElementById(id).classList.remove('active');
}

function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) {
        console.error("Toast notification element not found.");
        return;
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- Mobile Menu ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}


// --- Ask Guru AI (Main Section) ---
const mainAskGuruForm = document.getElementById('main-ask-guru-form');
const mainAiQuestionInput = document.getElementById('main-ai-question');
const mainAiResponseContainer = document.getElementById('main-ai-response-container');
const mainAiResponseDiv = document.getElementById('main-ai-response');
const mainAiLoadingIndicator = document.getElementById('main-ai-loading-indicator');

// This entire block has been updated with the correct API information.
if (mainAskGuruForm && mainAiQuestionInput) {
    mainAskGuruForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const question = mainAiQuestionInput.value.trim();
        if (question === '') {
            return;
        }

        if (mainAiLoadingIndicator) mainAiLoadingIndicator.classList.remove('hidden');
        if (mainAiResponseContainer) mainAiResponseContainer.classList.add('hidden');

        // **API Key is now populated with the key you provided**
        const apiKey = 'AIzaSyDZVzNeFqZFznLWiSHlplGCrNo8o1cs91I';
            
        // **Updated API Endpoint to the correct Gemini model**
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: question
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error('API request failed:', response.status, errorDetails);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            const aiResponse = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] ? data.candidates[0].content.parts[0].text : "No response found.";

            if (mainAiResponseDiv) mainAiResponseDiv.textContent = aiResponse;

        } catch (error) {
            if (mainAiResponseDiv) mainAiResponseDiv.textContent = `Sorry, an error occurred: ${error.message}. Please check the console for details.`;
            console.error('Error fetching data from API:', error);

        } finally {
            if (mainAiLoadingIndicator) mainAiLoadingIndicator.classList.add('hidden');
            if (mainAiResponseContainer) mainAiResponseContainer.classList.remove('hidden');
        }
    });
}


// --- Wave Journey Planner ---
const journeyForm = document.getElementById('wave-routine-form');
const routineLoadingIndicator = document.getElementById('routine-loading-indicator');
const routineResponseContainer = document.getElementById('routine-response-container');
const routineResponseDiv = document.getElementById('routine-response');

if (journeyForm) {
    journeyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (routineLoadingIndicator) routineLoadingIndicator.classList.remove('hidden');
        if (routineResponseContainer) routineResponseContainer.classList.add('hidden');

        const stage = document.getElementById('wave-stage').value;
        const hairType = document.getElementById('hair-type').value;
        const goal = document.getElementById('wave-goal').value;
        const pattern = document.getElementById('desired-pattern').value;

        setTimeout(() => {
            let brushRecommendation = "a Medium Bristle Brush";
            if (hairType === "Coarse/Thick") {
                brushRecommendation = "a Hard Bristle Brush";
            } else if (hairType === "Fine/Soft") {
                brushRecommendation = "a Soft Bristle Brush";
            }

            const routineResponse = `
                <h4 class="text-xl font-bold text-cyan-400">Your Guru Routine for ${pattern}:</h4>
                <p>Based on your current stage as a <strong>${stage}</strong> with <strong>${hairType}</strong> hair, here is your personalized plan:</p>
                <ol class="list-decimal list-inside mt-4 space-y-2 text-gray-200">
                    <li><strong>Daily Brushing:</strong> Use ${brushRecommendation} for at least 30 minutes a day, divided into sessions. Consistent, even strokes are vital for your ${pattern} pattern.</li>
                    <li><strong>Washing:</strong> Wash your hair once a week with a moisturizing, sulfate-free shampoo. Brush with the shampoo in your hair to lay it down.</li>
                    <li><strong>Compression:</strong> A durag or wave cap is your best friend. Wear it at all times when not brushing, especially at night.</li>
                    <li><strong>Moisturizing:</strong> Apply a small amount of pomade or shea butter to keep your waves laid and healthy.</li>
                </ol>
                <p class="mt-4 italic">Remember, "Rome wasn't built in a day." Your goal of "${goal}" is achievable with dedication!</p>
            `;
            if (routineResponseDiv) routineResponseDiv.innerHTML = routineResponse;
            if (routineLoadingIndicator) routineLoadingIndicator.classList.add('hidden');
            if (routineResponseContainer) routineResponseContainer.classList.remove('hidden');
        }, 2000);
    });
}

// --- Community Section (Updated for Firestore) ---
const waveTipForm = document.getElementById('wave-tip-form');
const communityTipsDisplay = document.getElementById('community-tips-display');
const noTipsMessage = document.getElementById('no-tips-message');

if (waveTipForm) {
    waveTipForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('community-name').value;
        const content = document.getElementById('wave-content').value;

        if (name && content) {
            try {
                // Add a new document to the "community_tips" collection in Firestore
                await addDoc(collection(db, `artifacts/${appId}/public/data/community_tips`), {
                    name: name,
                    content: content,
                    userId: userId,
                    timestamp: serverTimestamp()
                });
                showToast('Wisdom submitted successfully! 🙏');
            } catch (error) {
                console.error("Error adding document: ", error);
                showToast('Error submitting tip. Please try again.');
            }
        }
        waveTipForm.reset();
    });
}

function displayTips() {
    if (!communityTipsDisplay || !noTipsMessage) return;

    communityTipsDisplay.innerHTML = '';
    if (waveTips.length === 0) {
        noTipsMessage.style.display = 'block';
    } else {
        noTipsMessage.style.display = 'none';
        waveTips.forEach(tip => {
            const tipCard = document.createElement('div');
            tipCard.className = 'card text-left';
            tipCard.innerHTML = `
                <h4 class="text-xl font-bold text-cyan-400 mb-2">${tip.name}</h4>
                <p class="text-gray-300 italic mb-2">shared this wisdom:</p>
                <p class="text-gray-200">${tip.content}</p>
            `;
            communityTipsDisplay.appendChild(tipCard);
        });
    }
}

// --- The Gauntlet Section ---
function showWaverDetails(id) {
    const waver = waverData.find(w => w.id === id);
    if (!waver) return;

    document.getElementById('waverName').textContent = waver.name;
    document.getElementById('waverTeam').textContent = waver.team;
    document.getElementById('waverOrigin').textContent = waver.origin;
    openModal('waverModal');
}

window.openModal = openModal;
window.closeModal = closeModal;
window.showWaverDetails = showWaverDetails;

// --- Product Purchase Section ---
function purchaseBrush(productName) {
    const message = `${productName} added to cart! 🛒`;
    showToast(message);
}

window.purchaseBrush = purchaseBrush;

// --- Natural Recipe Synthesizer ---
const recipeForm = document.getElementById('recipe-form');
const recipeIngredientsInput = document.getElementById('recipe-ingredients');
const recipeResponseContainer = document.getElementById('recipe-response-container');
const recipeResponseDiv = document.getElementById('recipe-response');
const recipeLoadingIndicator = document.getElementById('recipe-loading-indicator');

if (recipeForm) {
    recipeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const ingredients = recipeIngredientsInput.value.trim();
        if (ingredients === '') {
            return;
        }

        if (recipeLoadingIndicator) recipeLoadingIndicator.classList.remove('hidden');
        if (recipeResponseContainer) recipeResponseContainer.classList.add('hidden');
            
        // Use the correct API key and URL from the Ask Guru section
        const apiKey = 'AIzaSyDZVzNeFqZFznLWiSHlplGCrNo8o1cs91I';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        // Construct a detailed prompt for the AI
        const prompt = `Based on the following ingredients, create a detailed recipe for a natural hair pomade or product for deep waves: ${ingredients}. Include steps, measurements, and tips
