Hooks.on("canvasReady", () => {
  game.macros.getName("Play Music").execute();
});

Hooks.on("canvasSceneChange", () => {
  game.macros.getName("Play Music").execute();
});
