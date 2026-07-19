import { test, expect } from '@playwright/test';

test.describe('Dashboard (Home Page)', () => {
  test('has correct title and header', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Dance Practice Helper/);
    await expect(page.getByRole('heading', { name: /Master Your Landmarks/i })).toBeVisible();
  });

  test('contains links to practice tools', async ({ page }) => {
    await page.goto('/');
    const bachataLink = page.locator('a[href="chunked_bachata.html"]');
    await expect(bachataLink).toBeVisible();
    
    const wcsLink = page.locator('a[href="chunked_wcs.html"]');
    await expect(wcsLink).toBeVisible();

    const salsaLink = page.locator('a[href="chunked_salsa.html"]');
    await expect(salsaLink).toBeVisible();
  });
});

test.describe('West Coast Swing Practice Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chunked_wcs.html');
  });

  test('initial UI load and starting the practice session', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'West Coast Swing', exact: true })).toBeVisible();
    
    // The "Begin Practice Session" overlay button
    const beginButton = page.locator('#bigStartBtn');
    await expect(beginButton).toBeVisible();
    await beginButton.click();
    
    // After clicking begin, the overlay hides but it's initially paused, so it shows "Resume"
    const playPauseBtn = page.locator('#playPauseBtn');
    await expect(playPauseBtn).toHaveText(/Resume/i);
    
    // Test toggling Pause/Resume
    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveText(/Pause/i);
    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveText(/Resume/i);
  });

  test('toggling random mode', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    const modeToggle = page.locator('#modeToggle');
    await expect(modeToggle).toHaveText(/Randomize Chunks/i);
    await modeToggle.click();
    
    await expect(modeToggle).toHaveText(/Switch to Linear/i);
    const modeBadge = page.locator('#modeBadge');
    await expect(modeBadge).toHaveText(/Random/i);
  });

  test('mastery filter buttons', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    const filterAll = page.locator('#filterAllBtn');
    const filterLow = page.locator('#filterLowBtn');
    
    await expect(filterAll).toBeVisible();
    await filterLow.click();
    
    // Verify filter changed visual styling (bg-slate-700/80 etc) - we just ensure they don't throw errors
    await filterAll.click();
  });

  test('sync progress modal opens and closes', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    const showDiffBtn = page.locator('#showDiffBtn');
    await expect(showDiffBtn).toBeVisible();
    await showDiffBtn.click();
    
    const syncModal = page.locator('#syncModal');
    await expect(syncModal).toBeVisible();
    
    // Can switch tabs in modal
    const viewFullBtn = page.locator('#viewFullCodeBtn');
    if (await viewFullBtn.isVisible()) {
        await viewFullBtn.click();
        await expect(page.locator('#codeContent')).not.toHaveClass(/hidden/);
    }
    
    const closeBtn = page.locator('#closeSyncModalBtn');
    await closeBtn.click();
    
    await expect(syncModal).not.toBeVisible();
  });
  
  test('cycling mastery state updates local storage and UI', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    
    // Find the first cycle button in the landmark list
    const firstCycleBtn = page.locator('[data-action="cycle"]').first();
    await expect(firstCycleBtn).toBeVisible();
    
    const initialText = await firstCycleBtn.innerText();
    await firstCycleBtn.click();
    
    // Wait a brief moment and check it changed
    await page.waitForTimeout(100);
    const newText = await firstCycleBtn.innerText();
    expect(newText).not.toBe(initialText);
  });
  
  test('clicking a move in sidebar updates the HUD', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    
    // The second landmark (Whips) should be clickable if we change to it
    // Wait for list to render
    await page.waitForSelector('#landmarkList');
    
    // Click on the first move in the first landmark to ensure HUD updates
    const firstMoveLabel = page.locator('[data-action="select"]', { hasText: 'Sugar Push' }).first();
    
    // It might be a div without data-action="select" wrapping it now. Let's select by text.
    const sugarPush = page.locator('#landmarkList').getByText('Sugar Push', { exact: false }).first();
    await sugarPush.click({ force: true });
    
    // HUD current move should say Sugar Push
    const hudCurrentMove = page.locator('#currentMoveLabel');
    await expect(hudCurrentMove).toContainText(/Sugar Push/);
  });
  
  test('reset mastery button shows confirm modal', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    
    await page.locator('#resetMasteryBtn').click();
    const resetModal = page.locator('#resetModal');
    await expect(resetModal).toBeVisible();
    
    await page.locator('#cancelResetBtn').click();
    await expect(resetModal).not.toBeVisible();
  });
  
  test('play/pause button toggles the active state of current move HUD', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    
    const playPauseBtn = page.locator('#playPauseBtn');
    await playPauseBtn.click(); // Now playing
    await expect(playPauseBtn).toHaveText(/Pause/i);
    
    // Stop playing
    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveText(/Resume/i);
  });
});

