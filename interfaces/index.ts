import React from "react";

export type User = {
  id: number;
  name?: string;
}

export interface LayoutProps {
  children: React.ReactNode
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface TradeData {
  id: string;
  ticker: string;
  amount: number;
  price: number;
  direction: string;
  filledAt: Date;
  traderId: string;
}

export interface HoldingsData {
  ticker: string;
  amount: number;
}