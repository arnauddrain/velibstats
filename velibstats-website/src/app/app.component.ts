import { Component } from '@angular/core';

import { VelibService } from './velib.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public email: string;
  public password: string;
  public loading: boolean;
  public error: boolean;
  public data: any;

  constructor(private velibService: VelibService) {
    this.error = false;
    this.loading = false;
    const velibData = localStorage.getItem('velibData');
    if (velibData) {
      this.reloadGraph(JSON.parse(velibData));
    }
  }

  public login(): void {
    this.loading = true;
    this.velibService.retrieveData(this.email, this.password)
      .subscribe(velibData => {
        localStorage.setItem('velibData', JSON.stringify(velibData));
        this.reloadGraph(velibData);
        this.loading = false;
      }, err => {
        this.error = true;
        this.loading = false;
      });
  }

  public logout(): void {
    this.data = null;
    localStorage.removeItem('velibData');
  }

  private generateSerie(data: any[], filter): any[] {
    let sum = 0;
    return data.map(i => {
      if (!filter || i.parameter1 === filter) {
        sum += parseFloat(i.parameter3.DISTANCE) / 1000;
      }
      return {
        name: new Date(i.operationDate),
        value: sum
      };
    });
  }

  private reloadGraph(velibData): void {
    const reversedList = velibData.items.reverse();
    this.data = [
      {
        name: 'total',
        series: this.generateSerie(reversedList, null)
      },
      {
        name: 'électrique',
        series: this.generateSerie(reversedList, 'yes')
      },
      {
        name: 'mécanique',
        series: this.generateSerie(reversedList, 'no')
      }
    ];
  }
}
