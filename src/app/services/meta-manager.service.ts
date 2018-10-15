import { Injectable } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaManagerService {

  constructor(private meta: Meta) {
  }

  public getMeta() {
  }
}
