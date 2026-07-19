const ORIGINAL_WCS_LANDMARKS = JSON.parse(JSON.stringify(WCS_LANDMARKS));

window.onload = () => {
    const wcsTool = new DancePracticeTool({
        landmarks: WCS_LANDMARKS,
        originalLandmarks: ORIGINAL_WCS_LANDMARKS,
        storageKey: 'wcs_mastery_state',
        danceType: 'wcs',
        accentColor: 'indigo',
        bpmSliderId: 'speedSlider',
        onPlayBeat: (time, beatIdx, phraseIdx, move) => {
            DanceAudio.playWCSBeat(time, beatIdx, move.beats, true);
        }
    });

    wcsTool.init();
};
