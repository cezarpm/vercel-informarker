import { styled } from "@ignite-ui/react";

export const Container = styled("main", {
  maxWidth: "700px",
  margin: "10% auto",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",

  "> form": {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
});

export const Title = styled("h1", {
  fontSize: "18px",
  color: "rgba(0, 0, 0, 1)",
  textAlign: "center",
  fontFamily: "Roboto",
});

export const Description = styled("p", {
  fontSize: "12px",
  color: "rgba(0, 0, 0, 1)",
  textAlign: "center",
  marginBottom: "20px",
  fontFamily: "Roboto",
  marginTop: "10px",
});
