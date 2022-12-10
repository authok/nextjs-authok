import createDebug, { Debugger } from 'debug';

export default (name: string): Debugger => createDebug('nextjs-authok').extend(name);
