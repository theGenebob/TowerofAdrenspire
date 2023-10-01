let lastTokenPosition = {}; // Store the token's last position
let tokenInRange = {}; // Store whether the token is in range
let chosenOne = null; // Variable to store the chosen actor
let isCharacterSelectionScene = false; // Flag to track if it's the character selection scene

Hooks.on("updateToken", (scene, tokenData, updateData, options, userId) => {
  // Check if we are on the "Character Selection Screen" scene
  if (isCharacterSelectionScene) {
    // Store the token's new position
    lastTokenPosition[tokenData._id] = { x: updateData.x, y: updateData.y };
  }
});

Hooks.on("canvasReady", () => {
  // Initialize scene state
  const activeScene = game.scenes.active;
  isCharacterSelectionScene = activeScene && activeScene.name === "Character Selection Screen";

  // Listen for scene changes
  Hooks.on("canvasSceneChange", (scene, options, userId) => {
    isCharacterSelectionScene = scene.name === "Character Selection Screen";
  });

  // Periodically check token positions
  setInterval(() => {
    // Check if we are on the "Character Selection Screen" scene
    if (isCharacterSelectionScene) {
      const tokens = canvas.tokens.placeables;
      tokens.forEach((token) => {
        const lastPosition = lastTokenPosition[token.id];
        if (lastPosition) {
          // Async function
          async function checkTokenPosition(token) {
            const targetLocation = { x: 500, y: 110 };
            const distance = Math.hypot(token.x - targetLocation.x, token.y - targetLocation.y);

            // Check if the token is within 150 pixels of the target location
            if (distance <= 150) {
              // Trigger the macro if it's not already in range
              if (!tokenInRange[token.id]) {
                chosenOne = token.actor; // Get the actor associated with the token
                ui.notifications.notify(`You have chosen ${chosenOne.name}`);
                await game.users.current.update({ "character": chosenOne.id });
                await game.macros.getName("Post Character Selection").execute();
                tokenInRange[token.id] = true; // Set the flag to true
              }
            } else {
              // Token is outside the range, reset the flag
              tokenInRange[token.id] = false;
            }
          }

          checkTokenPosition(token.document);
        }
      });
    }
  }, 800); // Check every 0.8 seconds (adjust as needed)
});