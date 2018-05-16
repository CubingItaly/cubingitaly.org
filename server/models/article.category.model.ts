import { autoserialize } from "cerialize";


export class ArticleCategory{

    @autoserialize id: number;

    @autoserialize name: string;

    @autoserialize color: string;
}