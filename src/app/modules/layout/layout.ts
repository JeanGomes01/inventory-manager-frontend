import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../../components/navbar/navbar';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Home } from '../home/home';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, RouterOutlet, Home, Navbar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
