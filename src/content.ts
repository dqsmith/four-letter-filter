declare var chrome: any;

class Content {
	private censorWordList: any;
	private regex = /[^a-zA-z0-9|\$|\@]|\^/g;
	private filter: any;
	private badWordCount = 0;

	private rejectScriptTextFilter = {
		acceptNode: (node: any) => {
			if (node.nodeName !== 'SCRIPT') {
				return NodeFilter.FILTER_ACCEPT;
			}
		},
	};

	constructor() {
		chrome.runtime.onMessage.addListener((request: any) => {
			if (request && request.filter) {
				this.filter = request.filter;

				if (this.filter.on) {
					this.updateFilter();
				}
			}
		});

		const observer = new MutationObserver((mutations) => {
			for (let i = 0; i < mutations.length; i++) {
				this.applyFilter(mutations[i].target);
			}
		});

		observer.observe(document.body, { childList: true, subtree: true });

		this.applyIframeFilter(true);
	}

	private updateFilter(): void {
		this.splitWords();
		this.applyFilter();
	}

	private applyIframeFilter(waitForLoad: boolean = false): void {
		const frames = document.body.getElementsByTagName('iframe');

		if (frames) {
			for (let i = 0; i < frames.length; i++) {
				const frame = frames[i];

				if (waitForLoad) {
					frame.onload = () => {
						try {
							this.applyFilter(frame.contentDocument);
						} catch (error) {}
					};
				} else {
					try {
						this.applyFilter(frame.contentDocument);
					} catch (error) {}
				}
			}
		}
	}

	private splitWords(): void {
		this.censorWordList = window.atob(this.filter.words.bad).split(',');

		if (this.filter.words.custom) {
			this.censorWordList.push(
				...window.atob(this.filter.words.custom).split(',')
			);
		}

		if (this.filter.wordTypes.offensive) {
			this.censorWordList.push(
				...window.atob(this.filter.words.offensive).split(',')
			);
		}

		if (this.filter.wordTypes.bible) {
			this.censorWordList.push(
				...window.atob(this.filter.words.bible).split(',')
			);
		}
	}

	private applyFilter(element: any = null): void {
		const targetElement = element || document.body;

		const walker = document.createTreeWalker(
			targetElement,
			NodeFilter.SHOW_ELEMENT,
			this.rejectScriptTextFilter,
			false
		);

		let node: any;

		while ((node = walker.nextNode())) {
			if (node && node.nodeType === 1) {
				for (let i = 0; i < node.childNodes.length; i++) {
					const child = node.childNodes[i];

					if (child.nodeType === 3) {
						const text = child.nodeValue;
						const replacedText = this.clean(text);

						if (replacedText !== text) {
							node.replaceChild(
								document.createTextNode(replacedText),
								child
							);
						}
					}
				}
			}
		}

		if (this.badWordCount) {
			chrome.runtime.sendMessage({ count: this.badWordCount });

			this.badWordCount = 0;
		}
	}

	private clean(text: string): string {
		return text
			.split(/\b/)
			.map((word: string) => {
				if (this.isProfane(word)) {
					this.badWordCount++;

					return this.replaceWord(word);
				}

				return word;
			})
			.join('');
	}

	private isProfane(wordsList: string): boolean {
		const words = wordsList.split(' ');

		for (let j = 0; j < words.length; j++) {
			const word = words[j].toLowerCase().replace(this.regex, '');

			if (!word) {
				return false;
			}

			try {
				// tslint:disable-next-line:no-bitwise
				if (~this.censorWordList.indexOf(word)) {
					return true;
				}
			} catch (error) {
				return false;
			}
		}

		return false;
	}

	private replaceWord(word: string): string {
		const replaceRegex = /\w/g;

		return word
			.replace(this.regex, '')
			.replace(replaceRegex, this.generatePlaceholder());
	}

	private generatePlaceholder(): string {
		if (this.filter.selectedReplacementType === '*****') {
			return '*';
		} else if (this.filter.selectedReplacementType === '') {
			return '';
		}

		const characters = '$#%@!*';

		return characters.charAt(Math.floor(Math.random() * characters.length));
	}
}

let content;

// Ensure that this tab only has one filter
if (!content) {
	content = new Content();
}
