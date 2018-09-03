import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  /** Inputs to show only required tags in header */
  @Input() showHalalTag = false;
  @Input() showLanguage = false;

  ngOnInit() {
  }

  goToPage(pageName) {
    console.log(pageName);
    switch (pageName) {
      case 'home':
        this.router.navigateByUrl('/home');
        break;
      case 'login':
        this.router.navigateByUrl('/login');
        break;
      default:
        console.log('default');
        this.router.navigateByUrl('/home');
        break;
    }
  }

}
