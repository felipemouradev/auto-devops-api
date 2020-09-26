import {IBaseKind} from "./base.interfaces";
import {KeyValue} from "../models/base.model";

export interface IConfigMap extends IBaseKind {
    data: { [key: string]: string }
}