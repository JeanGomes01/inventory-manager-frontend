import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './modules/home/home';
import { Layout } from './modules/layout/layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Layout, Home],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Inventory Manager');

  constructor() {}
}
