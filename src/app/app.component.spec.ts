import { TestBed, ComponentFixture, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { IFilter } from './interfaces/filter.interface';

// tslint:disable-next-line: no-string-literal
const chrome = (window['chrome'] = {
	tabs: {
		query: () => {},
		getSelected: () => {},
		create: () => {},
	},
	browserAction: {
		setIcon: () => {},
	},
});

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let filter: IFilter;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AppModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;

		filter = {
			on: true,
			reload: true,
			counts: {
				bad: 1,
				custom: 1,
			},
			dates: {
				lastOn: '',
				lastFiltered: '',
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
				bad: btoa('bad'),
				custom: btoa('custom'),
				offensive: btoa('offensive'),
				bible: btoa('bible'),
			},
		};

		component.filter = filter;
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});

	it('should have a tool bar name', () => {
		expect(component.toolbarName).toBeDefined();
		expect(component.toolbarName).toBe('Four Letter Filter');
	});

	it('should indicate if details are open', () => {
		expect(component.detailsOpen).toBeDefined();
		expect(component.detailsOpen).toBe(true);

		component.detailsOpen = false;

		expect(component.detailsOpen).toBe(false);
	});

	it('should have a filter', () => {
		expect(component.filter).toBeDefined();
		expect(component.filter).toEqual(filter);
	});

	it('should store an icon', () => {
		expect(component.icon).toBeDefined();
		const icon = '../assets/images/icon32.png';

		expect(component.icon).toEqual(icon);
	});

	it('should store a custom word', () => {
		expect(component.customWord).toBeDefined();
		expect(component.customWord).toBe('');

		component.customWord = 'custom';

		expect(component.customWord).toBe('custom');
	});

	it('should store stats', () => {
		expect(component.stats).toBeDefined();
		expect(component.stats.length).toBe(0);

		const stat = {
			name: 'Custom words',
			value: 1,
		};

		component.stats.push(stat);

		expect(component.stats.length).toBe(1);
		expect(component.stats[0].name).toBe('Custom words');
		expect(component.stats[0].value).toBe(1);
	});

	it('should handle a custom word', () => {
		expect(component.onCustomWord).toBeDefined();

		component.customWord = 'hello';

		component.onCustomWord();

		expect(filter.words.custom).toEqual(btoa('custom,hello'));

		component.filter.words.custom = '';
		component.customWord = 'hello';

		component.onCustomWord();

		expect(filter.words.custom).toEqual(btoa('hello'));
	});

	it('should store displayed name columns', () => {
		expect(component.displayedColumns).toBeDefined();
		expect(component.displayedColumns.length).toBe(2);

		expect(component.displayedColumns[0]).toBe('name');
		expect(component.displayedColumns[1]).toBe('value');
	});

	it('should handle selecting a new replacement option', () => {
		expect(component.filter.replacementTypes).toBeDefined();
		expect(component.filter.replacementTypes[0].selected).toBe(true);
		expect(component.filter.replacementTypes[1].selected).toBe(false);

		component.onReplacement({ type: 1, value: '$#%@*' });

		expect(component.filter.replacementTypes[0].selected).toBe(false);
		expect(component.filter.replacementTypes[1].selected).toBe(true);
		expect(component.filter.selectedReplacementType).toBe('$#%@*');
	});

	it('should handle the filter powered on', () => {
		expect(component.filter.on).toBeTrue();
		component.filter.on = false;
		component.icon = '../assets/images/icon32_off.png';
		expect(component.filter.on).toBeFalse();

		component.onFilterSelected();
		expect(component.filter.on).toBeTrue();

		component.onFilterSelected();
		expect(component.filter.on).toBeTrue();
		expect(component.icon).toBe('../assets/images/icon32.png');

	});

	it('should handle the filter powered off', () => {
		expect(component.filter.on).toBeTrue();
		component.icon = '../assets/images/icon32.png';
		component.onFilterDeselected();
		expect(component.filter.on).toBeFalse();

		component.onFilterDeselected();
		expect(component.filter.on).toBeFalse();
		expect(component.icon).toBe('../assets/images/icon32_off.png');
	});

	it('should handle storing a reload', () => {
		expect(component.filter.reload).toBeTrue();

		component.onReload({ checked: false });
		expect(component.filter.reload).toBeFalse();

		component.onReload({ checked: true });
		expect(component.filter.reload).toBeTrue();
	});

	it('should handle storing an offensive type check', () => {
		expect(component.filter.wordTypes.offensive).toBeTrue();

		component.onOffensiveType({ checked: false });
		expect(component.filter.wordTypes.offensive).toBeFalse();

		component.onOffensiveType({ checked: true });
		expect(component.filter.wordTypes.offensive).toBeTrue();
	});

	it('should handle storing a bible type check', () => {
		expect(component.filter.wordTypes.bible).toBeTrue();

		component.onBibleType({ checked: false });
		expect(component.filter.wordTypes.bible).toBeFalse();

		component.onBibleType({ checked: true });
		expect(component.filter.wordTypes.bible).toBeTrue();
	});

	it('should handle a reset', () => {
		const storageFilter = {
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

		expect(component.filter).toBeDefined();
		expect(
			JSON.stringify(component.filter) !== JSON.stringify(storageFilter)
		).toBeTrue();

		component.onReset();

		expect(
			JSON.stringify(component.filter) === JSON.stringify(storageFilter)
		).toBeTrue();
	});

	it('should handle requesting the about page', () => {
		expect(component.onAbout).toBeDefined();

		spyOn(component, 'onAbout');

		component.onAbout();

		expect(component.onAbout).toHaveBeenCalled();
	});
});
