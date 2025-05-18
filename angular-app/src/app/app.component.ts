import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { MainComponent } from "./components/main/main.component";
import { FooterComponent } from "./components/footer/footer.component";
import { MessagingService } from './services/messaging.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, MainComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'front-mobi-p1';


private messagingService = inject(MessagingService);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.messagingService.requestPermission();
      this.messagingService.listen();
    }
  }
}