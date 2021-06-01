import { mergeStyleSets } from "@fluentui/react";

import { panel } from "@foxglove/studio";
import { useEffect, useRef, useState } from "react";

const styles = mergeStyleSets({
  root: {
    backgroundColor: "blue",
  },
});

type PoseMsg = {
  x: number;
  y: number;
};

export function TurtlePanel(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] =
    useState<CanvasRenderingContext2D | undefined>(undefined);

  const messageEvents = panel.useMessagesByTopic({
    topics: ["/turtle1/pose"],
    historySize: 1000,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    // turtlesim coordinate [0, 0] is the bottom left corner
    // canvas [0, 0] is the upper left corner
    // so we transform the coordinate system to have [0, 0] the bottom left corner
    context.transform(1, 0, 0, -1, 0, canvas.height);
    setContext(context);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    const poseMessageEvents = messageEvents["/turtle1/pose"];
    const points = poseMessageEvents?.map(
      (messageEvent) => messageEvent.message
    ) as PoseMsg[];
    if (!points) {
      return;
    }

    const first = points[0];
    const last = points[points.length - 1];
    if (!first) {
      return;
    }

    context.lineWidth = 2;
    context.strokeStyle = "#FFFFFF";
    context.beginPath();
    context.moveTo(first.x * 10, first.y * 10);
    for (let i = 1; i < points.length; ++i) {
      const point = points[i];
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
  }, [messageEvents, context]);

  return (
    <div style={{ margin: "auto" }}>
      <canvas
        ref={canvasRef}
        width="110"
        height="110"
        className={styles.root}
      />
    </div>
  );
}
