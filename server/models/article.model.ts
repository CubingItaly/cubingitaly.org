import { autoserialize } from "cerialize";
import { CIUser } from "./ci.user.model";
import { ArticleCategory } from "./article.category.model";

export class Article {

    @autoserialize id: string;

    @autoserialize title: string;

    @autoserialize content: string;

    @autoserialize summary: string;

    @autoserialize author: CIUser;

    @autoserialize creationDate: Date;

    @autoserialize updateDate: Date;

    @autoserialize isPublic: boolean;

    @autoserialize categories: ArticleCategory[];
}