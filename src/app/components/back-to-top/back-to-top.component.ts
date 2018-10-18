import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.css']
})
export class BackToTopComponent implements OnInit {

  visible: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  scrollToTop() {
    const top = document.querySelector('#top') as HTMLElement;
    top.scrollIntoView({ behavior: 'smooth' });
  }


  @HostListener('window:scroll', [])
  @debounce()
  onWindowScroll() {
    if (window.scrollY > 200) {
      this.visible = true
    } else{
      this.visible = false;
    }
  }
}

export function debounce(): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let timeout = null

    const original = descriptor.value;

    descriptor.value = function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => original.apply(this, args), 300);
    };

    return descriptor;
  };
}