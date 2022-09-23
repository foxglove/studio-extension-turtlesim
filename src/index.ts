import { ExtensionActivate } from "@foxglove/studio";

import { initTurtlePanel } from "./TurtlePanel";
// import { TeleopPanel } from "./TeleopPanel";

export const activate: ExtensionActivate = (ctx) => {
  ctx.registerPanel({ name: "Turtle", initPanel: initTurtlePanel });
  //ctx.registerPanel({ name: "Teleop", initTeleopPanel });
};
