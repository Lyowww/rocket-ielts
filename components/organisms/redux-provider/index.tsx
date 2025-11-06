"use client";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/rtk/store";

type Props = {
  children: ReactNode;
};

const ReduxProvider = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;


