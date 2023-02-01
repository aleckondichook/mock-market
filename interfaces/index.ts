import React from "react";

export type User = {
  id: number;
  name?: string;
}

export interface LayoutProps {
  children: React.ReactNode
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}