
const keyStrokeSounds = [
    new Audio('/sounds/keystroke1.mp3'),
    new Audio('/sounds/keystroke2.mp3'),
    new Audio('/sounds/keystroke3.mp3'),
    new Audio('/sounds/keystroke4.mp3'),
];

function useKeyboardSound() {
    const playRandomKeyStrokeSound = () => {
        const sound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];
        sound.currentTime = 0;
        sound.play();
    }
    return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;