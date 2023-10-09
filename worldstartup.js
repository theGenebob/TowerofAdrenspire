Hooks.on('ready', async () => {
  const user = game.user;
  const userName = user.name;
  const mpack = game.packs.get("the-tower-of-ardenspire.tower-macros")
  const kickoffid = mpack.index.getName("Kickoff")?._id;

  // Check if the user's name is "Solo Player"
  if (userName !== 'Solo Player') {
    // Show a confirmation dialog
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
