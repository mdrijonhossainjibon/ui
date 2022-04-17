import { en } from './en';
import { ru } from './ru';

export type LangType = typeof en;

export const mobileTranslations = {
	default: en,
	en,
	ru,
};
