 

document.getElementById('hamburger').addEventListener('click', function () {
    var menu = document.getElementById('mobile-menu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
    } else {
        menu.classList.add('hidden');
    }
});


function modalOpen(modalId) {
    document.querySelector(modalId).classList.remove('hidden');
}

function modalClose(modalId) {
    document.querySelector(modalId).classList.add('hidden');
}

let wave = new CircularAudioWave(document.getElementById('chart-container'), {
    onEnd: () => {
        console.log("Audio has ended");
        const button = document.querySelector('.button');
        const image = document.querySelector('.image-opacity');
        const chart = document.querySelector('#chart-container');

        // Reset UI states
        button.classList.remove('rotate-3d-active');
        image.classList.remove('image-opacity-hidden');
        chart.classList.add('image-opacity-hidden');

        isPlaying = false;
    }
});

let isPlaying = false;

wave.loadAudio('./images/demo.mp3').then(() => {
    console.log("Audio loaded successfully");
    document.querySelector('.button .flip-card').classList.add('visible');
}).catch((error) => {
    console.error("Error loading audio:", error);
});

function toggleState() {
    const button = document.querySelector('.button');
    const image = document.querySelector('.image-opacity');
    const chart = document.querySelector('#chart-container');

    button.classList.toggle('rotate-3d-active');
    image.classList.toggle('image-opacity-hidden');
    chart.classList.toggle('image-opacity-hidden');

    if (isPlaying) {
        wave.stop(); // Stop the audio
        isPlaying = false;
    } else {
        wave.play(); // Start the audio
        isPlaying = true;
    }
}

// Add resize event listener to handle chart resizing
window.addEventListener('resize', () => {
    wave.chart.resize();
}); 


 
function toggleFAQs() {
    const faqSection = document.getElementById('faqSection');
    faqSection.classList.toggle('hidden');

    if (!faqSection.classList.contains('hidden')) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
    }
} 


function toggleAudio() {
    const audio = document.getElementById('audio');
    const playButton = document.getElementById('play-button');

    if (audio.paused) {
        audio.play(); // Play the audio
        // Change button to indicate stop
        playButton.innerHTML = `
            <div class="flip-card visible">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <svg class="text-gray-800 h-24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path fill="black" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            <path fill="white" d="M10 8h1v8h-1zM13 8h1v8h-1z"></path>
                        </svg>
                    </div>
                    <div class="flip-card-back">
                        <svg class="text-gray-800 h-24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path fill="black" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            <path fill="white" d="M10 8h1v8h-1zM13 8h1v8h-1z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        `;
    } else {
        audio.pause(); // Pause the audio
        // Change button back to indicate play
        playButton.innerHTML = `
            <div class="flip-card visible">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <svg class="text-gray-800 h-24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path fill="black" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            <path fill="white" d="M9 8l7 4-7 4V8z"></path>
                        </svg>
                    </div>
                    <div class="flip-card-back">
                        <svg class="text-gray-800 h-24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path fill="black" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            <path fill="white" d="M10 8h1v8h-1zM13 8h1v8h-1z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        `;
    }
}
