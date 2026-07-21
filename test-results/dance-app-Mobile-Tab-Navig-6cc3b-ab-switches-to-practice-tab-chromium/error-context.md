# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dance-app.spec.js >> Mobile Tab Navigation >> clicking a move in mobile moves tab switches to practice tab
- Location: tests/dance-app.spec.js:462:3

# Error details

```
Error: expect(locator).not.toHaveClass(expected) failed

Locator: locator('#movesTabPanel')
Expected pattern: not /hidden/
Received string: "w-full md:flex-1 md:flex flex-col h-[calc(100vh-140px)] md:h-[82vh] bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-850 overflow-hidden shadow-2xl flex"
Timeout: 5000ms

Call log:
  - Expect "not toHaveClass" with timeout 5000ms
  - waiting for locator('#movesTabPanel')
    12 × locator resolved to <section id="movesTabPanel" class="w-full md:flex-1 md:flex flex-col h-[calc(100vh-140px)] md:h-[82vh] bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-850 overflow-hidden shadow-2xl flex">…</section>
       - unexpected value "w-full md:flex-1 md:flex flex-col h-[calc(100vh-140px)] md:h-[82vh] bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-850 overflow-hidden shadow-2xl flex"

```

```yaml
- heading "Move Groups" [level=3]
- button "Sequential"
- text: "Mastered: 5/47 (11%)"
- button "Sync Code"
- button "Reset"
- text: Practice Filter
- button "All"
- button "Low"
- button "Med"
- button "High"
- checkbox
- img
- text: Sugar Tucks and Pushes 31% Mastery
- button:
  - img
- button:
  - img
- text: Sugar Push (6🥁)
- link "🎬":
  - /url: https://youtu.be/vx1wmjgR124
- button "Mastered"
- text: Sugar Tuck (6🥁)
- button "Familiar"
- text: "?Sugar Tuck Elbow Catch and Double Spin (6🥁)"
- link "🎬":
  - /url: https://youtu.be/EvvVBMtRnLY?si=_Rj4e-RG_5INEWQz&t=167
- button "Learning"
- text: Sugar Tuck with Both Hands (6🥁)
- link "🎬":
  - /url: https://youtu.be/EvvVBMtRnLY?si=F08TOCBJR_J8xtTD&t=84
- button "Learning"
- text: Left Side Turning Pass Both Hands Led by Leader Left Hand (6🥁)
- button "Learning"
- text: Right Side Pass Popout (6🥁)
- link "🎬":
  - /url: https://youtu.be/EvvVBMtRnLY?si=F08TOCBJR_J8xtTD&t=84
- button "Familiar"
- text: Sugar Tuck Shoulder Catch and Guide Back (6🥁)
- link "🎬":
  - /url: https://youtu.be/8b-S82Eio-4
- button "Familiar"
- text: Sugar Tuck Waist Catch and Arm Free Spin Back (6🥁)
- link "🎬":
  - /url: https://youtu.be/8b-S82Eio-4
- button "Familiar"
- text: Drama Sugar Push (6🥁)
- link "🎬":
  - /url: https://youtu.be/8b-S82Eio-4
- button "Familiar"
- text: Sugar Tuck Ring Around The Rosie (6🥁)
- link "🎬":
  - /url: https://youtu.be/_maSWuiWhcE
- button "Familiar"
- text: Sugar Tuck Catch & Reverse Spin (6🥁)
- link "🎬":
  - /url: https://youtu.be/_maSWuiWhcE
- button "Familiar"
- text: Sugar Tuck Arm Rock Play (6🥁)
- link "🎬":
  - /url: https://youtu.be/x61CN8EPdcY
- button "Familiar"
- text: Sling Shot x 2 with Sugar Tuck Exit (10🥁)
- link "🎬":
  - /url: https://youtu.be/wuyuGL2iE4U
- button "Learning"
- text: Sugar Tuck Slow Side + Leader Turn + Left Side Free Spin (8🥁)
- link "🎬":
  - /url: https://youtu.be/FdUcgrjn6Rs
- button "Learning"
- text: Sugar Tuck With Follow Turn to Leader Right Side Var 1 (8🥁)
- link "🎬":
  - /url: https://youtu.be/SxfmpYhmL6o?t=20s
- button "Learning"
- text: Sugar Tuck With Follow Turn to Leader Right Side Var 2 (8🥁)
- link "🎬":
  - /url: https://youtu.be/SxfmpYhmL6o?t=20s
- button "Learning"
- checkbox
- img
- text: Left Side Passes 11% Mastery
- button:
  - img
- button:
  - img
- text: LSP (6🥁)
- button "Mastered"
- text: LSP with Free Spin (6🥁)
- link "🎬":
  - /url: https://youtu.be/HYaWbVi3xWk
- button "Learning"
- text: Left Side Telemark with Inside Turns (6🥁)
- link "🎬":
  - /url: https://www.youtube.com/watch?v=Ae9OTEZ60yY
- button "Learning"
- text: Sugar Push into Closed with Left Side Tap (6🥁)
- link "🎬":
  - /url: https://youtu.be/HYaWbVi3xWk
- button "Learning"
- text: LSP Under Arm Send Out (6🥁)
- link "🎬":
  - /url: https://youtu.be/vx1wmjgR124
- button "Learning"
- text: LSP Hammer Roll-In / Out (6🥁)
- link "🎬":
  - /url: https://www.youtube.com/watch?v=YuIWjdriiq4&t=90s
- button "Learning"
- text: LSP Double Hand Hammer Roll-In / Out (6🥁)
- link "🎬":
  - /url: https://youtu.be/8A1IRTHhADo?t=50s
- button "Learning"
- text: LSP Right Hand Led Roll-In/Out (6🥁)
- link "🎬":
  - /url: https://youtu.be/0RpK_Cm1sNk
- button "Learning"
- text: LSP Right Hand Led Roll-In/Out with Catch and Follow Turn (6🥁)
- link "🎬":
  - /url: https://youtu.be/0RpK_Cm1sNk?t=36s
- button "Learning"
- checkbox
- img
- text: Right Side Passes 33% Mastery
- button:
  - img
- button:
  - img
- text: Right Side Pass with Turn (6🥁)
- button "Familiar"
- text: Right Side Pass with Outside Turn (6🥁)
- button "Learning"
- text: Right Side Pass with Follow Hand on Leader Left Shoulder Turn 5&6 (6🥁)
- button "Learning"
- text: Right turn catch and spin follow left arm (6🥁)
- button "Learning"
- text: Right Side Pass into Closed (6🥁)
- button "Mastered"
- text: Reverse Whip / Double Spin (8🥁)
- button "Familiar"
- checkbox
- img
- text: Basic Whips 40% Mastery
- button:
  - img
- button:
  - img
- text: Basic Whip (8🥁)
- button "Mastered"
- text: RSP Into Closed Whip with Lead Turn (8🥁)
- button "Learning"
- text: LSP Roll into Sweetheart With Reverse Whip Exit (8🥁)
- button "Learning"
- text: Basket Whip (8🥁)
- button "Familiar"
- text: Basket Whip with Outside Turn (8🥁)
- button "Familiar"
- checkbox
- img
- text: Open Whips 20% Mastery
- button:
  - img
- button:
  - img
- text: Base Open Whip (8🥁)
- button "Familiar"
- text: Open Whip with Inside Turn (8🥁)
- button "Familiar"
- text: Open Whip with Back to Back Turn (8🥁)
- button "Learning"
- text: Open Whip Follow Left Arm 1 (8🥁)
- button "Learning"
- text: Open Whip Follow Left Arm 2 (8🥁)
- button "Learning"
- checkbox
- img
- text: Reverse Whips 0% Mastery
- button:
  - img
- button:
  - img
- text: Reverse Whip (8🥁)
- button "Learning"
- text: Wren Reverse Whip with Lead Cross the Slot (8🥁)
- button "Learning"
- text: Mike Reverse Whip with Lead Cross the Slot (8🥁)
- button "Learning"
- text: Reverse Whip (8🥁)
- button "Learning"
- checkbox
- img
- text: Other Moves 50% Mastery
- button:
  - img
- button:
  - img
- text: Cha Cha (6🥁)
- button "Mastered"
- text: Cha with Spin Exit (8🥁)
- button "Learning"
```

