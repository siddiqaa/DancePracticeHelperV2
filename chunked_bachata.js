const ORIGINAL_BACHATA_LANDMARKS = JSON.parse(JSON.stringify(BACHATA_LANDMARKS));

window.onload = () => {
    const bachataTool = new DancePracticeTool({
        landmarks: BACHATA_LANDMARKS,
        originalLandmarks: ORIGINAL_BACHATA_LANDMARKS,
        storageKey: 'bachata_mastery_state',
        danceType: 'bachata',
        accentColor: 'indigo',
        bpmSliderId: 'bpmSlider',
        onPlayBeat: (time, beatIdx, phraseIdx, move) => {
            DanceAudio.playBachataBeat(time, beatIdx, true);
        }
    });

    bachataTool.init();
};
