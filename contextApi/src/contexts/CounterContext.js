import { createContext } from "react";

export const CounterContext = createContext({ count: 0, addCount: () => { }, deleteCount: () => { } })

export const CounterContextProvider = CounterContext.Provider