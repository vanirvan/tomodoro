import { atom } from "jotai";

const historySheetAtom = atom<boolean>(false);
const settingsSheetAtom = atom<boolean>(false);

export { historySheetAtom, settingsSheetAtom };
