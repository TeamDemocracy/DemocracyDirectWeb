
export class Country implements ICountry {
    name: string;
    synchronizeOurDataWithSource() {

    }
}
export interface ICountry {
    name: string;
    synchronizeOurDataWithSource(): void;
}
