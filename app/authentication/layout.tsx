import React, { ReactNode } from "react";

export default function AuthenticationViewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div>{children}</div>;
}
