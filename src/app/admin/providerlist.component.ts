import { Component } from '@angular/core';
import{ProviderData}from '../_models/Admin.ts/Providedata';




@Component({
  selector: 'app-providerlist',
  templateUrl: './providerlist.component.html',
  styleUrls: ['./providerlist.component.scss']
})
export class ProviderlistComponent {
  pageSize = 5;
  data:any[]=[];
  provide:ProviderData=new ProviderData();
  page = 0;
  constructor(){
    for(var i=0;i<10;i++){
      
      this.data.push(this.provide);     
    }
    // console.log(JSON.stringify(this.arra));
  }
}

//   public data = [{
  
//   "Name": "Test Test",
//   "Email": "85695@gmail.com",
//   "Phone": "656569849",
//   "Address": "Nagpur",
//   "Status": "Active"
// }, {
 
//   "Name": "Even",
//   "Email": "87958@gmail.com",
//   "Phone": "4785989445",
//   "Address": "Hyderabd",
//   "Status": "Active"
// }, {

//   "Name": "Ernaline",
//   "Email": "eregi2@mapy.cz",
//   "Phone": "968584967",
//   "Address": "Hyderabd",
//   "Status": "Active"
// }, {
  
//   "Name": "Wiley",
//   "Email": "wfolonin3@bravesites.com",
//   "Phone": "785964345",
//   "Address": "Nagpur",
//   "Status": "Inactive"
// }, {
  
//   "Name": "Eulalie",
//   "Email": "ebardell4@tuttocitta.it",
//   "Phone": "789658944",
//   "Address": "Hyderabd",
//   "Status": "Active"
// }, {
 
//   "Name": "Nikolia",
//   "Email": "juhyg@gmail.com",
//   "Phone": "859634794",
//   "Address": "Nagpur",
//   "Status": "Active"
// }, {

//   "Name": "Adrea",
//   "Email": "azumfelde6@google.com",
//   "Phone": "857486954",
//   "Address": "Hyderabd",
//   "Status": "Active"
// }, {
 
//   "Name": "Wilbert",
//   "Email": "wdavidy7@cpanel.net",
//   "Phone": "987859445",
//   "Address": "Nagpur",
//   "Status": "Active"
// }, {
 
//   "Name": "Tymothy",
//   "Email": "twolland8@sina.com",
//   "Phone": "789635288",
//   "Address": "Hyderabd",
//   "Status": "Active"
// }, {
 
//   "Name": "Kermit",
//   "Email": "kkort9@seesaa.net",
//   "Phone": "7896352458",
//   "Address": "Hyderabd",
//   "Status": "Active"
// },{
  
//   "Name": "Test Test",
//   "Email": "85695@gmail.com",
//   "Phone": "656569849",
//   "Address": "Nagpur",
//   "Status": "Active"
// }, {
 
//   "Name": "Even",
//   "Email": "87958@gmail.com",
//   "Phone": "4785989445",
//   "Address": "Hyderabd",
//   "Status": "Active"
// }, {

//   "Name": "Ernaline",
//   "Email": "eregi2@mapy.cz",
//   "Phone": "968584967",
//   "Address": "Hyderabd",
//   "Status": "Active"
// }, {
  
//   "Name": "Wiley",
//   "Email": "wfolonin3@bravesites.com",
//   "Phone": "785964345",
//   "Address": "Nagpur",
//   "Status": "Inactive"
// }, {
  
//   "Name": "Eulalie",
//   "Email": "ebardell4@tuttocitta.it",
//   "Phone": "789658944",
//   "Address": "Hyderabd",
//   "Status": "Active"
// }, {
 
//   "Name": "Nikolia",
//   "Email": "juhyg@gmail.com",
//   "Phone": "859634794",
//   "Address": "Nagpur",
//   "Status": "Active"
// }, {

//   "Name": "Adrea",
//   "Email": "azumfelde6@google.com",
//   "Phone": "857486954",
//   "Address": "Hyderabd",
//   "Status": "Active"
// }, {
 
//   "Name": "Wilbert",
//   "Email": "wdavidy7@cpanel.net",
//   "Phone": "987859445",
//   "Address": "Nagpur",
//   "Status": "Active"
// }, {
 
//   "Name": "Tymothy",
//   "Email": "twolland8@sina.com",
//   "Phone": "789635288",
//   "Address": "Hyderabd",
//   "Status": "Active"
// }, {
 
//   "Name": "Kermit",
//   "Email": "kkort9@seesaa.net",
//   "Phone": "7896352458",
//   "Address": "Hyderabd",
//   "Status": "Active"
// }, ];