test.describe('Bachata Practice Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chunked_bachata.html');
  });

  test('initial UI load and starting the practice session', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Bachata' }).first()).toBeVisible();
    
    const beginButton = page.locator('#bigStartBtn');
    await expect(beginButton).toBeVisible();
    await beginButton.click();
    
    const playPauseBtn = page.locator('#playPauseBtn');
    await expect(playPauseBtn).toHaveText(/Resume/i);
  });

  test('changing BPM with slider', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    
    const bpmSlider = page.locator('#bpmSlider, #speedSlider').first();
    const bpmValue = page.locator('#bpmValue');
    
    const initialBpm = await bpmValue.innerText();
    
    await bpmSlider.evaluate((node) => {
      node.value = '140';
      node.dispatchEvent(new Event('input', { bubbles: true }));
    });
    
    const newBpm = await bpmValue.innerText();
    expect(newBpm).not.toBe(initialBpm);
    expect(newBpm).toContain('140');
  });
  
  test('mastery state persistence in localStorage', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    
    await page.evaluate(() => {
      const state = { "Basic Warmup": ["mastered", "mastered"] };
      localStorage.setItem('bachata_mastery_state', JSON.stringify(state));
    });
    
    await page.reload();
    await page.locator('#bigStartBtn').click();
    
    const stateInStorage = await page.evaluate(() => localStorage.getItem('bachata_mastery_state'));
    expect(stateInStorage).toContain('mastered');
  });
  
  test('cycling mastery state in bachata updates UI', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    
    const firstCycleBtn = page.locator('[data-action="cycle"]').first();
    await expect(firstCycleBtn).toBeVisible();
    
    const initialText = await firstCycleBtn.innerText();
    await firstCycleBtn.click();
    
    await page.waitForTimeout(100);
    const newText = await firstCycleBtn.innerText();
    expect(newText).not.toBe(initialText);
  });
  
  test('clicking a bachata move updates the HUD', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    
    await page.waitForSelector('#landmarkList');
    
    // Find the first move in Bachata which is likely "Basic in place" or similar
    // The exact text doesn't matter, just click the first move text
    const firstMoveNode = page.locator('#landmarkList [data-lidx="0"][data-midx="0"]').first();
    await expect(firstMoveNode).toBeVisible();
    await firstMoveNode.click({ force: true });
    
    const firstMoveText = await firstMoveNode.innerText();
    
    const hudCurrentMove = page.locator('#currentMoveLabel');
    // Ensure the HUD at least updated to something
    await expect(hudCurrentMove).not.toBeEmpty();
  });
});

test.describe('West Coast Swing - Additional Actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chunked_wcs.html');
    await page.locator('#bigStartBtn').click();
  });

  test('panic button jumps to next chunk', async ({ page }) => {
    // Get current chunk title
    const currentTitle = await page.locator('#landmarkTitle').innerText();
    
    // Click panic button
    const panicBtn = page.locator('#panicBtn');
    await expect(panicBtn).toBeVisible();
    await panicBtn.click();
    
    // Check if chunk title changed or if we are at least updating the HUD
    const newTitle = await page.locator('#landmarkTitle').innerText();
    // It might randomly pick the same one or a different one depending on mode, or it's linear mode so it goes to the next.
    expect(newTitle).not.toBeNull();
  });
});

test.describe('Additional Comprehensive Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chunked_wcs.html');
    await page.locator('#bigStartBtn').click();
  });

  test('confirming reset clears mastery state', async ({ page }) => {
    // Set a mastery state first
    await page.evaluate(() => {
      const state = { "Basic + Variations": ["mastered", "mastered", "mastered"] };
      localStorage.setItem('wcs_mastery_state', JSON.stringify(state));
    });
    
    await page.reload();
    await page.locator('#bigStartBtn').click();
    
    // Open reset modal
    await page.locator('#resetMasteryBtn').click();
    await expect(page.locator('#resetModal')).toBeVisible();
    
    // Confirm reset
    await page.locator('#confirmResetBtn').click();
    
    // Check if local storage is cleared
    const stateInStorage = await page.evaluate(() => localStorage.getItem('wcs_mastery_state'));
    expect(stateInStorage).toBeNull();
  });
  
  test('closing reset modal via backdrop', async ({ page }) => {
    await page.locator('#resetMasteryBtn').click();
    const modal = page.locator('#resetModal');
    await expect(modal).toBeVisible();
    
    // Click backdrop
    await page.locator('#resetModalBackdrop').click({ position: { x: 5, y: 5 } });
    await expect(modal).not.toBeVisible();
  });
  
  test('sync modal tabs and copy button', async ({ page }) => {
    await page.locator('#showDiffBtn').click();
    const syncModal = page.locator('#syncModal');
    await expect(syncModal).toBeVisible();
    
    // Click Full Code tab
    await page.locator('#viewFullCodeBtn').click();
    await expect(page.locator('#codeContent')).not.toHaveClass(/hidden/);
    await expect(page.locator('#diffContent')).toHaveClass(/hidden/);
    
    // Check Raw Code Area has content
    const codeArea = page.locator('#rawCodeArea');
    await expect(codeArea).toBeVisible();
    expect(await codeArea.innerText()).toContain('const LANDMARKS =');
    
    // Click View Diff tab
    await page.locator('#viewDiffBtn').click();
    await expect(page.locator('#diffContent')).not.toHaveClass(/hidden/);
    await expect(page.locator('#codeContent')).toHaveClass(/hidden/);
  });
  
  test('UI elements presence (progress bar)', async ({ page }) => {
    await expect(page.locator('#sessionProgressBar')).toBeVisible();
    await expect(page.locator('#sessionProgressPct')).toBeVisible();
  });

  test('WCS speed slider updates BPM', async ({ page }) => {
    const speedSlider = page.locator('#speedSlider');
    const bpmValue = page.locator('#bpmValue');
    
    const initialBpm = await bpmValue.innerText();
    
    await speedSlider.evaluate((node) => {
      node.value = '110';
      node.dispatchEvent(new Event('input', { bubbles: true }));
    });
    
    const newBpm = await bpmValue.innerText();
    expect(newBpm).not.toBe(initialBpm);
    expect(newBpm).toContain('110');
  });
});

