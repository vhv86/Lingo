// Create a tooltip element for showing phonetics
const tooltip = document.createElement('div');
tooltip.id = 'phonetics-tooltip';
tooltip.style.position = 'absolute';
tooltip.style.background = '#f9f9f9';
tooltip.style.border = '1px solid #ccc';
tooltip.style.borderRadius = '5px';
tooltip.style.padding = '8px';
tooltip.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
tooltip.style.display = 'none';
tooltip.style.zIndex = '10000';
tooltip.style.fontSize = '14px';
tooltip.style.color = '#333';
document.body.appendChild(tooltip);

// Fetch phonetics from the API
async function fetchPhonetics(word) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('No phonetics found');
        const data = await response.json();
        const phonetics = data[0]?.phonetics?.map(p => p.text).filter(Boolean);
        return phonetics?.length ? phonetics[0] : '/NA/';
    } catch {
        return '/NF/';
    }
}

// Fetch translation from Google Translate API
async function fetchTranslation(word) {
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(word)}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Translation failed');
        const data = await response.json();
        return data[0]?.[0]?.[0] || 'Translation not available';
    } catch {
        return 'Translation failed';
    }
}

// Function to handle text selection
async function handleTextSelection() {
    const selection = window.getSelection();
    const word = selection.toString().trim();

    if (!word) {
        tooltip.style.display = 'none';
        return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    tooltip.style.left = `${rect.left + window.scrollX + 10}px`;
    tooltip.style.top = `${rect.top + window.scrollY - 30}px`;

    // Fetch data from APIs
    const [phonetics, translation] = await Promise.all([
        fetchPhonetics(word),
        fetchTranslation(word)
    ]);

    tooltip.textContent = `${word}: ${phonetics} ${translation}`;
    tooltip.style.display = 'block';
}

// Listen for text selection changes
document.addEventListener('selectionchange', handleTextSelection);

// Hide tooltip when clicking elsewhere
document.addEventListener('click', (event) => {
    if (!window.getSelection().toString().trim()) {
        tooltip.style.display = 'none';
    }
});