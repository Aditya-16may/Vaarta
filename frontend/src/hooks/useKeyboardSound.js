
const keyStrokeSounds = [
    new Audio('/sounds/keystroke1.mp3'),
    new Audio('/sounds/keystroke2.mp3'),
    new Audio('/sounds/keystroke3.mp3'),
    new Audio('/sounds/keystroke4.mp3'),
];

keyStrokeSounds.forEach(sound => {
    sound.preload = "auto";
    sound.load();
});

function useKeyboardSound() {
    const playRandomKeyStrokeSound = () => {
        const baseSound =
            keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];

        const sound = baseSound.cloneNode();

        sound.volume = 1;

        sound.play().catch(console.error);
    };

    return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;