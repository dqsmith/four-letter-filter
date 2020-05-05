import { TestBed, inject } from '@angular/core/testing';

import { StorageService } from './storage.service';

import { IFilter } from '../interfaces/filter.interface';

describe('StorageService', () => {
	let filter: IFilter;
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [StorageService],
		});

		filter = {
			on: true,
			reload: true,
			counts: {
				bad: 0,
				custom: 0,
			},
			dates: {
				lastOn: '4/4/2020, 8:42:00 PM',
				lastFiltered: '4/4/2020, 10:42:00 PM',
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
				bad: 'YWhvbGUsYXNoMGxlLGFzaDBsZXMsY=',
				offensive: 'Yml0Y2gsYml0Y2hlcyxhbnVzLGJhc3Rhc=',
				custom: '',
			},
		};
	});

	afterEach(() => {
		localStorage.removeItem('four-letter-filter');
	});

	it('should be created', inject(
		[StorageService],
		(service: StorageService) => {
			expect(service).toBeTruthy();
		}
	));

	it('should set a filter', inject(
		[StorageService],
		(service: StorageService) => {
			const updatedFilter = Object.assign(filter, { on: false });

			service.setFilter(updatedFilter);

			const storedFilter = localStorage.getItem('four-letter-filter');
			expect(JSON.parse(storedFilter)).toEqual(updatedFilter);
		}
	));

	it('should get a filter', inject(
		[StorageService],
		(service: StorageService) => {
			const value = service.getFilter();
			expect(value).toBeDefined();
		}
	));

	it('should return a default filter if none has been stored', inject(
		[StorageService],
		(service: StorageService) => {
			localStorage.removeItem('four-letter-filter');

			const value = service.getFilter();
			expect(value).toBeDefined();
		}
	));

	it('should return a stored filter if it exists', inject(
		[StorageService],
		(service: StorageService) => {
			const storedFilter = Object.assign(filter, { on: false });

			service.setFilter(filter);

			let value = service.getFilter();
			expect(value).toEqual(filter);

			localStorage.setItem(
				'four-letter-filter',
				JSON.stringify(storedFilter)
			);

			value = service.getFilter();
			expect(value).toEqual(storedFilter);
		}
	));
});
