Hooks.on("getSceneControlButtons", (buttons) => {
  if (!game.user.isGM) return;

  const existingButton = buttons.find(b => b.name === "tower-options");
  if (existingButton) {
    console.log("Tower options button already exists.");
    return;
  }

  const towerOptions = {
    name: "tower-options",
    icon: "fa-solid fa-gopuram",
    title: "Tower Options",
    layer: "controls",
    tools: [],
  };
// Toggle Music
    towerOptions.tools.push({
      name: "toggle-music",
      icon: "fas fa-music", 
      title: "Toggle Music",
      button: true,
      onClick: () => {
        (async () => {
          // Search for the "Play Music" and "Play Music (disabled)" macros
          const playMusicMacro = game.macros.getName("Play Music");
          const playMusicDisabledMacro = game.macros.getName("Play Music (disabled)");
        
          if (playMusicMacro) {
            // If "Play Music" macro is found, rename it, stop all playing audio, and then execute it
            document.querySelector(".control-tool[data-tool='toggle-music'] i").className = "fas fa-music-slash";
            await playMusicMacro.update({ name: "Play Music (disabled)" });
            game.audio.playing.forEach(s => s.stop());
            ui.notifications.notify("Music Disabled")
          } else if (playMusicDisabledMacro) {
            // If "Play Music (disabled)" macro is found, rename it and stop all playing audio
            document.querySelector(".control-tool[data-tool='toggle-music'] i").className = "fas fa-music";
            await playMusicDisabledMacro.update({ name: "Play Music" });
            game.audio.playing.forEach(s => s.stop());
            // Now execute the macro
            playMusicDisabledMacro.execute();
            ui.notifications.notify("Music Enabled")
          } else {
            // If neither macro is found, log an error message
            console.error('Macro "Play Music" or "Play Music (disabled)" not found.');
          }
        })();
      }
    });

    // Reset World
    towerOptions.tools.push({
      name: "reset-world",
      icon: "fas fa-undo", // 
      title: "Reset World",
      button: true,
      onClick: async () => {
        const mpack = game.packs.get("the-tower-of-ardenspire.tower-macros");
        const kickoffid = mpack.index.getName("Kickoff")?._id;
        const dialogResult = await Dialog.confirm({
          title: 'Warning!',
          content: '<p>Welcome to "The Tower of Ardenspire." By choosing "Yes" below, you are commencing the module initialization process.</p><p><strong>Please be aware that this procedure will result in the removal of all pre-existing data within this world. If this is not your intention, please click "No" and promptly disable this module.</strong></p><p>I highly recommend against proceeding if you have been utilizing this world for other purposes. Ideally, this module is intended for installation within a freshly created world.</p><p>I hope you have as much fun playing this module as I had making it. </p>',
          yes: async () => {
            // User clicked "Accept"
            // Delete data from various parts of the world
        await game.scenes.forEach(scene => scene.delete());
        Folder.deleteDocuments(game.folders.filter(i=>i.type==="Scene").map(i=>i.id))
        await game.actors.forEach(actor => actor.delete());
        Folder.deleteDocuments(game.folders.filter(i=>i.type==="Actor").map(i=>i.id))
        await game.items.forEach(item => item.delete());
        Folder.deleteDocuments(game.folders.filter(i=>i.type==="Item").map(i=>i.id))
        await game.journal.forEach(entry => entry.delete());
        Folder.deleteDocuments(game.folders.filter(i=>i.type==="JournalEntry").map(i=>i.id))
        await game.tables.forEach(table => table.delete());
        Folder.deleteDocuments(game.folders.filter(i=>i.type==="RollTable").map(i=>i.id))
        await game.playlists.forEach(playlist => playlist.delete());
        Folder.deleteDocuments(game.folders.filter(i=>i.type==="Playlist").map(i=>i.id))
        await game.macros.forEach(macro => macro.delete());
        Folder.deleteDocuments(game.folders.filter(i=>i.type==="Macro").map(i=>i.id))
      
      // Delete Chats
        await ChatMessage.deleteDocuments([], {deleteAll: true});
      
      // Delete all homebrew traits
        const currentSettingValue = duplicate(game.settings.get("pf2e", "homebrew.creatureTraits"));
        currentSettingValue.length = 0;
        await game.settings.set("pf2e", "homebrew.creatureTraits", currentSettingValue);
            
        // Import and execute the "Kickoff" macro
        try {
          await game.macros.importFromCompendium(mpack, kickoffid);
          const kickoffMacro = game.macros.getName("Kickoff");
          if (kickoffMacro) {
            await kickoffMacro.execute();
          } else {
            ui.notifications.warn('Macro "Kickoff" not found.');
          }
           } catch (error) {
              ui.notifications.error('Error executing "Kickoff" macro: ' + error.message);
            }
          },
          no: () => {
            // User clicked "Reject" (cancel)
            ui.notifications.warn('Action canceled.');
          },
          defaultYes: false,
        });
      }
    });

  buttons.push(towerOptions);
});

Hooks.once("ready", () => {
  ui.controls.render();
});
