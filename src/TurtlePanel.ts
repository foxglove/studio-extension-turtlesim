// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { PanelExtensionContext } from "@foxglove/studio";

type PoseMsg = {
  x: number;
  y: number;
};

function initTurtlePanel(panelContext: PanelExtensionContext) {
  const panelDiv = document.createElement("div");
  panelDiv.style.margin = "auto";
  panelDiv.style.display = "flex";
  panelDiv.style.height = "100%";
  panelContext.panelElement.appendChild(panelDiv);

  const canvas = document.createElement("canvas");
  panelDiv.appendChild(canvas);
  canvas.width = 110;
  canvas.height = 110;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.objectFit = "scale-down";

  const context = canvas.getContext("2d");

  // if we can't get a context - we can't do much with the panel
  if (!context) {
    // fixme - should we provide an error mechanism to panels?
    // should panels be able to throw?
    panelDiv.innerText = "unable to get 2d context";
    return;
  }

  // turtlesim coordinate [0, 0] is the bottom left corner
  // canvas [0, 0] is the upper left corner
  // so we transform the coordinate system to have [0, 0] the bottom left corner
  context.transform(1, 0, 0, -1, 0, canvas.height);

  const allPoints: PoseMsg[] = [];

  panelContext.watch("currentFrame");
  panelContext.subscribe(["/turtle1/pose"]);
  panelContext.onRender = (renderState, done) => {
    context.fillStyle = "blue";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    // get the latest messages for the turtle pose topic
    const newPoints = (renderState.currentFrame
      ?.filter((msgEvent) => msgEvent.topic === "/turtle1/pose")
      .map((messageEvent) => messageEvent.message) ?? []) as PoseMsg[];

    // keep the last 1000 points
    if (allPoints.length > 1000) {
      allPoints.splice(0, allPoints.length - 1000);
    }
    allPoints.push(...newPoints);

    const first = allPoints[0];
    const last = allPoints[allPoints.length - 1];
    if (!first) {
      done();
      return;
    }

    context.lineWidth = 2;
    context.strokeStyle = "#FFFFFF";
    context.beginPath();
    context.moveTo(first.x * 10, first.y * 10);
    for (let i = 1; i < allPoints.length; ++i) {
      const point = allPoints[i];
      if (!point) {
        continue;
      }
      context.lineTo(point.x * 10, point.y * 10);
    }
    context.stroke();

    if (last) {
      context.beginPath();
      context.arc(last.x * 10, last.y * 10, 10, 0, 2 * Math.PI, false);
      context.fillStyle = "green";
      context.fill();
    }

    done();
  };
}

export { initTurtlePanel };
