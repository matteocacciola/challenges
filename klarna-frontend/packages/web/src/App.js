import React, { useState } from "react";

import GravatarList from "./GravatarList";
import Header from "./Header";
import {calculateMarginsOfGravatar, calculateNumberOfImages} from "./utils";

const App = () => {
  const [state, setState] = useState(() => {
    window.addEventListener("scroll", () => {
      setState({ images: calculateNumberOfImages() });
    });

    window.addEventListener("resize", () => {
      setState({ images: calculateNumberOfImages() });
      calculateMarginsOfGravatar();
    });

    calculateMarginsOfGravatar();
    return { images: calculateNumberOfImages() };
  });

  return (
    <>
      <Header />

      <div>
        <GravatarList state={state} />
      </div>
    </>
  );
};

export default App;
