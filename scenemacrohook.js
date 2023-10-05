Hooks.on('ready', () => {
    let sceneActivated = false; // Initialize a variable to track if a scene has been activated this session
    // Register a hook to listen for scene changes
    Hooks.on('canvasInit', () => {
      // Get the currently active scene
      const currentScene = game.scenes.active;
  
      // Check if the scene has been activated this session
      if (!sceneActivated) {
        // Construct the macro name based on the scene's name with " Hook" appended to it
        const macroName = `${currentScene.name} Hook`;
  
        const macro = game.macros.getName(macroName);
  
        if (macro) {
          // Execute the macro if it exists
          macro.execute();
          sceneActivated = true; // Set the flag to true to indicate a scene has been activated
        }
      }
    });
  });

  Hooks.on('ready', () => {
    // Get the currently active scene
    const currentScene = game.scenes.active;
  
    // Construct the macro name based on the scene's name with " Hook" appended to it
    const macroName = `${currentScene.name} Hook`;
  
    const macro = game.macros.getName(macroName);
  
    if (macro) {
      // Execute the macro if it exists
      macro.execute();
    }
  });