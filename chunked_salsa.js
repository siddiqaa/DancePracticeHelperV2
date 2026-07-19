const ORIGINAL_SALSA_LANDMARKS = JSON.parse(JSON.stringify(SALSA_LANDMARKS));

window.onload = () => {
    const salsaTool = new DancePracticeTool({
        landmarks: SALSA_LANDMARKS,
        originalLandmarks: ORIGINAL_SALSA_LANDMARKS,
        storageKey: 'salsa_mastery_state',
        danceType: 'salsa',
        accentColor: 'red',
        bpmSliderId: 'bpmSlider',
        onPlayBeat: (time, beatIdx, phraseIdx, move) => {
            DanceAudio.playSalsaBeat(time, phraseIdx, true);
        }
    });

    salsaTool.init();
};
