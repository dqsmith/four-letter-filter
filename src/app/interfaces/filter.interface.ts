interface IReplacementTypes {
	type: number;
	value: string;
	label: string;
	selected: boolean;
}

interface IWordTypes {
	offensive: true;
	bible: true;
}

interface IWords {
	bad: string;
	custom?: string;
	offensive?: string;
	bible?: string;
}

interface ICounts {
	bad: number;
	custom: number;
}

interface IDates {
	lastOn: string;
	lastFiltered: string;
}

export interface IFilter {
	on: boolean;
	reload: true;
	counts: ICounts;
	dates: IDates;
	selectedReplacementType: string;
	replacementTypes: Array<IReplacementTypes>;
	wordTypes: IWordTypes;
	words: IWords;
}
