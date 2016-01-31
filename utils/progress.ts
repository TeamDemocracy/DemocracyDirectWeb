export class Progress {

	static RENDER_FREQ: number = 1000; // Milliseconds

	target: number = 0;
	begin: number = 0;
	lastRender: number = 0;

	constructor(target: number = 0) {
		this.reset(target);
	}

	reset(target: number): void {
		this.begin = (new Date()).getTime();
		this.target = target;
		this.lastRender = 0;
	}

	tick(i: number): void {
		var now: number = (new Date()).getTime();

		if (now - this.lastRender >= Progress.RENDER_FREQ) {
			this.render(i, now);
			this.lastRender = now;
		}
	}

	done(i): void {
		var now = (new Date()).getTime();
		this.render(i, now);
	}

	private render(i: number, now: number) {
		var progress = Math.floor(10000 * i / this.target) / 100;
		var elapsed = now - this.begin;

		console.log(this.ljust(i + ' / ' + this.target, 16) + this.ljust(progress + '%') + this.ljust(this.millisecondsToString(elapsed)));
	}

	private ljust(s: any, width: number = 10) {
		var str: string = s.toString();
		while (str.length < width) {
			str += ' ';
		}
		return str;
	}

	private millisecondsToString(milliseconds: number): string {
		var hours = Math.floor(milliseconds / 1000 / 60 / 60);
		var minutes = Math.floor(milliseconds / 1000 / 60) - hours * 60;
		var seconds = Math.floor(milliseconds / 1000) - (hours * 60 + minutes) * 60;
		return hours + 'h ' + minutes + 'm ' + seconds + 's';
	}
}