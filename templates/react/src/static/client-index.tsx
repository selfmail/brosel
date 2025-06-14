/// <reference lib="dom" />
import { Component } from "../pages/index";
import { hydrateRoot } from "react-dom/client";

const props = (window as any).__INITIAL_PROPS__;


hydrateRoot(document, <Component {...props} />);
