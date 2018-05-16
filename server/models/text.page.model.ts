import { autoserialize } from 'cerialize';


export class TextPage {

  @autoserialize public id: number;

  @autoserialize public title: string;

  @autoserialize public content: string;

}