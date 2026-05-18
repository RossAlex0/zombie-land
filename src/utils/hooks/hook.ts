import React from "react";

export const useBjr = () =>
  React.useCallback(
    () =>
      fetch("/api/activities")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        }),
    [],
  );
