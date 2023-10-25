Hooks.on("canvasReady", () => {
  game.macros.getName("Play Music").execute();
});

Hooks.on("canvasSceneChange", () => {
  game.macros.getName("Play Music").execute();
});

Hooks.once("ready", async () => {
    const currentScene = game.scenes.active;
    if (currentScene && currentScene.name === "Travelling") {
        game.macros.getName("Arrive at Ardenspire").execute()
    }
  });