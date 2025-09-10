import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

declare function DevPinProvider({ children }: {
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;

interface DevPinProps {
    id: string;
    profileImg?: string;
    name: string;
    description?: string;
    x?: number;
    y?: number;
    todos: string[];
    root?: boolean;
}
declare function DevPin({ id, profileImg, name, description, x, y, todos, root, }: DevPinProps): react_jsx_runtime.JSX.Element | null;

export { DevPin, DevPinProvider };