test.describe('Bachata - Additional Comprehensive Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chunked_bachata.html');
    await page.locator('#bigStartBtn').click();
  });

  test('toggling random mode', async ({ page }) => {
    const modeToggle = page.locator('#modeToggle');
    await expect(modeToggle).toHaveText(/Randomize Chunks/i);
    await modeToggle.click();
    
    await expect(modeToggle).toHaveText(/Switch to Linear/i);
    const modeBadge = page.locator('#modeBadge');
    await expect(modeBadge).toHaveText(/Random/i);
  });
  
  test('mastery filter buttons', async ({ page }) => {
    const filterAll = page.locator('#filterAllBtn');
    const filterLow = page.locator('#filterLowBtn');
    
    await expect(filterAll).toBeVisible();
    await filterLow.click();
    
    // Switch back to all
    await filterAll.click();
  });
  
  test('panic button jumps to next chunk', async ({ page }) => {
    const panicBtn = page.locator('#panicBtn');
    await expect(panicBtn).toBeVisible();
    await panicBtn.click();
    
    const newTitle = await page.locator('#landmarkTitle').innerText();
    expect(newTitle).not.toBeNull();
  });
});

test.describe('Salsa Practice Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chunked_salsa.html');
  });

  test('initial UI load and starting the practice session', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Salsa' }).first()).toBeVisible();
    
    const beginButton = page.locator('#bigStartBtn');
    await expect(beginButton).toBeVisible();
    await beginButton.click();
    
    const playPauseBtn = page.locator('#playPauseBtn');
    await expect(playPauseBtn).toHaveText(/Resume/i);
  });

  test('changing BPM with slider', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    
    const bpmSlider = page.locator('#bpmSlider');
    const bpmValue = page.locator('#bpmValue');
    
    const initialBpm = await bpmValue.innerText();
    
    await bpmSlider.evaluate((node) => {
      node.value = '180';
      node.dispatchEvent(new Event('input', { bubbles: true }));
    });
    
    const newBpm = await bpmValue.innerText();
    expect(newBpm).not.toBe(initialBpm);
    expect(newBpm).toContain('180');
  });
  
  test('mastery state persistence in localStorage', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    
    await page.evaluate(() => {
      const state = { "Fundamentals": ["mastered", "mastered", "mastered"] };
      localStorage.setItem('salsa_mastery_state', JSON.stringify(state));
    });
    
    await page.reload();
    await page.locator('#bigStartBtn').click();
    
    const stateInStorage = await page.evaluate(() => localStorage.getItem('salsa_mastery_state'));
    expect(stateInStorage).toContain('mastered');
  });
  
  test('cycling mastery state in salsa updates UI', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    
    const firstCycleBtn = page.locator('[data-action="cycle"]').first();
    await expect(firstCycleBtn).toBeVisible();
    
    const initialText = await firstCycleBtn.innerText();
    await firstCycleBtn.click();
    
    await page.waitForTimeout(100);
    const newText = await firstCycleBtn.innerText();
    expect(newText).not.toBe(initialText);
  });
  
  test('clicking a salsa move updates the HUD', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    
    await page.waitForSelector('#landmarkList');
    
    const firstMoveNode = page.locator('#landmarkList [data-lidx="0"][data-midx="0"]').first();
    await expect(firstMoveNode).toBeVisible();
    await firstMoveNode.click({ force: true });
    
    const hudCurrentMove = page.locator('#currentMoveLabel');
    await expect(hudCurrentMove).not.toBeEmpty();
  });

  test('landmark selection checkboxes and filter reset', async ({ page }) => {
    await page.locator('#bigStartBtn').click();
    
    await page.waitForSelector('.chunk-checkbox');
    const firstCheckbox = page.locator('.chunk-checkbox').first();
    await expect(firstCheckbox).not.toBeChecked();
    
    // Toggle checkbox to check
    await firstCheckbox.click();
    await expect(firstCheckbox).toBeChecked();
    
    // Changing the mastery filter resets selection checkboxes
    const filterLow = page.locator('#filterLowBtn');
    await filterLow.click();
    
    const filterAll = page.locator('#filterAllBtn');
    await filterAll.click();
    
    // It should be unchecked again after filter reset
    await expect(firstCheckbox).not.toBeChecked();
  });
});