# Test source

```ts
  370 |   });
  371 |   
  372 |   test('mastery state persistence in localStorage', async ({ page }) => {
  373 |     
  374 |     await page.evaluate(() => {
  375 |       const state = { "Fundamentals": ["mastered", "mastered", "mastered"] };
  376 |       localStorage.setItem('salsa_mastery_state', JSON.stringify(state));
  377 |     });
  378 |     
  379 |     await page.reload();
  380 |     
  381 |     const stateInStorage = await page.evaluate(() => localStorage.getItem('salsa_mastery_state'));
  382 |     expect(stateInStorage).toContain('mastered');
  383 |   });
  384 |   
  385 |   test('cycling mastery state in salsa updates UI', async ({ page }) => {
  386 |     
  387 |     const firstCycleBtn = page.locator('[data-action="cycle"]').first();
  388 |     await expect(firstCycleBtn).toBeVisible();
  389 |     
  390 |     const initialText = await firstCycleBtn.innerText();
  391 |     await firstCycleBtn.click();
  392 |     
  393 |     await page.waitForTimeout(100);
  394 |     const newText = await firstCycleBtn.innerText();
  395 |     expect(newText).not.toBe(initialText);
  396 |   });
  397 |   
  398 |   test('clicking a salsa move updates the HUD', async ({ page }) => {
  399 |     
  400 |     await page.waitForSelector('#landmarkList');
  401 |     
  402 |     const firstMoveNode = page.locator('#landmarkList [data-lidx="0"][data-midx="0"]').first();
  403 |     await expect(firstMoveNode).toBeVisible();
  404 |     await firstMoveNode.click({ force: true });
  405 |     
  406 |     const hudCurrentMove = page.locator('#currentMoveLabel');
  407 |     await expect(hudCurrentMove).not.toBeEmpty();
  408 |   });
  409 | 
  410 |   test('landmark selection checkboxes and filter reset', async ({ page }) => {
  411 |     
  412 |     await page.waitForSelector('.chunk-checkbox');
  413 |     const firstCheckbox = page.locator('.chunk-checkbox').first();
  414 |     await expect(firstCheckbox).not.toBeChecked();
  415 |     
  416 |     // Toggle checkbox to check
  417 |     await firstCheckbox.click();
  418 |     await expect(firstCheckbox).toBeChecked();
  419 |     
  420 |     // Changing the mastery filter resets selection checkboxes
  421 |     const filterLow = page.locator('#filterLowBtn');
  422 |     await filterLow.click();
  423 |     
  424 |     const filterAll = page.locator('#filterAllBtn');
  425 |     await filterAll.click();
  426 |     
  427 |     // It should be unchecked again after filter reset
  428 |     await expect(firstCheckbox).not.toBeChecked();
  429 |   });
  430 | });
  431 | 
  432 | test.describe('Mobile Tab Navigation', () => {
  433 |   test.use({ viewport: { width: 375, height: 812 } });
  434 | 
  435 |   test('switches between Practice and Moves tabs on mobile', async ({ page }) => {
  436 |     await page.goto('/chunked_wcs.html');
  437 |     
  438 |     // Check initial state (Practice tab is active by default)
  439 |     const practiceTabPanel = page.locator('#practiceTabPanel');
  440 |     const movesTabPanel = page.locator('#movesTabPanel');
  441 |     
  442 |     await expect(practiceTabPanel).not.toHaveClass(/hidden/);
  443 |     await expect(movesTabPanel).toHaveClass(/hidden/);
  444 |     
  445 |     // Click Moves tab
  446 |     const movesTabBtn = page.locator('#mobileTabMovesBtn');
  447 |     await movesTabBtn.click();
  448 |     
  449 |     // Check if Moves panel is now visible
  450 |     await expect(movesTabPanel).not.toHaveClass(/hidden/);
  451 |     await expect(practiceTabPanel).toHaveClass(/hidden/);
  452 |     
  453 |     // Click Practice tab
  454 |     const practiceTabBtn = page.locator('#mobileTabPracticeBtn');
  455 |     await practiceTabBtn.click();
  456 |     
  457 |     // Check if Practice panel is now visible
  458 |     await expect(practiceTabPanel).not.toHaveClass(/hidden/);
  459 |     await expect(movesTabPanel).toHaveClass(/hidden/);
  460 |   });
  461 |   
  462 |   test('clicking a move in mobile moves tab switches to practice tab', async ({ page }) => {
  463 |     await page.goto('/chunked_wcs.html');
  464 |     
  465 |     // Go to moves tab
  466 |     const movesTabBtn = page.locator('#mobileTabMovesBtn');
  467 |     await movesTabBtn.click();
  468 |     
  469 |     const movesTabPanel = page.locator('#movesTabPanel');
> 470 |     await expect(movesTabPanel).not.toHaveClass(/hidden/);
      |                                     ^ Error: expect(locator).not.toHaveClass(expected) failed
  471 |     
  472 |     // Click a move in the list
  473 |     await page.waitForSelector('#landmarkList');
  474 |     const firstMoveNode = page.locator('#landmarkList [data-lidx="0"][data-midx="0"]').first();
  475 |     await expect(firstMoveNode).toBeVisible();
  476 |     await firstMoveNode.click({ force: true });
  477 |     
  478 |     // Should automatically switch to Practice tab
  479 |     const practiceTabPanel = page.locator('#practiceTabPanel');
  480 |     await expect(practiceTabPanel).not.toHaveClass(/hidden/);
  481 |     await expect(movesTabPanel).toHaveClass(/hidden/);
  482 |   });
  483 | });
  484 | 
  485 | test.describe('Loop/Repeat Feature', () => {
  486 |   test('loop toggle updates state correctly', async ({ page }) => {
  487 |     await page.goto('/chunked_wcs.html');
  488 |     
  489 |     const loopToggle = page.locator('#loopToggle');
  490 |     await expect(loopToggle).not.toBeChecked();
  491 |     
  492 |     await loopToggle.check();
  493 |     await expect(loopToggle).toBeChecked();
  494 |     
  495 |     await loopToggle.uncheck();
  496 |     await expect(loopToggle).not.toBeChecked();
  497 |   });
  498 | });
  499 | 
```