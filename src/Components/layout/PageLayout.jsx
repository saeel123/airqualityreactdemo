import React, { useCallback, useState } from "react";
import Header from "./Header";

const PageLayout = (props) => {
  return (
    <>
      <Header />
      {props.children}
    </>
  );
};

export default PageLayout;
