import type { PlaygroundPlugin, PluginUtils } from "./vendor/playground";

import clippy from "clippyjs";

const makePlugin = (utils: PluginUtils) => {
  let loop: any = null;

  const customPlugin: PlaygroundPlugin = {
    id: "clippy",
    displayName: "Clippy",
    didMount: (sandbox, container) => {
      // Create a design system object to handle
      // making DOM elements which fit the playground (and handle mobile/light/dark etc)
      const ds = utils.createDesignSystem(container);

      ds.title("Clippy");
      ds.p("Finally get someone who knows what to do next in the Playground");

      const startButton = document.createElement("input");
      startButton.type = "button";
      startButton.value = "Make a Clippy";
      container.appendChild(startButton);

      if (!document.getElementById("clippy-css")) {
        const searchCSS = document.createElement("link");
        searchCSS.rel = "stylesheet";
        searchCSS.id = "clippy-css";
        searchCSS.href = "https://gitcdn.xyz/repo/pi0/clippyjs/master/assets/clippy.css";
        searchCSS.type = "text/css";
        document.body.appendChild(searchCSS);
      }

      let agent: any | undefined = undefined;
      startButton.onclick = () => {
        clippy.load("Clippy", (_agent) => {
          // @ts-ignore
          if (window.agents) {
            // @ts-ignore
            window.agents.push(_agent);
          } else {
            // @ts-ignore
            window.agents = [_agent];
          }

          agent = _agent;
          agent.show();
          const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
          const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

          agent.moveTo(Math.random() * vw - 30, Math.random() * vh - 30);
        });
      };

      loop = setInterval(() => {
        // @ts-ignore
        if (!window.agents) return;
        // @ts-ignore
        var item = window.agents[Math.floor(Math.random() * window.agents.length)];

        const markers = sandbox.monaco.editor.getModelMarkers({ resource: sandbox.getModel().uri });
        if (markers.length) {
          item.speak(`You have ${markers.length} issue${markers.length === 1 ? "" : "s"}`);
          item.animate();
        }
      }, 1500);
    },

    // Gives you a chance to remove anything set up,
    // the container itself if wiped of children after this.
    didUnmount: () => {
      if (loop) {
        clearInterval(loop);
      }
    },
  };

  return customPlugin;
};

export default makePlugin;
