import { forwardRef } from "react";
import { DefaultButton, mergeStyleSets, ThemeProvider } from "@fluentui/react";

import { panel } from "@foxglove/studio";

const styles = mergeStyleSets({
  root: {
    margin: "auto",
  },
  row: {
    display: "block",
    whiteSpace: "nowrap",
  },
  cell: {
    display: "inline-block",
    width: "120px",
    margin: "4px",
    textAlign: "center",
  },
});

// By default the ThemeProvider adds an extra div to the DOM tree. We can disable this with a
// custom `as` component to FluentThemeProvider. The component must support a `ref` property
// otherwise we get react warnings.
const ThemeContainer = forwardRef((props, _ref) => <>{props.children}</>);
ThemeContainer.displayName = "ThemeContainer";

type Vec3 = {
  x: number;
  y: number;
  z: number;
};

type Twist = {
  linear: Vec3;
  angular: Vec3;
};

export function TeleopPanel(): JSX.Element {
  const theme = panel.useFluentUiTheme();

  const publish = panel.usePublisher<Twist>({
    name: "TurtleStudioTelop",
    topic: "/turtle1/cmd_vel",
    datatype: "geometry_msgs/Twist",
    datatypes: {
      "geometry_msgs/Twist": {
        fields: [
          {
            type: "Vec3",
            name: "linear",
          },
          {
            type: "Vec3",
            name: "angular",
          },
        ],
      },
      Vec3: {
        fields: [
          { type: "float64", name: "x" },
          { type: "float64", name: "y" },
          { type: "float64", name: "z" },
        ],
      },
    },
  });

  return (
    <ThemeProvider as={ThemeContainer} theme={theme}>
      <div className={styles.root}>
        <div className={styles.row}>
          <div className={styles.cell}></div>
          <div className={styles.cell}>
            <DefaultButton
              onClick={() => {
                publish({
                  linear: {
                    x: 1,
                    y: 0,
                    z: 0,
                  },
                  angular: {
                    x: 0,
                    y: 0,
                    z: 0,
                  },
                });
              }}
            >
              Forward
            </DefaultButton>
          </div>
          <div className={styles.cell}></div>
        </div>
        <div className={styles.row}>
          <div className={styles.cell} style={{ textAlign: "right" }}>
            <DefaultButton
              onClick={() => {
                publish({
                  linear: {
                    x: 0,
                    y: 0,
                    z: 0,
                  },
                  angular: {
                    x: 0,
                    y: 0,
                    z: 1,
                  },
                });
              }}
            >
              Left
            </DefaultButton>
          </div>
          <div className={styles.cell}>
            <DefaultButton
              onClick={() => {
                publish({
                  linear: {
                    x: -1,
                    y: 0,
                    z: 0,
                  },
                  angular: {
                    x: 0,
                    y: 0,
                    z: 0,
                  },
                });
              }}
            >
              Backward
            </DefaultButton>
          </div>
          <div className={styles.cell} style={{ textAlign: "left" }}>
            <DefaultButton
              onClick={() => {
                publish({
                  linear: {
                    x: 0,
                    y: 0,
                    z: 0,
                  },
                  angular: {
                    x: 0,
                    y: 0,
                    z: -1,
                  },
                });
              }}
            >
              Right
            </DefaultButton>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
