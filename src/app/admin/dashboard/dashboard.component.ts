import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  page = 1;
  pageSize :number=50; 
  ProviderList:any;
 
  constructor(private adminservice:AdminService) { }

  ngOnInit(): void {   
    this.GetProivderList();    
  }

  GetProivderList(){       
    this.adminservice.GetProviders().subscribe(resp => {
      if(resp.IsSuccess){
        this.ProviderList = resp.ListResult;
     
        this.ProviderList.map((e) => { 
          if(e.Trial == 'Trial'){            
            e.ToggleButton=false;             
           }         
          else{
             e.ToggleButton=true; 
           }
          if(e.PrimaryPhone != null)
          {           
            var phoneno = e.PrimaryPhone          
            phoneno = phoneno.slice(0, 0) + phoneno.slice(1);
            phoneno = phoneno.slice(1, 1) + phoneno.slice(1);             
            phoneno = Array.from(phoneno)
            phoneno.splice(0, 0, '(')
            phoneno.splice(4, 0, ')')
            phoneno.splice(5, 0, ' ')
            phoneno.splice(9, 0, '-')
            e.NewPhoneNo = phoneno.join('');
          }
          else{
            e.NewPhoneNo=null;
          }        
        });
      }
      else{
            this.ProviderList=[];
      }
    });
  } 
}