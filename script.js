// --- Global State and Utility Functions ---
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
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- Mobile Menu ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// --- Ask Guru AI (Main Section) ---
const mainAskGuruForm = document.getElementById('main-ask-guru-form');
const mainAiQuestionInput = document.getElementById('main-ai-question');
const mainAiResponseContainer = document.getElementById('main-ai-response-container');
const mainAiResponseDiv = document.getElementById('main-ai-response');
const mainAiLoadingIndicator = document.getElementById('main-ai-loading-indicator');

mainAskGuruForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const question = mainAiQuestionInput.value.trim();
    if (question === '') {
        return;
    }

    mainAiLoadingIndicator.classList.remove('hidden');
    mainAiResponseContainer.classList.add('hidden');

    const apiKey = 'AIzaSyDZVzNeFqZFznLWiSHlplGCrNo8o1cs91I'; 
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': apiKey
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

        mainAiResponseDiv.textContent = aiResponse;

    } catch (error) {
        mainAiResponseDiv.textContent = `Sorry, an error occurred: ${error.message}. Please check the console for details.`;
        console.error('Error fetching data from API:', error);

    } finally {
        mainAiLoadingIndicator.classList.add('hidden');
        mainAiResponseContainer.classList.remove('hidden');
    }
});

// --- Wave Journey Planner ---
const journeyForm = document.getElementById('wave-routine-form');
const routineLoadingIndicator = document.getElementById('routine-loading-indicator');
const routineResponseContainer = document.getElementById('routine-response-container');
const routineResponseDiv = document.getElementById('routine-response');

journeyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    routineLoadingIndicator.classList.remove('hidden');
    routineResponseContainer.classList.add('hidden');

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
        routineResponseDiv.innerHTML = routineResponse;
        routineLoadingIndicator.classList.add('hidden');
        routineResponseContainer.classList.remove('hidden');
    }, 2000);
});

// --- Community Section ---
const waveTipForm = document.getElementById('wave-tip-form');
const communityTipsDisplay = document.getElementById('community-tips-display');
const noTipsMessage = document.getElementById('no-tips-message');

waveTipForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('community-name').value;
    const content = document.getElementById('wave-content').value;

    const newTip = { name, content };
    waveTips.push(newTip);
    localStorage.setItem('waveTips', JSON.stringify(waveTips));

    displayTips();
    waveTipForm.reset();
    showToast('Wisdom submitted successfully! 🙏');
});

function displayTips() {
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

document.addEventListener('DOMContentLoaded', () => {
    const storedTips = localStorage.getItem('waveTips');
    if (storedTips) {
        waveTips = JSON.parse(storedTips);
    }
    displayTips();
    // Also display wavers on page load
    displayWavers();
});

// --- Guru AI Top Tier Wavers Section ---
const waversGrid = document.getElementById('wavers-grid');

function displayWavers() {
    waversGrid.innerHTML = '';
    waverData.forEach(waver => {
        const waverCard = document.createElement('div');
        waverCard.className = 'card waver-card text-center cursor-pointer';
        waverCard.setAttribute('onclick', `showWaverDetails(${waver.id})`);
