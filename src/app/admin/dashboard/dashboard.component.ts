import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  page = 1;
  pageSize =7;  
  userList:any=[];
  UserDummyList:any;
  constructor() {
  
   }

  ngOnInit(): void {
    this.getuserList();
    
  }

  getuserList()
  {   
    debugger;
    this.UserDummyList=
      [
      { Name: 'Marcela Arizmendi ,DDS1', Email: 'smilelifedental@gmail.com', Type: 'Verified',Phone:'(714) 345-643',TrailOrPaid:'Trial'},
      { Name: 'Marcela Arizmendi ,DDS2', Email: 'newlifedental@gmail.com', Type: 'Verified',Phone:'(714) 345-643',TrailOrPaid:'Trial'},
      { Name: 'Marcela Arizmendi ,DDS3', Email: 'smilelifedental@gmail.com', Type: 'Verified',Phone:'(714) 345-643',TrailOrPaid:'Trial'},
      { Name: 'Marcela Arizmendi ,DDS4', Email: 'smilelifedental@gmail.com', Type: 'Verified',Phone:'(714) 345-643',TrailOrPaid:'Paid'},
      { Name: 'Marcela Arizmendi ,DDS5', Email: 'smilelifedental@gmail.com', Type: 'Verified',Phone:'(714) 345-643',TrailOrPaid:'Trial'},
      { Name: 'Marcela Arizmendi ,DDS6', Email: 'newlifedental@gmail.com', Type: 'Verified',Phone:'(714) 345-643',TrailOrPaid:'Trial'},
      { Name: 'Marcela Arizmendi ,DDS7', Email: 'smilelifedental@gmail.com', Type: 'Verified',Phone:'(714) 345-643',TrailOrPaid:'Trial'},
      { Name: 'Marcela Arizmendi ,DDS8', Email: 'smilelifedental@gmail.com', Type: 'Verified',Phone:'(714) 345-643',TrailOrPaid:'Paid'},
      { Name: 'Marcela Arizmendi ,DDS9', Email: 'smilelifedental@gmail.com', Type: 'Verified',Phone:'(714) 345-643',TrailOrPaid:'Trial'},
      { Name: 'Marcela Arizmendi ,DDS10',Email: 'newlifedental@gmail.com', Type: 'Verified',Phone:'(714) 345-643',TrailOrPaid:'Trial'},
      { Name: 'Marcela Arizmendi ,DDS11',Email: 'smilelifedental@gmail.com', Type: 'Verified',Phone:'(714) 345-643',TrailOrPaid:'Trial'},
      { Name: 'Marcela Arizmendi ,DDS12',Email: 'smilelifedental@gmail.com', Type: 'Verified',Phone:'(714) 345-643',TrailOrPaid:'Trial'},
      
      ]
     
  }  

}
