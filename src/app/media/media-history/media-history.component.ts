import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'fs-media-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-history.component.html',
  styleUrls: ['./media-history.component.css']
})
export class MediaHistoryComponent implements OnInit {

  histories: any[] = [];

  constructor(
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.http
      .get<{ histories: any[] }>('mediaHistories/')
      .subscribe({
        next: (response) => {
          this.histories = response.histories;
          this.expandedHistories = new Array(this.histories.length).fill(false);

        },
        error: (error) => {
          console.error('Error retrieving media history:', error);
        }
      });
  }

  expandedHistories: boolean[] = [];

  toggleHistory(index: number): void {
  this.expandedHistories[index] = !this.expandedHistories[index];
}

getVisibleChanges(cambios: any[]): any[] {
  return cambios.filter(cambio =>
    cambio.campo !== '_id' &&
    cambio.campo !== '__v'
  );
}

}
