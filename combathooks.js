Hooks.on("deleteCombat", () => {
const currentScene1 = game.scenes.active;
const macroName1 = `${currentScene1.name} Hook`;
const macro1 = game.macros.getName(macroName1);
if (!macro1) { game.macros.getName("Encounter End").execute();
}
});
Hooks.on("pf2e.startTurn", () => game.macros.getName("AI Starting Point").execute());
