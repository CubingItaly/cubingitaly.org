import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaManagerService {

  constructor(private meta: Meta) {
  }

  public addMeta(name: string, content: string) {
    this.meta.addTag({ name: name, content: content });
  }

  public updateMeta(name: string, content: string) {
    if (name === "title") {
      content += " | Cubing Italy";
    }
    this.meta.updateTag({ name: name, content: content });
  }

  public removeMeta(name: string) {
    this.meta.removeTag(`name="${name}"`);
  }

  public resetMeta() {
    this.meta.updateTag({ name: "title", content: "Cubing Italy" });
    this.meta.updateTag({ name: "description", content: "Cubing Italy si propone come punto di riferimento dello speedcubing italiano per l'organizzazione di competizioni ufficiali WCA." });
  }
}
