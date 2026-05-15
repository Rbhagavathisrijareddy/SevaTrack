import { createTheme } from "@mantine/core";

export const ngoTheme =
  createTheme({
    primaryColor: "teal",

    defaultRadius: "md",

    fontFamily:
      "Inter, sans-serif",

    components: {
      Card: {
        defaultProps: {
          shadow: "sm",
          radius: "xl",
          padding: "lg",
        },
      },
    },
  });