import {Bill, Bills} from 'collections/bills';
import {Progress} from 'utils/progress';

Bill.remove({});

export class BillSynchronizer {
	private static BASE_URL: string = 'http://data.riksdagen.se/dokumentlista/';
	private static HITS_PER_PAGE: number = 200;
	private static COUNT_KEY: string = '@traffar'; // How to get the number of hits
	private static DOCUMENT_KEY: string = 'dokument'; // How to get the document(s)
	private static DOCUMENT_DATE_KEY: string = 'datum'; // How to get the date of a document
	private static DOCUMENT_ID_KEY: string = 'id'; // How to get the id of a document

	private _nextIndex: number = 0;
	private _progress: Progress = new Progress();

	index(): void {

		var dbBillCount: number = this.getBillCount();

		this._progress.reset(dbBillCount);

		var yearBegin: number = this.getYearBegin();
		var yearEnd: number = this.getYearEnd();

		console.log("Indexing of", dbBillCount, "bills between", yearBegin, "and", yearEnd, "will now begin...");

		for (var year: number = yearBegin; year <= yearEnd; year++) {

			this.indexYear(year);

		}

		console.assert(dbBillCount === this._nextIndex);

		console.log("Indexing of bills completed successfully :)");

	}

	synchronize(): void {

	}

	private indexYear(year: number): void {
		var billCount: number = this.getBillCount(year);
		var numberOfPages: number = Math.ceil(billCount / BillSynchronizer.HITS_PER_PAGE);

		for (var page: number = 1; page <= numberOfPages; page++) {

			var data: any = this.queryBills(page, BillSynchronizer.HITS_PER_PAGE, year, 'asc');
			var documents: any[] = data[BillSynchronizer.DOCUMENT_KEY];
			this.indexDocuments(documents);
			this._progress.tick(this._nextIndex);

		}
	}

	private indexDocuments(documents: any[]): void {

		for (var doc of documents) {

			var bill = new Bill({
				_id: <string>doc[BillSynchronizer.DOCUMENT_ID_KEY],
				index: this._nextIndex++,
				// TODO: insert billDate
			});
			bill.save();

		}
	}

	private queryBills(page: number, hitsPerPage: number, year?: number, order: string = "asc") {
		console.assert(hitsPerPage <= 200);

		var params = {
			"p": page,
			"avd": "dokument",
			"doktyp": "bet",
			"a": "s",
			"sortorder": order,
			"sort": "datum",
			"utformat": "json",
			"sz": hitsPerPage,
			"from": year ? year + "-01-01" : "",
			"tom": year ? year + "-12-31" : "",
		};

		var result: any = HTTP.get(BillSynchronizer.BASE_URL, {
			params: params
		});

		// Exapmle data: http://data.riksdagen.se/dokumentlista/?avd=dokument&doktyp=bet&a=s&sortorder=desc&sort=datum&utformat=json&sz=50&p=20
		return result.data.dokumentlista;
	}

	private getBillCount(year?: number): number {
		var data: any = this.queryBills(0, 0, year);
		var count = parseInt(data[BillSynchronizer.COUNT_KEY]);
		return count;
	}

	private getYearLimit(order: string): number {
		var data: any = this.queryBills(1, 1, undefined, order);
		var document: any = data[BillSynchronizer.DOCUMENT_KEY];
		var date: string = document[BillSynchronizer.DOCUMENT_DATE_KEY];
		var year = (new Date(date)).getFullYear();
		return year;
	}

	private getYearBegin(): number {
		return this.getYearLimit("asc");
	}

	private getYearEnd(): number {
		return this.getYearLimit("desc");
	}
}
