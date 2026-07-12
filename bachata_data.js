const BACHATA_LANDMARKS = [
    {
        title: "Warm-Up Loop",
        anchor: "Double basic → inside (repeat) → catch and reverse",
        color: "#10b981",
        moves: [
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Inside Turn", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Inside Turn", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Inside Turn Catch & Reverse", beats: 4, mastery: "mastered" },
            { name: "Inside Turn", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Star hands", beats: 4, mastery: "mastered" },
            { name: "Hip lead inside turn", beats: 4, mastery: "mastered" }
        ],
        links: []
    },
    {
        title: "Hammerlocks",
        anchor: "Hammerlock → handsweep into hammerlock",
        color: "#3b82f6",
        moves: [
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Enter hammerlock", beats: 4, mastery: "mastered" },
            { name: "Exit hammerlock", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "My Inside Turn → Closed Position", beats: 4, mastery: "mastered", hint: "Drop HER RIGHT, Put HER LEFT hand on YOUR RIGHT shoulder and let it slide across your neck" },
            { name: "Closed basic", beats: 4, mastery: "mastered" },
            { name: "Closed basic", beats: 4, mastery: "mastered" },
            { name: "Closed basic with hand sweep", beats: 4, mastery: "learning" },
            { name: "Closed her right arm flip back → hammerlock", beats: 4, mastery: "learning", hint: "Catch her flipped right arm behind her back with my right" },
            { name: "Unwind hammerlock (R hand)", beats: 4, mastery: "learning" },
            { name: "Hairbrush using my right hand to closed", beats: 4, mastery: "learning", hint: "Hair brush her right hand by moving my right by her left ear" },
            { name: "Open basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Inside turn both hands connected", beats: 4, mastery: "learning", hint: "Move top of my RIGHT fingers to bottom of her RIGHT elbow" },
            { name: "Flip her left hand, catch and send back → hammerlock", beats: 4, mastery: "learning", hint: "2 arm moves here: let go of my RIGHT arm to big sweep her straight RIGHT arm out then flip it back to catch with your left" },
            { name: "Unwind hammer lock", beats: 4, mastery: "learning" }
        ],
        links: [
            ["https://www.instagram.com/reel/DUvvacfjvh-/", "Hair Brush + Hammerlocks"],
            ["https://youtu.be/XfWSKuzRVCM?t=285", "Arm Flip Hammerlock"]
        ]
    },
    {
        title: "Pretzels",
        anchor: "Pretzel 1 → pretzel 2",
        color: "#8b5cf6",
        moves: [
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Enter pretzel (Var 1)", beats: 4, mastery: "learning", hint: "She faces 12 o'clock, I face 3 o'clock" },
            { name: "Pretzel Var 1 exit", beats: 4, mastery: "learning", hint: "Lower MY LEFT, unwind her using MY RIGHT / (I face 12 o'clock / she faces 6 o'clock - both go towards 3 o'clock)"},
            { name: "Inside turn (L lead on R shoulder)", beats: 4, mastery: "learning" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Enter pretzel (Var 2)", beats: 4, mastery: "mastered" },
            { name: "Switch follower R → L", beats: 4, mastery: "mastered" },
            { name: "Awkward hand hold", beats: 4, mastery: "mastered" },
            { name: "Basic (awkward hold)", beats: 4, mastery: "mastered" },
            { name: "Leader inside turn → exit awkward", beats: 4, mastery: "mastered" }
        ],
        links: [
            ["https://youtu.be/1VzipnwNFXo?si=zLRSU7oRBSfUs_6m", "DA Pretzel Variations"],
            ["https://youtu.be/XfWSKuzRVCM?si=0VlJ7Ud8A97QDELU&t=23", "Pretzel Variation 2"]
        ]
    },
    {
        title: "Closed Slow Control",
        anchor: "Closed → slow → 360 → out",
        color: "#f59e0b",
        moves: [
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "My Inside Turn → Closed Position", beats: 4, mastery: "mastered" },
            { name: "Closed basic", beats: 4, mastery: "mastered" },
            { name: "Closed basic", beats: 4, mastery: "mastered" },
            { name: "Closed 360", beats: 4, mastery: "mastered" },
            { name: "Closed basic", beats: 4, mastery: "mastered" },
            { name: "Hesitation slide", beats: 4, mastery: "mastered" },
            { name: "Hesitation slide", beats: 4, mastery: "mastered" },
            { name: "Hesitation slide", beats: 4, mastery: "mastered" },
            { name: "Hesitation slide", beats: 4, mastery: "mastered" },
            { name: "Exit closed → basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" }
        ],
        links: []
    },
    {
        title: "Madrid Maze",
        anchor: "Madrids",
        color: "#f97316",
        moves: [
            { name: "Basic (Open Hold)", beats: 4, mastery: "learning" },
            { name: "Basic (Open Hold)", beats: 4, mastery: "learning" },
            { name: "Madrid Step Forward", beats: 4, mastery: "learning" },
            { name: "Madrid Step Back", beats: 4, mastery: "learning" }
        ],
        links: [
            ["https://www.youtube.com/watch?v=Ti4qjrRqyAo", "Madrid 1"],
            ["https://youtu.be/7Mu6fuGWqcw?si=9xs_bvgYrjD7GRGY&t=167", "Madrid 2"]
        ]
    },
    {
        title: "Frontal and Shadow Waves",
        anchor: "Vertical S-Wave → Lateral → Shadow Roll",
        color: "#ef4444",
        moves: [
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "The 'S' Wave (Vertical)", beats: 4, mastery: "learning" },
            { name: "Lateral Wave (Side-to-Side)", beats: 4, mastery: "learning" },
            { name: "Inside Turn to Closed Position", beats: 4, mastery: "learning" },
            { name: "Frontal Body Roll (Closed)", beats: 4, mastery: "learning" },
            { name: "Lead into shadow position", beats: 4, mastery: "learning" },
            { name: "Shadow Body Roll", beats: 4, mastery: "learning" },
            { name: "Exit Shadow → Inside turn", beats: 4, mastery: "learning" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" }
        ],
        links: []
    },
    {
        title: "Shoulder Blade Finale",
        anchor: "Hammerlock → Switch → Shoulder blades → overhead → turn",
        color: "#1e293b",
        moves: [
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Basic", beats: 4, mastery: "mastered" },
            { name: "Inside turn → hammerlock", beats: 4, mastery: "learning" },
            { name: "Switch places", beats: 4, mastery: "learning" },
            { name: "Hands to shoulder blades", beats: 4, mastery: "learning" },
            { name: "Raise hands overhead", beats: 4, mastery: "learning" },
            { name: "Inside turn led from hip", beats: 4, mastery: "learning" },
            { name: "Basic handhold back", beats: 4, mastery: "mastered" }
        ],
        links: [["https://youtu.be/Vx3AWpgnoVQ?si=pZlZTw1V6d322ON-&t=221", "Finale Video"]]
    }
];

