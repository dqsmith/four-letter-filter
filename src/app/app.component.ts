import {
	Component,
	ViewEncapsulation,
	OnInit,
	ChangeDetectorRef,
} from '@angular/core';
import { IFilter } from './interfaces/filter.interface';
import { StorageService } from './services/storage.service';
import { IStat } from './interfaces/stats.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var chrome;

export interface PeriodicElement {
	name: string;
	value: any;
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
	toolbarName = 'Four Letter Filter';
	filter: IFilter;
	detailsOpen = true;
	icon = '../assets/images/icon32.png';
	customWord = '';
	stats: Array<IStat> = [];
	displayedColumns: Array<string> = ['name', 'value'];

	constructor(
		private storageService: StorageService,
		private snackBar: MatSnackBar,
		private changeDetector: ChangeDetectorRef
	) {
		this.filter = this.storageService.getFilter();
	}

	ngOnInit(): void {
		chrome.runtime.onMessage.addListener((request: any) => {
			if (request && request.countUpdated) {
				// Update filter
				this.filter = this.storageService.getFilter();

				this.setStats();
			}
		});

		chrome.tabs.query(
			{ active: true, currentWindow: true },
			(tabs: any) => {
				chrome.tabs.executeScript(
					tabs[0].id,
					{ file: 'content.min.js' },
					() => {
						if (chrome.runtime.lastError) {
							console.warn(
								'Unable to inject Bad Words Filter script into tab.'
							);
						} else {
						}
					}
				);
			}
		);

		this.setStats();

		this.updateIcon();
	}

	onCustomWord(): void {
		const customWord = this.customWord.toLowerCase();

		if (customWord.includes(' ')) {
			this.setSnackBar(
				`Custom word must be a single word: ${customWord}`
			);

			return;
		}

		let words = atob(this.filter.words.custom);

		const customWords = words.split(',');

		if (!customWords.includes(customWord)) {
			if (words !== '') {
				words += ',' + customWord;
			} else {
				words = customWord;
			}

			this.filter.words.custom = btoa(words);
			this.filter.counts.custom += 1;

			this.update();

			this.setStats();

			this.setSnackBar(`Added custom word: ${customWord}`);
		} else {
			this.setSnackBar(`Custom word previously added: ${customWord}`);
		}

		this.customWord = '';
	}

	onReplacement(option: any): void {
		this.filter.replacementTypes.forEach((type) => {
			type.selected = false;

			if (type.type === option.type) {
				type.selected = true;

				this.filter.selectedReplacementType = type.value;
			}
		});

		this.update();
	}

	onFilterSelected(): void {
		if (this.filter.on) {
			return;
		}

		this.filter.on = true;
		this.filter.dates.lastOn = new Date().toLocaleString();

		this.setStats();

		this.updateIcon();

		this.update();

		this.setSnackBar('Filter turned on');
	}

	onFilterDeselected(): void {
		if (!this.filter) {
			return;
		}

		this.filter.on = false;

		this.updateIcon();

		this.storageService.setFilter(this.filter);

		if (this.filter.reload) {
			this.reload();
		}

		this.setSnackBar('Filter turned off');
	}

	onReload(event: any): void {
		this.filter.reload = event.checked;

		this.storageService.setFilter(this.filter);
	}

	onOffensiveType(event: any): void {
		this.filter.wordTypes.offensive = event.checked;

		this.update();
	}

	onBibleType(event: any): void {
		this.filter.wordTypes.bible = event.checked;

		this.update();
	}

	onReset(): void {
		this.filter = this.storageService.resetFilter();

		this.setStats();

		this.updateIcon();

		this.update();

		if (this.filter.reload) {
			this.reload();
		}

		this.setSnackBar('Reset filter back to factory condition');
	}

	onAbout(): void {
		chrome.tabs.create({ url: 'about.html' }, () => {});
	}

	private reload(): void {
		chrome.tabs.getSelected(null, (tab) => {
			const code = 'window.location.reload();';

			chrome.tabs.executeScript(tab.id, { code: code });
		});
	}

	private updateIcon(): void {
		let icon: string;

		icon = this.filter.on ? 'icon32.png' : 'icon32_off.png';
		icon = '../assets/images/'.concat(icon);

		this.icon = icon;

		chrome.browserAction.setIcon({ path: icon, tabId: null });
	}

	private update(query: boolean = true): void {
		this.storageService.setFilter(this.filter);

		// Do not message content
		if (!query) {
			return;
		}

		const filter = this.filter;

		chrome.tabs.query(
			{ active: true, currentWindow: true },
			(tabs: any) => {
				const message: any = {
					filter: filter,
				};

				chrome.tabs.sendMessage(tabs[0].id, message);
			}
		);
	}

	private setStats(): void {
		this.stats = [
			{ name: 'Words filtered', value: this.filter.counts.bad },
			{ name: 'Custom words', value: this.filter.counts.custom },
			{ name: 'Last filtered', value: this.filter.dates.lastFiltered },
			{ name: 'Filtering since', value: this.filter.dates.lastOn },
		];

		this.changeDetector.detectChanges();
	}

	private setSnackBar(message: string, action: string = ''): void {
		this.snackBar.open(message, action, {
			duration: 3000,
		});
	}
}
