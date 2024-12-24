/* global process */
import React from "react";
import whyDidYouRender from "@welldone-software/why-did-you-render";
import { useSelector } from "react-redux";

if (process.env.NODE_ENV === "development") {
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackExtraHooks: [[useSelector, 'useSelector']],
    trackHooks: true
  });
}
