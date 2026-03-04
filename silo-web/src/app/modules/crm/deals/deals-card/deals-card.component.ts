import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-deals-card',
  templateUrl: './deals-card.component.html',
  styleUrl: './deals-card.component.scss'
})
export class DealsCardComponent implements OnInit {
  constructor(
    @Inject('KANBAN_CARD_DATA') public data: any,
    @Inject('KANBAN_CARD_THEME') public theme: string
  ) {}

  ngOnInit(): void {
    console.log(this.data)
  }
}
