import { Injectable } from '@angular/core';
import { IFilter } from '../interfaces/filter.interface';

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	private key = 'four-letter-filter';
	private pristineFilter: IFilter;
	private filter: IFilter = {
		on: true,
		reload: true,
		counts: {
			bad: 0,
			custom: 0,
		},
		dates: {
			lastOn: new Date().toLocaleString(),
			lastFiltered: new Date().toLocaleString(),
		},
		selectedReplacementType: '*****',
		replacementTypes: [
			{
				type: 0,
				label: '*****',
				value: '*****',
				selected: true,
			},
			{
				type: 1,
				label: '$#%@*',
				value: '$#%@*',
				selected: false,
			},
			{
				type: 2,
				label: '(blank)',
				value: '',
				selected: false,
			},
		],
		wordTypes: {
			offensive: true,
			bible: true,
		},
		words: {
			// tslint:disable-next-line:max-line-length
			bad:
				'YWhvbGUsYXNoMGxlLGFzaDBsZXMsYXNob2xlcyxBc3MlMjBNb25rZXksQXNzZmFjZSxhc3NoMGxlLGFzc2gwbGV6LGFzc2hvbGUsYXNzaG9sZXMsYXNzaG9seixhc3N3aXBlLGF6emhvbGUsYmFzc3RlcmRzLGJhc3RhcmR6LGJhc3RlcmRzLGJhc3RlcmR6LEJpYXRjaCxCbG93JTIwSm9iLGJvZmZpbmcsYnV0dGhvbGUsYnV0dHdpcGUsYzBjayxjMGNrcyxjMGssQ2FycGV0JTIwTXVuY2hlcixjYXdrLGNhd2tzLGNudHosY29jayxjb2NraGVhZCxjb2NrLWhlYWQsY29ja3MsQ29ja1N1Y2tlcixjb2NrLXN1Y2tlcixjcmFwLGN1bSxjdW50LGN1bnRzLGN1bnR6LGRpbGQwLGRpbGQwcyxkaWxkbyxkaWxkb3MsZGlsbGQwLGRpbGxkMHMsZG9taW5hdHJpY2tzLGRvbWluYXRyaWNzLGRvbWluYXRyaXgsZHlrZSxmYWcsZmFnMXQsZmFnZXQsZmFnZzF0LGZhZ2dpdCxmYWdnb3QsZmFnaXQsZmFncyxmYWd6LGZhaWcsZmFpZ3MsZmFydCxmdWNrLGZ1Y2tlcixmdWNraW4sZnVja2luZyxmdWNrcyxmdWssRnVrYWgsRnVrZW4sZnVrZXIsRnVraW4sRnVrayxGdWtrYWgsRnVra2VuLEZ1a2tlcixGdWtraW4sZzAwayxnYXlib3ksZ2F5Z2lybCxnYXlzLGdheXosaDAwcixoMGFyLGgwcmUsaG9hcixob29yLGhvb3JlLGphY2tvZmYsamFwLGphcHMsamVyay1vZmYsamlzaW0samlzcyxqaXptLGppenosa25vYnMsa25vYnosa3VudCxrdW50cyxrdW50eixMZXp6aWFuLExpcHNoaXRzLExpcHNoaXR6LG1hc29jaGlzdCxtYXNva2lzdCxtYXNzdGVyYmFpdCxtYXNzdHJiYWl0LG1hc3N0cmJhdGUsbWFzdGVyYmFpdGVyLG1hc3RlcmJhdGUsbWFzdGVyYmF0ZXMsbjFncixuYXN0dCxuaWdnZXIsbmlndXIsbmlpZ2VyLG5paWdyLG9yYWZpcyxvcmdhc2ltLG9yZ2FzdW0sb3JpZmFjZSxvcmlmaWNlLG9yaWZpc3MscGFja2kscGFja2llLHBhY2t5LHBha2kscGFraWUscGFreSxwZWNrZXIscGVlZW51cyxwZWVlbnVzc3MscGVlbnVzLHBlaW51cyxwZW4xcyxwZW5hcyxwZW51cyxwZW51dXMsUGh1YyxQaHVjayxQaHVrLFBodWtlcixQaHVra2VyLHBvbGFjLHBvbGFjayxwb2xhayxQb29uYW5pLHByMWMscHIxY2sscHIxayxwdXNzZSxwdXNzZWUscHV1a2UscHV1a2VyLHF1ZWVycyxxdWVlcnoscXdlZXJzLHF3ZWVyeixxd2VpcixyZWNrdHVtLHNhZGlzdCxzY2FuayxzY2hsb25nLHNleHksU2ghdCxzaDF0LHNoMXRlcixzaDF0cyxzaDF0dGVyLHNoMXR6LHNoaXQsc2hpdHMsc2hpdHRlcixTaGl0dHksU2hpdHksc2hpdHosU2h5dCxTaHl0ZSxTaHl0dHksU2h5dHksc2thbmNrLHNrYW5rLHNrYW5rZWUsc2thbmtleSxza2Fua3MsU2thbmt5LHNsdXQsc2x1dHMsU2x1dHR5LHNsdXR6LHRpdCx0dXJkLHZhMWppbmEsdmFnMW5hLHZhZ2lpbmEsdmFqMW5hLHZhamluYSx2dWxsdmEsdzBwLHdoMDByLHdoMHJlLHhyYXRlZCx4eHgsYiElMkJjaCxibG93am9iLGJsb3dqb2JzLGFyc2NobG9jaCxmdWNrLHNoaXQsYXNzaG9sZSxiIXRjaCxiMTdjaCxiMXRjaCxiaSUyQmNoLGJvaW9sYXMsYnVjZXRhLGMwY2ssY2F3ayxjaGluayxjaXBhLGNsaXRzLGNvY2ssY3VtLGN1bnQsZGlsZG8sZGlyc2EsZWpha3VsYXRlLGZhdGFzcyxmY3VrLGZ1ayxmdXgwcixob2VyLGhvcmUsamlzbSxrYXdrLGwzaXRjaCxsM2klMkJjaCxtYXN0dXJiYXRlLG1hc3RlcmJhdDMsbW90aGVyZnVja2VyLG1vZm8sbmF6aSxuaWdnYSxuaWdnZXIsbnV0c2FjayxwaHVjayxwaW1waXMscHVzc2Usc2Nyb3R1bSxzaCF0LHNoZW1hbGUsc2hpJTJCLHNoISUyQixzbHV0LHNtdXQsdGVldHMsdGl0cyxib29icyxiMDBicyx0ZWV6LHRlc3RpY2FsLHRpdHQsdzAwc2UsamFja29mZix3YW5rLHdob2FyLGR5a2UsZnVjayxzaGl0LGFtY2lrLGFuZHNrb3RhLGFyc2UsYXNzcmFtbWVyLGF5aXIsYmk3Y2gsYm9sbG9jayxidXR0LXBpcmF0ZSxjYWJyb24sY2F6em8sY2hyYWEsY2h1aixDb2NrLGN1bnQsZDRtbixkYXlnbyxkZWdvLGR1cGEsZHppd2thLGVqYWNrdWxhdGUsRWtyZW0qLEVrdG8sZW5jdWxlcixmYWVuLGZhZyxmYW5jdWxvLGZlZyxGZWxjaGVyLGZpY2tlbixmaXR0KixGbGlra2VyLEZvdHplLEZ1KCxmdWssZnV0a3JldHpuLGdvb2ssZ3VpZW5hLGgwcixoNHgwcixoZWx2ZXRlLGhvZXIqLGhvbmtleSxIdWV2b24saHVpLGluanVuLGppenosa2Fua2VyLGtpa2Usa2xvb3R6YWssa251bGxlLGt1ayxrdWtzdWdlcixLdXJhYyxrdXJ3YSxrdXNpKixreXJwYSosbGVzYm8sbWFtaG9vbixtYXN0dXJiYXQsbWVyZCxtaWJ1bixtb25rbGVpZ2gsbW91bGlld29wLG11aWUsbXVsa2t1LG11c2NoaSxuYXppcyxuZXBlc2F1cmlvLG5pZ2dlcixvcm9zcHUscGFza2EscGVyc2UscGlja2EscGllcmRvbCxwaW1tZWwscGlzcyxwaXpkYSxwb29udHNlZSxwb29wLHBvcm4scDBybixwcjBuLHB1bGEscHVsZSxwdXRhLHB1dG8scWFoYmVoLHF1ZWVmLHJhdXRlbmJlcmcsc2NoYWZmZXIsc2NoZWlzcyxzY2hsYW1wZSxzY2htdWNrLHNoIXQqLHNoYXJtdXRhLHNoYXJtdXRlLHNoaXBhbCxzaGl6LHNrcmlieixza3Vyd3lzeW4sc3BoZW5jdGVyLHNwaWMsc3BpZXJkYWxhaixzcGxvb2dlLHN1a2EsYjAwYix0aXR0LHR3YXQsdml0dHUsd2Fuayx3ZXRiYWNrLHdpY2hzZXIsd29wLHllZCx6YWJvdXJhaCxzaGl0ZSxzaGl0ZW4sc2hpdGhvbGUsc2hpdGhvdXNlLGhlbGxob2xlLGZyaWdnaW4sYnVsbHNoaXQsaG9yc2VzaGl0LGNoaWNrZW5zaGl0LGFwZXNoaXQscGlnc2hpdCxiYXRzaGl0LHNoaXR0aW5nLHNoaXRoZWFkLHNoaXR0ZWQsc2hpdHRlbixzaGF0LHNoaXR3b2xmLGNvY2tzdWNrZXIscGlzc2V0aCxtb3RoZXJmdWNrZXJzLGdvZGRhbW4sYXJzZWhvbGUsYXJzZWhvbGVzLGJvbGxvY2tz',
			bible: 'aGVsbCxoZWxscyx3aG9yZSxkYW1uLGFzcyxqYWNrYXNzLGFzc2Vz',
			// tslint:disable-next-line:max-line-length
			offensive:
				'Yml0Y2gsYml0Y2hlcyxhbnVzLGJhc3RhcmQsYmFzdGFyZHMsY2xpdCx2YWdpbmEsdnVsdmEsZ2F5LGtub2IsTGVzYmlhbixvcmdhc20scGVuaXMscHVzc3kscXVlZXIscmVjdHVtLHByaWNrLHNjcmV3LHNjcmV3aW5nLHNlbWVuLHNleCx0ZXN0aWNsZSxkaWNrLGRpa2UsZm9yZXNraW4scHJldGVlbixyZXRhcmQsa3JhdXQ=',
			custom: '',
		},
	};
	constructor() {
		this.pristineFilter = this.filter;

		this.getFilter();
	}

	setFilter(filter: IFilter): void {
		localStorage.setItem(this.key, JSON.stringify(filter));
	}

	getFilter(): IFilter {
		let filter = JSON.parse(localStorage.getItem(this.key));

		if (!filter) {
			filter = this.filter;

			this.setFilter(filter);
		}

		return filter;
	}

	resetFilter(): IFilter {
		this.filter = this.pristineFilter;

		this.setFilter(this.filter);

		return this.filter;
	}
}
