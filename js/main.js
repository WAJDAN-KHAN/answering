 
 
 

 
function toggleFAQs() {
    const faqSection = document.getElementById('faqSection');
    faqSection.classList.toggle('hidden');

    if (!faqSection.classList.contains('hidden')) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
    }
} 




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
