
//Here is where we re-export every country class
//This is done to simplify importing all the country classes throughout the entire project
import {ICountry} from './country';
import {sweden} from './sweden';

export var Countries: ICountry[] = [
    sweden
];
