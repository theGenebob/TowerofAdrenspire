Hooks.on("deleteCombat", () => game.macros.getName("Encounter End").execute());
Hooks.on("pf2e.startTurn", () => game.macros.getName("AI Fear Check").execute());
