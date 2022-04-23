import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-imported-data',
  templateUrl: './list-imported-data.component.html',
  styleUrls: ['./list-imported-data.component.scss']
})
export class ListImportedDataComponent implements OnInit {
  page: number = 1;
  constructor() { }

  ngOnInit(): void {
  }

}
