import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


/**
 * Pipe used to tell angular that the HTML content that is going to be visualized can be trusted
 * 
 * @export
 * @class SafeHtmlPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(style) {
    //We take for granted that HTML is trusted
    return this.sanitizer.bypassSecurityTrustHtml(style);
  }

}
