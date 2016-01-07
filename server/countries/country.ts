
export class Country implements CountryInterface{
    name:string;
    synchronizeOurDataWithSource(){

    }
}
export interface CountryInterface {
    name:string;
    synchronizeOurDataWithSource():void;
}
