import {IBaseKind} from "./base.interfaces";

export interface IConfigMap extends IBaseKind {
    data: [{ [key: string]: string }]
}