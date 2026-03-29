import { Denomination } from './types';

export const DENOMINATIONS: Denomination[] = [
  { value: 100, label: "$100", isCoin: false, minKeep: 0 },
  { value: 50, label: "$50", isCoin: false, minKeep: 0 },
  { value: 20, label: "$20", isCoin: false, minKeep: 1 },
  { value: 10, label: "$10", isCoin: false, minKeep: 3 },
  { value: 5, label: "$5", isCoin: false, minKeep: 5 },
  { value: 2, label: "$2", isCoin: true, minKeep: 0 },
  { value: 1, label: "$1", isCoin: true, minKeep: 0 },
  { value: 0.5, label: "$0.5", isCoin: true, minKeep: 0 },
  { value: 0.2, label: "$0.2", isCoin: true, minKeep: 0 },
  { value: 0.1, label: "$0.1", isCoin: true, minKeep: 0 },
  { value: 0.05, label: "$0.05", isCoin: true, minKeep: 0 },
];

export const KEEP_IN_REGISTER_TARGET = 200;
