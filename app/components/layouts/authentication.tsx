import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}
export default function Authenticationlayout({ children, className }: Props) {
  return (
    <div
      className={
        "md:h-screen md:flex justify-center items-center py-6 px-6 md:px-20  " +
        className
      }
    >
      {children}
    </div>
  );
}
