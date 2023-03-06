import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Accountservice } from '../../_services/account.service';
import { AuthenticationService } from '../../_services/authentication.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { PracticeProviders } from '../../_models/_provider/practiceProviders';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
declare const $: any;

@Component({
  selector: 'app-mureports',
  templateUrl: './mureports.component.html',
  styleUrls: ['./mureports.component.scss']
})
export class MureportsComponent implements OnInit {

  PracticeProviders: PracticeProviders[];
  checkboxValue021: boolean = false;
  checkboxValue01: boolean = false;
  checkboxValue022: boolean = false;
  checkboxValue031: boolean = false;
  checkboxValue032: boolean = false;
  checkboxValue033: boolean = false;
  checkboxValue04: boolean = false;
  checkboxValue05: boolean = false;
  checkboxValue06: boolean = false;
  checkboxValue07: boolean = false;
  checkboxValue081: boolean = false;
  checkboxValue082: boolean = false;
  checkboxValue09: boolean = false;
  checkboxValue0101: boolean = false;
  checkboxValue0102: boolean = false;
  checkboxValue0103: boolean = false;
  checkboxValuery1: boolean = false;
  checkboxValuern1: boolean = false;
  checkboxValuery21: boolean = false;
  checkboxValuern21: boolean = false;
  checkboxValuery22: boolean = false;
  checkboxValuern22: boolean = false;
  checkboxValuery101: boolean = false;
  checkboxValuern101: boolean = false;
  checkboxValuery102: boolean = false;
  checkboxValuern102: boolean = false;
  checkboxValuery103: boolean = false;
  checkboxValuern103: boolean = false;
  sortDir = 1;
  tomorrow = new Date();
  // beforestartdate = Date('06/06/2020');
  provider_Id: string;
  stage_type: string;
  muReportForm: FormGroup;
  customizedspinner: boolean = false;
  Stage3: boolean = false;
  patientlist: boolean = false;
  showPromblemListTable: boolean;
  stage3NumeDenomicount: any;
  numerator2: any;
  denominator2: any;
  percentage2: any;
  numerator41: any;
  denominator41: any;
  percentage41: any;
  numerator42: any;
  denominator42: any;
  percentage42: any;
  numerator43: any;
  denominator43: any;
  percentage43: any;
  numerator51: any;
  denominator51: any;
  percentage51: any;
  numerator52: any;
  denominator52: any;
  percentage52: any;
  numerator61: any;
  denominator61: any;
  percentage61: any;
  numerator62: any;
  denominator62: any;
  percentage62: any;
  numerator63: any;
  denominator63: any;
  percentage63: any;
  numerator71: any;
  denominator71: any;
  percentage71: any;
  numerator72: any;
  denominator72: any;
  percentage72: any;
  numerator73: any;
  denominator73: any;
  percentage73: any;
  providers: any;
  Stage2: boolean;
  stage2NumeDenomicount: any;
  numerator3_1: any;
  denominator3_1: any;
  percentage3_1: any;
  numerator3_2: any;
  denominator3_2: any;
  percentage3_2: any;
  numerator3_3: any;
  denominator3_3: any;
  percentage3_3: any;
  numerator4: any;
  denominator4: any;
  percentage4: any;
  numerator5: any;
  denominator5: any;
  percentage5: any;
  numerator6: any;
  denominator6: any;
  percentage6: any;
  numerator7: any;
  denominator7: any;
  percentage7: any;
  numerator8_1: any;
  denominator8_1: any;
  percentage8_1: any;
  numerator8_2: any;
  denominator8_2: any;
  percentage8_2: any;
  numerator9: any;
  denominator9: any;
  percentage9: any;
  Stage2PatientList: any;
  providerlist: any = [];
  locationslist: any;
  filteredproviderList: any = [];
  filteredlocationList: any = [];
  checkbox2: boolean;
  patientelectronicacess2: number;
  checkbox41: boolean;
  patientelectronicacess41: number;
  checkbox42: boolean;
  patientelectronicacess42: number;
  checkbox43: boolean;
  patientelectronicacess43: number;
  checkbox51: boolean;
  patientelectronicacess51: number;
  checkbox52: boolean;
  patientelectronicacess52: number;
  checkbox61: boolean;
  patientelectronicacess61: number;
  checkbox62: boolean;
  patientelectronicacess62: number;
  checkbox63: boolean;
  patientelectronicacess63: number;
  checkbox71: boolean;
  patientelectronicacess71: number;
  checkbox72: boolean;
  patientelectronicacess72: number;
  checkbox73: boolean;
  patientelectronicacess73: number;
  result2: any;
  result4: any;
  result5: any;
  result6: any;
  result7: any;
  checkbox31: any;
  checkbox32: any;
  checkbox81: any;
  checkbox82: any;
  checkbox83: any;
  checkbox84: any;
  checkbox85: any;
  patientelectronicacess32: number;
  patientelectronicacess31: number;
  patientelectronicacess81: number;
  patientelectronicacess82: number;
  patientelectronicacess83: number;
  patientelectronicacess84: number;
  patientelectronicacess85: number;
  result3: any;
  result8: any;
  pdfcheckbox2: string;
  pdfcheckbox41: string;
  pdfcheckbox42: string;
  pdfcheckbox43: string;
  pdfcheckbox51: string;
  pdfcheckbox52: string;
  pdfcheckbox61: string;
  pdfcheckbox62: string;
  pdfcheckbox63: string;
  pdfcheckbox71: string;
  pdfcheckbox72: string;
  pdfcheckbox73: string;
  pdfcheckbox31: string;
  pdfcheckbox32: string;
  pdfcheckbox81: string;
  pdfcheckbox82: string;
  pdfcheckbox83: string;
  pdfcheckbox84: string;
  pdfcheckbox85: string;
  checkbox02: any;
  pdfcheckbox02: string;
  checkbox01: any;
  checkbox021: any;
  checkbox022: any;
  checkbox031: any;
  checkbox032: any;
  checkbox033: any;
  checkbox04: any;
  checkbox05: any;
  checkbox06: any;
  checkbox07: any;
  checkbox081: any;
  checkbox082: any;
  checkbox09: any;
  checkbox0101: any;
  checkbox0102: any;
  checkbox0103: any;
  pdfcheckbox01: string;
  pdfcheckbox021: string;
  pdfcheckbox022: string;
  pdfcheckbox031: string;
  pdfcheckbox032: string;
  pdfcheckbox033: string;
  pdfcheckbox04: string;
  pdfcheckbox05: string;
  pdfcheckbox06: string;
  pdfcheckbox07: string;
  pdfcheckbox081: string;
  pdfcheckbox082: string;
  pdfcheckbox09: string;
  pdfcheckbox0101: string;
  pdfcheckbox0102: string;
  pdfcheckbox0103: string;
  patientlistlength: number;
  radioy1: any;
  pdfradioy1: string;
  radion1: any;
  pdfradion1: string;
  radion21: any;
  pdfradion21: string;
  radioy21: any;
  pdfradioy11: string;
  pdfradioy21: string;
  radioy22: any;
  pdfradioy22: string;
  radion22: any;
  pdfradion22: string;
  radioy101: any;
  pdfradioy101: string;
  radion101: any;
  pdfradion101: string;
  radioy102: any;
  pdfradioy102: string;
  radion102: any;
  pdfradion102: string;
  radioy103: any;
  pdfradioy103: string;
  radion103: any;
  pdfradion103: string;
  checkbox1: any;
  pdfcheckbox1: string;
  checkbox31c: any;
  pdfcheckbox31c: string;
  checkbox32c: any;
  pdfcheckbox32c: string;
  checkbox81c: any;
  pdfcheckbox81c: string;
  checkbox82c: any;
  pdfcheckbox82c: string;
  checkbox83c: any;
  pdfcheckbox83c: string;
  checkbox84c: any;
  pdfcheckbox84c: string;
  checkbox85c: any;
  pdfcheckbox85c: string;
  patientelectronicacess1: number;
  result1: number;
  Stage2PatientListlength: any;
  ReportingDate: string;
  Dates: string;
  disabledowloadPDF: boolean = true;
  mupatientList: any[];
  mupatientListlength: number;
  showControls: boolean;
  LocationZip: any;
  ProviderName: any;
  locationname: any;
  locationstreetaddress: any;
  locationcity: string;
  locationstate: string;
  locationzip: string;
  locationphone: any;
  LocationName: any;
  LocationPhone: any;
  LocationStreetAddress: any;
  LocationCity: any;
  LocationState: any;
  disableEndDateInput: boolean = true;
  checkboxvalue1: boolean = false;
  checkboxvalue2: boolean = false;
  checkboxvalue31: boolean = false;
  checkboxvalue32: boolean = false;
  checkboxvalue41: boolean = false;
  checkboxvalue42: boolean = false;
  checkboxvalue43: boolean = false;
  checkboxvalue51: boolean = false;
  checkboxvalue52: boolean = false;
  checkboxvalue61: boolean = false;
  checkboxvalue62: boolean = false;
  checkboxvalue63: boolean = false;
  checkboxvalue71: boolean = false;
  checkboxvalue72: boolean = false;
  checkboxvalue31c: boolean = false;
  checkboxvalue32c: boolean = false;
  checkboxvalue81c: boolean = false;
  checkboxvalue82c: boolean = false;
  checkboxvalue83c: boolean = false;
  checkboxvalue84c: boolean = false;
  checkboxvalue85c: boolean = false;
  checkboxvalue73: boolean = false;
  checkboxvalue81: boolean = false;
  checkboxvalue82: boolean = false;
  checkboxvalue83: boolean = false;
  checkboxvalue84: boolean = false;
  checkboxvalue85: boolean = false;
  protectvalue = null;
  clinicalvalue = null;
  drugvalue = null;
  immunizationvalue = null;
  syndromicvalue = null;
  specializedvalue = null;


  endDateCalculation(Days) {
    let startDate = this.muReportForm.value.strSDate;
    var d = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + Days,
      startDate.getDate() - 1
    );
    this.muReportForm.controls["strEDate"].setValue(d);
  }

  public downloadAsPDF() {
    if (this.stage3NumeDenomicount != null) {
      const documenDefinition = {
        content:
          [
            {
              text: 'Promoting Interoperability (PI/MU) - Stage 3',
              style: "tableHeader",
              alignment: "center"
            },
            {
              text: this.ProviderName, alignment: 'left'
            },
            {
              text: this.LocationName, alignment: 'left'
            },
            {
              text: this.LocationStreetAddress, alignment: 'left'
            },
            {
              text: this.LocationCity + ' ' + this.LocationState + ' ' + this.LocationZip, alignment: 'left'
            },
            {
              text: this.LocationPhone, alignment: 'left'
            },
            {
              image: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMPDRAQDxAQEBARDxAQFQ8PDw8QEBAQFhUWFhgSFRYYHCggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGy0lIB0tLS0tLS0tKy0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tKystLS0tLS0tLTctLf/AABEIAKMBNgMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYBBAcDAv/EAEMQAAIBAgEHCAUKBQQDAAAAAAABAgMRBAUGEhYhU9EVMVFSYZGSk0FxobHBExQiM2JzgaKy0jI0Y7PhI0Jy8DVDg//EABsBAQACAwEBAAAAAAAAAAAAAAADBQEEBgIH/8QALxEBAAEDAgQFBAMAAgMAAAAAAAECAxEEEgUUFVETITFSYRYiQXEygZEzsSM0Qv/aAAwDAQACEQMRAD8A7iAAAAAAAAAAAAAAAAAfMmYmYiMyYyqeXs4r3pUHs5pVV7o8TnOI8U9bdr/VzouH5xXc/wAVm/ac9NUyuopg0mYzLO2DSYzJtguMybYLsZk2waTGZNsGk1tu+89U11RPlLFVFMx5w6Vk5t0aTk7ydODb6XZHfaeZm3TM9nH3Mb5w2iZ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADzrVlCLlJqMUrtvYkeK66aIzVOIZimapxClZcy9Ks3Tp3jS5m+aU/X0LsOW4hxSbs7Lfp/wBr/R8PijFdfqgykmVrEYDDIAAAAABo9URmqIea5xTLqGGjaEV0RS9h9CtRiiIcbVOapepI8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAADXxuMhRg51GlFd7fQl6WQ3r9FqndVL3bt1XKttMKLlnLE8TK38NNPZC/tl0s5HXcQr1E4jypdHo9FTZjM+qMKyW/AYZAAAAAAAemHjepBdM4rvaJtPTm5T+4Q35xbmfh0+J9Ap9Ice+j0AAAAAAAAAAAAAAAAAAAAAAAAAAAAMMwNHKmU4YeGlN7X/DBfxSf/AH0mrqtVRYpzUnsaeu9VthRMpZQniJ6VR+qK/hiuzicfq9Zc1FWav8dLptNRZp8v9app+bZ8gAMDBhkAAAAADbyTDSxNFf1Yexpm5oad1+mPlq6ycWav06Sju4cmyZAAAAAAAAAAAAAAAAAAAAAAAAAAAAGGBp18m0qktKpSjKXTJXdjWu6W1cnNcRKSi/cojFMzDz5Fw+4p+Ej6fpvZH+JObve6TkXD7in4R07TeyDnL/uk5Fw+4p+Ex0/TeyDm73ulBZ2YKlSpU/k6cIOVS14qztZ/4Kni+ms2rcTRTEeax4beuXLkxVMz5Kwc2vAMgAAAAks3IXxtHslJ90WWXC6c6mlocQqxYn5dCO1cwyZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYYYlVc95/Ux/5v3I53jtXlTC54TT91UqqcyvgAAAAZAmc0o3xkeyE37l8S44NTnUZVfFJ/8AD/a9nYOdAAAAAAAAAAAAAAAAAAAAAAAAABhgVvKmdaw9edF0nJwaWkpJXvFS6O0kijMK+9rot1zTj0auu8dxLxrgZ8NF1Onsa7x3EvGuA8M6nT2Nd47iXjXAeGdTp7Gu8dxLxrgPDOp09jXeO4l41wMeGdTp7Gu8dxLxrgPDOp09kPlzLixUoNQcNGLVnJO93/gquIcMnUzGJxhv6Pj1FiJ+31RfzjsZW/T1Xubv1RR7D5x2D6eq9zP1TR7D5x2D6eq9x9U0ew+cdg+nqvcfVNHsPnHYPp6r3H1TR7D5x2MfT1XuPqmn2pHImWVhqrqODneDikpJWu07+wsNBwmdNXNUy09Xx+m/TEbU3rvHcS8a4Fx4au6nT2Nd47iXjXAeGdTp7Gu8dxLxrgPDOp09jXeO4l41wHhnU6exrvHcS8a4DwzqdPZJ5BzgWLnOCpuGjHSu5J322seKqcNnTauL0zEfhOHluAAAAAAAAAAAAAAAAAAAwwOaZ1/z9f1w/twJ6fRzmu/56kXTg5NRinKT5oxTbfqSMtammapxCVo5tYmav8lo/wDOcI+y9zG6G1TobtXnEf69tUsT1afmIxvh76fd+DVLE9Wn5iG+Dp934/01SxPVp+Yhvg6fd+P9NUsT1afmIb4Y6fd+DVPE9Wn5iG+Gen3fhH5TyXUwziqqinNNrRlpbFa/vPUVZ9Gve09VrG78tIygAAExhs2sRUpxqRjDRnFSV5pOz2o874btGhu1RmEdjcJKjUdOpZSja9ndbVf4mYnLWuW6rdW2fVI4fNnEVIRnGMdGcVJXmlsaujG+GzTobtUZjD01TxXUh5kTG+HrkLvwap4rqQ8yI3wchd+DVPFdSHmRG+DkLvw+Z5rYpf8ArT9VSHxY3w8zoL0fhGYrCVKUtGrCUH9pc/qfMz1nLWuWq6P5RhYcwPr6v3S/UjxcWHDP51fpeiJdAAAAAAAAAAAAAAAAAAAwwOaZ1/8AkK/rh/bgT0+jndd/zytGZ2TI08PGq0vlKq0rvnUPQl+G38SOuVlobEUW90+st3KeXqOGlo1G3O19GEbtLt9CMRTMp72qt2pxU0tcsP1avhjxM+HKDqNo1xw/Vq+CPEeHJ1G0a44fq1fBHiPDk6jaY1yw/Vq+GPEeHJ1G0msm42OIpRqwTUZXtpJJ7Hb0eo8zGPJt2rkXKd0Kfn7O+Ipx6KV++T/aSW/RU8Tn74hWCRWABhmHV8mU9HD0Y9WlTXdFGvLqLUYoj9OdZy1NLG139u3ckvgTU+ih1Xnfn9ukYKnoUacerCC7kiGfVf24xREIbE52UKdScHGq3CTi7Rja6dtm09bGrXr7dNW2XnrnQ6tXwx/cPDl56jaNc6HUq+GP7h4cnUbTcybnHRxFRU4aSm72U42vbbsaMTTMJbWst3KtsPXOLBxq4SqpJXjCU4volFXTFM+b3qbcV25yrWYH19X7pfqR7uK3hcffV+l5Il0AAAAAAAAAAAAAAAAAADAHNM7f5/EeuH9uJPT6Oe1n/sS6HgaehRpx6tOC7kiGfVe2oxTEKVlvIeJq4qrUjSbjKex6dPbFJJc76ESU1REKjUaW7XcmqGjq1ity/HT/AHHrdCDkr3ZnVrFbl+On+4xug5K92Y1axW5fjp/uM7oY5K92aWOwFShJRqw0JNXSvF7Oa+xmYlFctVWpxU6HmxDRwNBdMNLxNv4kNXqv9JGLNKCzpyNXr4rTp09KKpwinpQXNdvnfae6aoiGlrNNXcuZphEasYrc/np8T1vhqcjd7GrGK3X56fEb4ORu9jVfFbr89PiY3wzTobufOHR4xskuhJEK+iMUxDlmNfymLqfbryXfOxP+HOV/df8A7dU9BA6T0hyXGz0q1WXTUm++TNiHL3pzcl4mUeACYzRpOWOpW/26cn2LRa97R5r9G5oaZm7lesu1dHCV3/RmvxaaXvIqfVdaicWqpVXMD6+t90v1I93FZwv+dX6XoiXQAAAAAAAAAAAAAAAAAAAHNs5oaWUqsetOku+EETU/xUGqjOpn+nR0rIhnzXseUK/PPDDptWq7G1sjH0fie9ktOrX26ZxL51yw/Vq+CPEz4csdRtfJrlh+rV8EeI8OTqNo1xw/Vq+CPEeHLHUbXyq+c2U44muqkNJRVOMfpKzunJv3numMK3V3qb1eaXQMk09HDUY9FKmvyohn1XlmMW6Y+Glis5cPSqSpzlJSi7NKEmr+uxmKZR16y1RO2XlrZhevPy58Bsl45+z3NbcL15+XPgNknP2e70oZz4epOMIzk5SkopfJzW1uy9A2y9U621VOIlLzlZN9CueWxVOIy5bkpaeLo/arwb8SZP8Ahztr7r/9uo1p2hJ9EW+5EEOjrnFMuQt3/H3mx+HLTG6p02lkHDaKvQpt2V3o+khmqXQ06a1iPtfXIWG3FLwoZlnlrXaHpClQw6eiqVFel/Rhf1mPOXqPDt+mIVXOvOCNWHyNF6UW05z9DttUY9O30klNKt1mrprjZSxmB9fV+6X6kLjHC/51fpeiJdAAAAAAAAAAAAAAAAAAAwBzvLsksrSb5lXw7fqSp3Jqf4qDUTjVf3Dob5iFfT5w51i82MTGpJRp6cdJ2kpwV1fZsb2E0Vworuiu75xDx1bxW4fjpfuM74R8le7GreK3D8dL9w3wxyV7sat4rcPx0v3DfDPJXuzQxOFlTqOnUjozVk43TtdXXN60ZznzQeHVTXtqdYpxtFLoSRry6emMUw5Zleeliq76a1Tu0mjYj0c1qJzclqGUABJZtw0sbQX279yb+B5q9G1o4zepdIxibpVFFXk4Ssua8rOxA6GuJmmYhS8g5v16eKpTqU9GEZNt6UHb6LtsT6bEs1RhUabSXKbsVVQt2WKmjha76KVTv0WR0x5rS9Vi3LlaNhzMeq85s5yfK2o12lU5ozexVOx9EveRVUrrSayK42VeqdyhgKeIpuFSN16Gtji+lP0M8RLeuW4rjEue5byHPCyu1p02/o1EvZLoZNTVEqLVaeu1OfWEWemktGYH19X7pfqRHcWnC/51fpeiJdAAAAAAAAAAAAAAAAAAAwwOaZ2fz9f1w/twJ6fRzmuz48pfJGd+hCMMRGUtFW+UhZtr7Sfp7UeZobdjiMRGK4/tLRztwvXkv/lPgedktrn7PdnWzC9eXlVOA2Szz9nua2YXry8qpwGyTnrPc1swvXl5dTgNknPWe6m5RxcauOlVu/k3Vg72d9BaKvb1IkiPJUXbtNV/d+Fy1rwu8l5dTgR7JW3P2e7n1WelKUumUn3u5LCirnNUy+DLwBlJZu4qFHFQqVW1GKltSb2tNLYvWeaozDY0lymi5FVS5a2YXry8qpwI9krjnrPc1swvXl5VTgNknPWe7Ry3nJQq4WrTpzk5yjopOE1ztX2tdFzNNM5Q6jV26rcxE+cqSSqQQZzhbsg51qMfk8S39FfRqJOTfZJLbftI6qOy202viIxcSdbObBzi4zk5Ras4ulUaa7jzsmGxVrdPVGJlTMrU6CnfDVHKD/2SjNOHqbW1e0kjP5VF/wAPdm3KazA+vq/dL9SPNxucL/nV+l6Il0AAAAAAAAAAAAAAAAAADDA57nNgKs8dWlGlUlFuFpRhJp/QiudImpmMKHWWblV6ZiEXyZX3Fby58D1mGry93scmV9xW8ufAZhnl7vtOTK+4reXPgMwxy13scmV9xW8ufAZg5a72k5Mr7it5c+A3Qctd7ScmV9xV8ufAZg5e72OTK24reXPgMwctdj/5OTK24q+XPgMwcvc9pyZW3FXy58BmDl7vtOTK24reXPgMwcvd9pyZW3Fby58BmDl7ntOTK24reXPgMnL3PbJyZX3FXy58BmDlrnaTkuvuK3lz4DMHL3e0nJlfcVvLnwGYOWu9jkyvuK3lz4DMHLXfacmV9xW8ufAZg5a72OTK+4reXPgNzPL3exyZX3FXy58BmDl7vZZMx8JUp1qrqU5wTppJzhKKb0l0kdyVjw61XRXVNUfhcyNbAAAAAAAAAAAAAAAAAAAAYsDBYGAGAMYLAwWBhp5Ux6w9J1JRcldK0bXu/Wa2q1MWKN8prFibte2ENrfT3VTvhxKvrtr2y344Tc7wa3091U74cR1237ZZ6Rc7wzrfT3VTvhxHXbftk6Rd7wa3091U74cR1237ZOkXe8Gt9PdVO+HEddt+2TpF3vDGt9PdVO+HEx1237ZOkXO8PvD50wnOMFSqJzlGN24bG3bpJLXGbdyqKYifN4ucMuUUzVMx5LEi5VmAyYLAwWBiCwMQWBgsGWQAAAAAAAAAAAAAAAAAAAAAAAAAAAV3POVsNFdNWPsjJlLxucWMfKy4VGb/APSmHJOjDAAAAADeyJG+Lor+pF9234G9w+M6ilqa6cWKv06MjunKsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAq2e8/o0Y9MpvuSXxOf49V9lMLbhMffVKpnLugAAAAADCVzYhfGU+zSf5WWnCac6iGhxKcWJX9HaOZZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwKfntP8A1KK6ITfe1wOY49V91MLvhEeVUq2c8u2AAAAADCczPjfF36Kcn7UviXXBYzfz8Kvis4tR+15Ouc8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYFHzxnfFRXRSj7XL/ByXHKs3oj4X/CYxbmflBFItwAAAAAwseZMf9aq+iml3v8AwdBwKnNdUqbi9XlTC5HUKMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADDAoOdM74yp2KC/Kn8TjOL1Z1NXw6ThkYsQiSqWQAAAABmBasyYbK0u2C97+J0vAaftqn5UHFp+6mFrOiVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGGYFFztppYq6VnKEW+181+5I5DjVMRf8AL8w6HhVUza80KU61AAAABkzHqxPovGadJLCppWcpSbfS72Ox4PTEWPJzHEapm9MSm0WzRZAAAAAAAAAAAAAAAAAP/9k=',
              fit: [100, 100], absolutePosition: { x: 21, y: 53 },
              alignment: 'right'
            },
            {
              text: 'Date Ranges Of Report: ' + this.ReportingDate + ' - ' + this.Dates, alignment: 'left'
            },
            {
              text: "  ", alignment: 'left'
            },
            {
              table: {
                widths: [200, 100, 100, 100],
                font: 'sans-serif',
                body: [
                  [{ text: 'Name', fillColor: '#41b6a6', color: 'white' }, { text: 'Goal', fillColor: '#41b6a6', color: 'white' }, { text: 'Status', fillColor: '#41b6a6', color: 'white' }, { text: 'Exclusion Claimed', fillColor: '#41b6a6', color: 'white' }],
                  [{ text: '1. Protect Electronic Protected Health Info | ' + this.result1 + ' of 1', style: 'tableHeader', colSpan: '4', alignment: 'left', fillColor: '#ffb080' }],
                  ['Protect Electronic Protected Health Information', 'Complete Security Risk Analysis',
                    [{
                      table: {
                        widths: [5, 80],
                        body: [
                          [
                            {
                              table: {
                                widths: [8],
                                body: [
                                  [{ text: this.pdfcheckbox1, preserveLeadingSpaces: true }],
                                ],
                              },
                              margin: [1, 0],
                            },
                            {
                              text: '| Complete',
                              lineHeight: 1.1,
                              margin: [7, 1],
                              fontSize: 12,
                              alignment: 'center',
                            },
                          ],
                        ],
                      },
                      layout: {
                        defaultBorder: false,
                      },
                    },]
                    , 'None Available'],
                  [{ text: '2. Electronic Prescribing (eRX) | ' + this.result2 + ' of 1', style: 'tableHeader', colSpan: '4', alignment: 'left', fillColor: '#ffb080' }],
                  ['Electronic Prescribing (eRX) ', '> 60.0%', + this.percentage2 + '% | ' + this.numerator2 + ' / ' + this.denominator2,
                    [{
                      table: {
                        widths: [5, 80],
                        body: [
                          [
                            {
                              table: {
                                widths: [8],
                                body: [
                                  [{ text: this.pdfcheckbox2, preserveLeadingSpaces: true }],
                                ],
                              },
                              margin: [1, 0],
                            },
                            {
                              text: '| Exclusion',
                              lineHeight: 1.1,
                              margin: [5, 0],
                              fontSize: 12,
                              alignment: 'center',
                            },
                          ],
                        ],
                      },
                      layout: {
                        defaultBorder: false,
                      },
                    },]],
                  [{ text: '3. Clinical Decision Support (CDS) | ' + this.result3 + ' of 2', style: 'tableHeader', colSpan: '4', alignment: 'left', fillColor: '#ffb080' }],
                  ['3-1. Clinical Decision Support Interventions', '5 CDS Interventions Implemented', [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox31c, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Complete',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },], [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox31, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  ['3-2. Drug-Drug/Drug-Allergy Interaction ', 'Enable Interactions Alerts', [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox32c, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Complete',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },], [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox32, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  [{ text: '4. Computerized Provider Order Entry (CPOE) | ' + this.result4 + ' of 3', style: 'tableHeader', colSpan: '4', alignment: 'left', fillColor: '#ffb080' }],
                  ['4-1. Medication Orders ', '> 60.0%', + this.percentage41 + '% | ' + this.numerator41 + ' / ' + this.denominator41, [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox41, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  ['4-2. Laboratory Orders ', '> 60.0%', + this.percentage42 + '% | ' + this.numerator42 + ' / ' + this.denominator42, [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox42, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  ['4-3. Radiology Orders ', '> 60.0%', + this.percentage43 + '% | ' + this.numerator43 + ' / ' + this.denominator43, [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox43, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  [{ text: '5. Patient Electronic Access | ' + this.result5 + ' of 2', style: 'tableHeader', colSpan: '4', alignment: 'left', fillColor: '#ffb080' }],
                  ['5-1. Patient Electronic Access', '> 80.0%', + this.percentage51 + '% | ' + this.numerator51 + ' / ' + this.denominator51, [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox51, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  ['5-2. Patient Specific Education ', '> 35.0%', + this.percentage52 + '% | ' + this.numerator52 + ' / ' + this.denominator52, [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox52, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  [{ text: '6. Coordination of Care | ' + this.result6 + ' of 3', style: 'tableHeader', colSpan: '4', alignment: 'left', fillColor: '#ffb080' }],
                  ['6-1. View, Download, Transmit ', '> 10.0%', + this.percentage61 + '% | ' + this.numerator61 + ' / ' + this.denominator61, [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox61, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  ['6-2. Secure Messaging ', '> 25.0%', + this.percentage62 + '% | ' + this.numerator62 + ' / ' + this.denominator62, [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox62, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  ['6-3. Patient Generated Health Data ', '> 5.0% ', + this.percentage63 + '% | ' + this.numerator63 + ' / ' + this.denominator63, [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox63, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  [{ text: '7. Health Information Exchange | ' + this.result7 + ' of 3', style: 'tableHeader', colSpan: '4', alignment: 'left', fillColor: '#ffb080' }],
                  ['7-1. Health Information Exchange ', '> 50.0%', + this.percentage71 + '% | ' + this.numerator71 + ' / ' + this.denominator71, [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox71, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  ['7-2. Medication Reconciliation ', '> 40.0%', + this.percentage72 + '% | ' + this.numerator72 + ' / ' + this.denominator72, [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox72, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  ['7-3. Clinical Information Reconciliation', '> 80.0%', + this.percentage73 + '% | ' + this.numerator73 + ' / ' + this.denominator73, [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox73, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },],],
                  [{ text: '8. Public Health Reporting | ' + this.result8 + ' of 5', style: 'tableHeader', colSpan: '4', alignment: 'left', fillColor: '#ffb080', pageBreak: "before" },],
                  ['8-1. Immunization Registry Reporting', 'Complete Agent Engagement', [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox81c, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Complete',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },],
                    [{
                      table: {
                        widths: [5, 80],
                        body: [
                          [
                            {
                              table: {
                                widths: [8],
                                body: [
                                  [{ text: this.pdfcheckbox81, preserveLeadingSpaces: true }],
                                ],
                              },
                              margin: [1, 0],
                            },
                            {
                              text: '| Exclusion ',
                              lineHeight: 1.1,
                              margin: [5, 0],
                              fontSize: 12,
                              alignment: 'center',
                            },
                          ],
                        ],
                      },
                      layout: {
                        defaultBorder: false,
                      },
                    },]],
                  ['8-2. Syndromic Surveillance Reporting', 'Complete Agent Engagement', [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox82c, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Complete',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },], [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox82, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  ['8-3. Electronic Case Reporting ', 'Complete Agent Engagement', [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox83c, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Complete',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },], [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox83, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  ['8-4. Public Health Registry Reporting', 'Complete Agent Engagement', [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox84c, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Complete',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },], [{
                    table: {
                      widths: [5, 80],
                      body: [
                        [
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfcheckbox84, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 0],
                          },
                          {
                            text: '| Exclusion ',
                            lineHeight: 1.1,
                            margin: [5, 0],
                            fontSize: 12,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },]],
                  ['8-5. Clinical Data Registry Reporting ', 'Complete Agent Engagement',
                    [{
                      table: {
                        widths: [5, 80],
                        body: [
                          [
                            {
                              table: {
                                widths: [8],
                                body: [
                                  [{ text: this.pdfcheckbox85c, preserveLeadingSpaces: true }],
                                ],
                              },
                              margin: [1, 0],
                            },
                            {
                              text: '| Complete',
                              lineHeight: 1.1,
                              margin: [5, 0],
                              fontSize: 12,
                              alignment: 'center',
                            },
                          ],
                        ],
                      },
                      layout: {
                        defaultBorder: false,
                      },
                    },], [{
                      table: {
                        widths: [5, 80],
                        body: [
                          [
                            {
                              table: {
                                widths: [8],
                                body: [
                                  [{ text: this.pdfcheckbox85, preserveLeadingSpaces: true }],
                                ],
                              },
                              margin: [1, 0],
                            },
                            {
                              text: '| Exclusion ',
                              lineHeight: 1.1,
                              margin: [5, 0],
                              fontSize: 12,
                              alignment: 'center',
                            },
                          ],
                        ],
                      },
                      layout: {
                        defaultBorder: false,
                      },
                    },]]
                ]
              }
            }
          ]
      };
      pdfMake.createPdf(documenDefinition).download('Stage3.Pdf');
    }
    else if (this.stage2NumeDenomicount != null) {
      const documentColor = { content1: this.numerator3_3 === 0 ? { text: this.numerator3_3, fillColor: '#e6a2a2' } : { text: this.numerator3_3, fillColor: '#fff' } }
      const documenDefinition = {
        content:
          [{

            text: 'Promoting Interoperability (PI/MU) - Stage 2',
            style: "tableHeader",
            alignment: "center"

          },
          {
            text: this.ProviderName, alignment: 'left'
          },
          {
            text: this.LocationName, alignment: 'left'
          },
          {
            text: this.LocationStreetAddress, alignment: 'left'
          },
          {
            text: this.LocationCity + ' ' + this.LocationState + ' ' + this.LocationZip, alignment: 'left'
          },
          {
            text: this.LocationPhone, alignment: 'left'
          },
          {
            image: 'data:image/jpg;base64,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',
            fit: [100, 100], absolutePosition: { x: 21, y: 53 },
            alignment: 'right'
          },
          {
            text: 'Date Ranges Of Report: ' + this.ReportingDate + ' - ' + this.Dates, alignment: 'left'
          },
          {
            text: "  ", alignment: 'left'
          },
          {
            table: {
              widths: [30, 130, 80, 80, 40, 50, 60],
              font: 'sans-serif',
              body: [[{ text: 'Obj#', fillColor: '#41b6a6', color: 'white' }, { text: 'Name', fillColor: '#41b6a6', color: 'white' }, { text: 'Numerator', fillColor: '#41b6a6', color: 'white' }, { text: 'Denominator', fillColor: '#41b6a6', color: 'white' }, { text: '%', fillColor: '#41b6a6', color: 'white' }, { text: 'Req%', fillColor: '#41b6a6', color: 'white' }, { text: 'Exclusion Claimed', fillColor: '#41b6a6', color: 'white' }],
              ]
            }
          },
          {
            table: {
              widths: [30, 130, 277, 60],
              font: 'sans-serif',
              absolutePosition: { y: 60 },
              body: [
                [{ text: '1' }, { text: 'Protect PHI' },
                [
                  [{
                    table: {
                      widths: [130, 5, 10, 10, 10],
                      body: [
                        [
                          {
                            text: 'SRA Completed? ',
                            lineHeight: 1.1,
                            margin: [20, 4],
                            fontSize: 12,
                            alignment: 'left',
                          },
                          {
                            text: 'Y',
                            lineHeight: 1.1,
                            margin: [1, 4],
                            fontSize: 11,
                            alignment: 'right',
                          },
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfradioy1, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 1],
                          },
                          {
                            text: 'N',
                            lineHeight: 1.1,
                            margin: [5, 4],
                            fontSize: 11,
                            alignment: 'left',
                          },
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfradion1, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 1],
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },],
                ]
                  , {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox01, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                },],
              ]
            }
          },
          {
            table: {
              widths: [30, 130, 277, 60],
              font: 'sans-serif',
              body: [
                [{ text: '2-1' }, { text: 'Clinical Decision Support' },
                [
                  [{
                    table: {
                      widths: [130, 5, 10, 10, 10],
                      body: [
                        [
                          {
                            text: '5 Min. Enabled?',
                            lineHeight: 1.1,
                            margin: [20, 4],
                            fontSize: 12,
                            alignment: 'left',
                          },
                          {
                            text: 'Y',
                            lineHeight: 1.1,
                            margin: [1, 4],
                            fontSize: 11,
                            alignment: 'right',
                          },
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfradioy21, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 1],
                          },
                          {
                            text: 'N',
                            lineHeight: 1.1,
                            margin: [5, 4],
                            fontSize: 11,
                            alignment: 'left',
                          },
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfradion21, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 1],
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },],
                ], {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox021, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                },],
              ]
            }
          },
          {
            table: {
              widths: [30, 130, 277, 60],
              font: 'sans-serif',
              body: [
                [{ text: '2-2' }, { text: 'Drug-Drug/Drug-Allergy Interaction' },
                [
                  [{
                    table: {
                      widths: [130, 5, 10, 10, 10],
                      body: [
                        [
                          {
                            text: '5 Min. Enabled?',
                            lineHeight: 1.1,
                            margin: [20, 4],
                            fontSize: 12,
                            alignment: 'left',
                          },
                          {
                            text: 'Y',
                            lineHeight: 1.1,
                            margin: [1, 4],
                            fontSize: 11,
                            alignment: 'right',
                          },
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfradioy22, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 1],
                          },
                          {
                            text: 'N',
                            lineHeight: 1.1,
                            margin: [5, 4],
                            fontSize: 11,
                            alignment: 'left',
                          },
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfradion22, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 1],
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },],
                ], {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox022, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                },],
              ]
            }
          },
          {
            table: {
              widths: [30, 130, 80, 80, 40, 50, 60],
              font: 'sans-serif',
              body: [
                [this.numerator3_1 === 0 || this.denominator3_1 === 0 ? { text: '3-1', fillColor: '#e6a2a2' } : { text: '3-1', fillColor: '#fff' },
                this.numerator3_1 === 0 || this.denominator3_1 === 0 ? { text: 'CPOE: Medication Orders', fillColor: '#e6a2a2' } : { text: 'CPOE: Medication Orders', fillColor: '#fff' },
                this.numerator3_1 === 0 || this.denominator3_1 === 0 ? { text: this.numerator3_1, fillColor: '#e6a2a2' } : { text: this.numerator3_1, fillColor: '#fff' },
                this.numerator3_1 === 0 || this.denominator3_1 === 0 ? { text: this.denominator3_1, fillColor: '#e6a2a2' } : { text: this.denominator3_1, fillColor: '#fff' },
                this.numerator3_1 === 0 || this.denominator3_1 === 0 ? { text: this.percentage3_1 + '%', fillColor: '#e6a2a2' } : { text: this.percentage3_1 + '%', fillColor: '#fff' },
                this.numerator3_1 === 0 || this.denominator3_1 === 0 ? { text: '60.0%', fillColor: '#e6a2a2' } : { text: '60.0%', fillColor: '#fff' },
                this.numerator3_1 === 0 || this.denominator3_1 === 0 ? {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox031, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#e6a2a2'
                } : {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox031, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#fff'
                },],
              ]
            }
          },
          {
            table: {
              widths: [30, 130, 80, 80, 40, 50, 60],
              font: 'sans-serif',
              body: [
                [this.numerator3_2 === 0 || this.denominator3_2 === 0 ? { text: '3-2', fillColor: '#e6a2a2' } : { text: '3-2', fillColor: '#fff' },
                this.numerator3_2 === 0 || this.denominator3_2 === 0 ? { text: 'CPOE: Laboratory Orders', fillColor: '#e6a2a2' } : { text: 'CPOE: Laboratory Orders', fillColor: '#fff' },
                this.numerator3_2 === 0 || this.denominator3_2 === 0 ? { text: this.numerator3_2, fillColor: '#e6a2a2' } : { text: this.numerator3_2, fillColor: '#fff' },
                this.numerator3_2 === 0 || this.denominator3_2 === 0 ? { text: this.denominator3_2, fillColor: '#e6a2a2' } : { text: this.denominator3_2, fillColor: '#fff' },
                this.numerator3_2 === 0 || this.denominator3_2 === 0 ? { text: this.percentage3_2 + '%', fillColor: '#e6a2a2' } : { text: this.percentage3_2 + '%', fillColor: '#fff' },
                this.numerator3_2 === 0 || this.denominator3_2 === 0 ? { text: '30.0 %', fillColor: '#e6a2a2' } : { text: '30.0 %', fillColor: '#fff' },
                this.numerator3_2 === 0 || this.denominator3_2 === 0 ? {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox032, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#e6a2a2'
                } : {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox032, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#fff'
                }],
              ]
            }
          },
          {
            table: {
              widths: [30, 130, 80, 80, 40, 50, 60],
              font: 'sans-serif',
              body: [
                [this.numerator3_3 === 0 || this.denominator3_3 === 0 ? { text: '3-3', fillColor: '#e6a2a2' } : { text: '3-3', fillColor: '#fff' },
                this.numerator3_3 === 0 || this.denominator3_3 === 0 ? { text: 'CPOE: Radiology Orders', fillColor: '#e6a2a2' } : { text: 'CPOE: Radiology Orders', fillColor: '#fff' },
                this.numerator3_3 === 0 || this.denominator3_3 === 0 ? { text: this.numerator3_3, fillColor: '#e6a2a2' } : { text: this.numerator3_3, fillColor: '#fff' },
                this.numerator3_3 === 0 || this.denominator3_3 === 0 ? { text: this.denominator3_3, fillColor: '#e6a2a2' } : { text: this.denominator3_3, fillColor: '#fff' },
                this.numerator3_3 === 0 || this.denominator3_3 === 0 ? { text: this.percentage3_3 + '%', fillColor: '#e6a2a2' } : { text: this.percentage3_3 + '%', fillColor: '#fff' },
                this.numerator3_3 === 0 || this.denominator3_3 === 0 ? { text: '30.0 %', fillColor: '#e6a2a2' } : { text: '30.0 %', fillColor: '#fff' },
                this.numerator3_3 === 0 || this.denominator3_3 === 0 ? {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox033, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#e6a2a2'
                } : {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox033, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#fff'
                }],
              ]
            }
          },
          {
            table: {
              widths: [30, 130, 80, 80, 40, 50, 60],
              font: 'sans-serif',
              body: [
                [this.numerator4 === 0 || this.denominator4 === 0 ? { text: '4', fillColor: '#e6a2a2' } : { text: '4', fillColor: '#fff' },
                this.numerator4 === 0 || this.denominator4 === 0 ? { text: 'Electronic Prescribing', fillColor: '#e6a2a2' } : { text: 'Electronic Prescribing', fillColor: '#fff' },
                this.numerator4 === 0 || this.denominator4 === 0 ? { text: this.numerator4, fillColor: '#e6a2a2' } : { text: this.numerator4, fillColor: '#fff' },
                this.numerator4 === 0 || this.denominator4 === 0 ? { text: this.denominator4, fillColor: '#e6a2a2' } : { text: this.denominator4, fillColor: '#fff' },
                this.numerator4 === 0 || this.denominator4 === 0 ? { text: this.percentage4 + '%', fillColor: '#e6a2a2' } : { text: this.percentage4 + '%', fillColor: '#fff' },
                this.numerator4 === 0 || this.denominator4 === 0 ? { text: '50.0 %', fillColor: '#e6a2a2' } : { text: '50.0 %', fillColor: '#fff' },
                this.numerator4 === 0 || this.denominator4 === 0 ? {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox04, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#e6a2a2'
                } : {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox04, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#fff'
                }],
              ]
            }
          },
          {
            table: {
              widths: [30, 130, 80, 80, 40, 50, 60],
              font: 'sans-serif',
              body: [
                [this.numerator5 === 0 || this.denominator5 === 0 ? { text: '5', fillColor: '#e6a2a2' } : { text: '5', fillColor: '#fff' },
                this.numerator5 === 0 || this.denominator5 === 0 ? { text: 'Health Information Exchange', fillColor: '#e6a2a2' } : { text: 'Health Information Exchange', fillColor: '#fff' },
                this.numerator5 === 0 || this.denominator5 === 0 ? { text: this.numerator5, fillColor: '#e6a2a2' } : { text: this.numerator5, fillColor: '#fff' },
                this.numerator5 === 0 || this.denominator5 === 0 ? { text: this.denominator5, fillColor: '#e6a2a2' } : { text: this.denominator5, fillColor: '#fff' },
                this.numerator5 === 0 || this.denominator5 === 0 ? { text: this.percentage5 + '%', fillColor: '#e6a2a2' } : { text: this.percentage5 + '%', fillColor: '#fff' },
                this.numerator5 === 0 || this.denominator5 === 0 ? { text: '10.0 %', fillColor: '#e6a2a2' } : { text: '10.0 %', fillColor: '#fff' },
                this.numerator5 === 0 || this.denominator5 === 0 ? {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox05, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#e6a2a2'
                } : {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox05, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#fff'
                }],
              ]
            }
          },
          {
            table: {
              widths: [30, 130, 80, 80, 40, 50, 60],
              font: 'sans-serif',
              body: [
                [this.numerator6 === 0 || this.denominator6 === 0 ? { text: '6', fillColor: '#e6a2a2' } : { text: '6', fillColor: '#fff' },
                this.numerator6 === 0 || this.denominator6 === 0 ? { text: 'Patient Specific Education', fillColor: '#e6a2a2' } : { text: 'Patient Specific Education', fillColor: '#fff' },
                this.numerator6 === 0 || this.denominator6 === 0 ? { text: this.numerator6, fillColor: '#e6a2a2' } : { text: this.numerator6, fillColor: '#fff' },
                this.numerator6 === 0 || this.denominator6 === 0 ? { text: this.denominator6, fillColor: '#e6a2a2' } : { text: this.denominator6, fillColor: '#fff' },
                this.numerator6 === 0 || this.denominator6 === 0 ? { text: this.percentage6 + '%', fillColor: '#e6a2a2' } : { text: this.percentage6 + '%', fillColor: '#fff' },
                this.numerator6 === 0 || this.denominator6 === 0 ? { text: '10.0 %', fillColor: '#e6a2a2' } : { text: '10.0 %', fillColor: '#fff' },
                this.numerator6 === 0 || this.denominator6 === 0 ? {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox06, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#e6a2a2'
                } : {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox06, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#fff'
                }],
              ]

            }
          },
          {
            table: {
              widths: [30, 130, 80, 80, 40, 50, 60],
              font: 'sans-serif',
              body: [
                [this.numerator7 === 0 || this.denominator7 === 0 ? { text: '7', fillColor: '#e6a2a2' } : { text: '7', fillColor: '#fff' },
                this.numerator7 === 0 || this.denominator7 === 0 ? { text: 'Medication Reconciliation', fillColor: '#e6a2a2' } : { text: 'Medication Reconciliation', fillColor: '#fff' },
                this.numerator7 === 0 || this.denominator7 === 0 ? { text: this.numerator7, fillColor: '#e6a2a2' } : { text: this.numerator7, fillColor: '#fff' },
                this.numerator7 === 0 || this.denominator7 === 0 ? { text: this.denominator7, fillColor: '#e6a2a2' } : { text: this.denominator7, fillColor: '#fff' },
                this.numerator7 === 0 || this.denominator7 === 0 ? { text: this.percentage7 + '%', fillColor: '#e6a2a2' } : { text: this.percentage7 + '%', fillColor: '#fff' },
                this.numerator7 === 0 || this.denominator7 === 0 ? { text: '50.0 %', fillColor: '#e6a2a2' } : { text: '50.0 %', fillColor: '#fff' },
                this.numerator7 === 0 || this.denominator7 === 0 ? {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox07, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#e6a2a2'
                } : {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox07, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#fff'
                }],
              ]
            }
          },
          {
            table: {
              widths: [30, 130, 80, 80, 40, 50, 60],
              font: 'sans-serif',
              body: [
                [this.numerator8_1 === 0 || this.denominator8_1 === 0 ? { text: '8-1', fillColor: '#e6a2a2' } : { text: '8-1', fillColor: '#fff' },
                this.numerator8_1 === 0 || this.denominator8_1 === 0 ? { text: 'Patient Electronic Access', fillColor: '#e6a2a2' } : { text: 'Patient Electronic Access', fillColor: '#fff' },
                this.numerator8_1 === 0 || this.denominator8_1 === 0 ? { text: this.numerator8_1, fillColor: '#e6a2a2' } : { text: this.numerator8_1, fillColor: '#fff' },
                this.numerator8_1 === 0 || this.denominator8_1 === 0 ? { text: this.denominator8_1, fillColor: '#e6a2a2' } : { text: this.denominator8_1, fillColor: '#fff' },
                this.numerator8_1 === 0 || this.denominator8_1 === 0 ? { text: this.percentage8_1 + '%', fillColor: '#e6a2a2' } : { text: this.percentage8_1 + '%', fillColor: '#fff' },
                this.numerator8_1 === 0 || this.denominator8_1 === 0 ? { text: '50.0 %', fillColor: '#e6a2a2' } : { text: '50.0 %', fillColor: '#fff' },
                this.numerator8_1 === 0 || this.denominator8_1 === 0 ? {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox081, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#e6a2a2'
                } : {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox081, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#fff'
                }],

              ]
            }
          },
          {
            table: {
              widths: [30, 130, 80, 80, 40, 50, 60],
              font: 'sans-serif',
              body: [

                [this.numerator8_2 === 0 || this.denominator8_2 === 0 ? { text: '8-2', fillColor: '#e6a2a2' } : { text: '8-2', fillColor: '#fff' },
                this.numerator8_2 === 0 || this.denominator8_2 === 0 ? { text: 'View, Download, Transmit', fillColor: '#e6a2a2' } : { text: 'View, Download, Transmit', fillColor: '#fff' },
                this.numerator8_2 === 0 || this.denominator8_2 === 0 ? { text: this.numerator8_2, fillColor: '#e6a2a2' } : { text: this.numerator8_2, fillColor: '#fff' },
                this.numerator8_2 === 0 || this.denominator8_2 === 0 ? { text: this.denominator8_2, fillColor: '#e6a2a2' } : { text: this.denominator8_2, fillColor: '#fff' },
                this.numerator8_2 === 0 || this.denominator8_2 === 0 ? { text: this.percentage8_2 + '%', fillColor: '#e6a2a2' } : { text: this.percentage8_2 + '%', fillColor: '#fff' },
                this.numerator8_2 === 0 || this.denominator8_2 === 0 ? { text: '5.0 %', fillColor: '#e6a2a2' } : { text: '5.0 %', fillColor: '#fff' },
                this.numerator8_2 === 0 || this.denominator8_2 === 0 ? {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox082, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#e6a2a2'
                } : {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox082, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#fff'
                }],
              ]
            }
          },
          {
            table: {
              widths: [30, 130, 80, 80, 40, 50, 60],
              font: 'sans-serif',
              body: [
                [this.numerator9 === 0 || this.denominator9 === 0 ? { text: '9', fillColor: '#e6a2a2' } : { text: '9', fillColor: '#fff' },
                this.numerator9 === 0 || this.denominator9 === 0 ? { text: 'Secure Messaging', fillColor: '#e6a2a2' } : { text: 'Secure Messaging', fillColor: '#fff' },
                this.numerator9 === 0 || this.denominator9 === 0 ? { text: this.numerator9, fillColor: '#e6a2a2' } : { text: this.numerator9, fillColor: '#fff' },
                this.numerator9 === 0 || this.denominator9 === 0 ? { text: this.denominator9, fillColor: '#e6a2a2' } : { text: this.denominator9, fillColor: '#fff' },
                this.numerator9 === 0 || this.denominator9 === 0 ? { text: this.percentage9 + '%', fillColor: '#e6a2a2' } : { text: this.percentage9 + '%', fillColor: '#fff' },
                this.numerator9 === 0 || this.denominator9 === 0 ? { text: '5.0 %', fillColor: '#e6a2a2' } : { text: '5.0 %', fillColor: '#fff' },
                this.numerator9 === 0 || this.denominator9 === 0 ? {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox09, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#e6a2a2'
                } : {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox09, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                  fillColor: '#fff'
                }],
              ]
            }
          },
          {
            table: {
              widths: [30, 130, 277, 60],
              font: 'sans-serif',
              body: [
                [{ text: '10-1' }, { text: 'PHR:Immunizations' },
                [
                  [{
                    table: {
                      widths: [190, 5, 10, 10, 10],
                      body: [
                        [
                          {
                            text: 'Registered Intent or Submitted Data?',
                            lineHeight: 1.1,
                            margin: [1, 4],
                            fontSize: 12,
                            alignment: 'left',
                          },
                          {
                            text: 'Y',
                            lineHeight: 1.1,
                            margin: [1, 4],
                            fontSize: 11,
                            alignment: 'right',
                          },
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfradioy101, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 1],
                          },
                          {
                            text: 'N',
                            lineHeight: 1.1,
                            margin: [5, 4],
                            fontSize: 11,
                            alignment: 'left',
                          },
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfradion101, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 1],
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },],
                ], {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox0101, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                },],
              ]
            }
          },
          {
            table: {
              widths: [30, 130, 277, 60],
              font: 'sans-serif',
              body: [
                [{ text: '10-2' }, { text: 'PHR: Syndromic Surveillance' },
                [
                  [{
                    table: {
                      widths: [190, 5, 10, 10, 10],
                      body: [
                        [
                          {
                            text: 'Registered Intent or Submitted Data?',
                            lineHeight: 1.1,
                            margin: [1, 4],
                            fontSize: 12,
                            alignment: 'left',
                          },
                          {
                            text: 'Y',
                            lineHeight: 1.1,
                            margin: [1, 4],
                            fontSize: 11,
                            alignment: 'right',
                          },
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfradioy102, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 1],
                          },
                          {
                            text: 'N',
                            lineHeight: 1.1,
                            margin: [5, 4],
                            fontSize: 11,
                            alignment: 'left',
                          },
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfradion102, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 1],
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },],
                ], {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox0102, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                },],
              ]
            }
          },
          {
            table: {
              widths: [30, 130, 277, 60],
              font: 'sans-serif',
              body: [
                [{ text: '10-3' }, { text: 'PHR: Specialized Registry' },
                [
                  [{
                    table: {
                      widths: [190, 5, 10, 10, 10],
                      body: [
                        [
                          {
                            text: 'Registered Intent or Submitted Data?',
                            lineHeight: 1.1,
                            margin: [1, 4],
                            fontSize: 12,
                            alignment: 'left',
                          },
                          {
                            text: 'Y',
                            lineHeight: 1.1,
                            margin: [1, 4],
                            fontSize: 11,
                            alignment: 'right',
                          },
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfradioy103, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 1],
                          },
                          {
                            text: 'N',
                            lineHeight: 1.1,
                            margin: [5, 4],
                            fontSize: 11,
                            alignment: 'left',
                          },
                          {
                            table: {
                              widths: [8],
                              body: [
                                [{ text: this.pdfradion103, preserveLeadingSpaces: true }],
                              ],
                            },
                            margin: [1, 1],
                          },
                        ],
                      ],
                    },
                    layout: {
                      defaultBorder: false,
                    },
                  },],
                ], {
                  table: {
                    widths: [8],
                    body: [
                      [{ text: this.pdfcheckbox0103, preserveLeadingSpaces: true }],
                    ],
                  },
                  margin: [10, 4],
                },],
              ]
            }
          },
          ]
      };
      pdfMake.createPdf(documenDefinition).download('Stage2.Pdf');
    }
    else {
    }
  }

  constructor(private authenticationService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private service: Accountservice, private fb: FormBuilder, public datepipe: DatePipe) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

  }

  ngOnInit() {
    //this.onProviderSelected('');
    this.getProviderList();
    //this.loadPatientProviders();
    this.Stage3Form();

  }

  // getProviderList(Providersdata: any) {
  //   this.LocationName = Providersdata.Location_Name;
  //   this.LocationPhone = Providersdata.Location_Phone;
  //   this.LocationStreetAddress = Providersdata.Location_Street_Address;
  //   this.LocationCity = Providersdata.Location_City == undefined ? '' : Providersdata.Location_City;
  //   this.LocationState = Providersdata.Location_State == undefined ? '' : Providersdata.Location_State;
  //   this.LocationName == undefined ? 0 : this.LocationName;
  //   this.LocationZip = Providersdata.Location_Zip == undefined ? '' : Providersdata.Location_Zip;

  //   let locationid = localStorage.getItem('providerlocation');

  //   var req = {
  //     "LocationId": locationid,
  //   }
  //   this.service.getProviderList(req).subscribe(data => {
  //     if (data.IsSuccess) {
  //       this.providerlist = data.ListResult;
  //       this.filteredproviderList = this.providerlist.slice();
  //     }
  //   });
  // }

  onProviderSelected(Provider: any) {
    this.smartSchedulerService.ProviderPracticeLocations({"ProviderId":Provider.ProviderId}).subscribe(data => {
      if (data.IsSuccess) {
        this.locationslist = data.ListResult;
        this.filteredlocationList = this.locationslist.slice();
      }
    });
  }
  onStage2SubmitPatientList(req) {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    var Patientreport = {
      "startDate": this.datepipe.transform(this.muReportForm.value.strSDate, 'yyyy-MM-dd', 'en-US'),
      "endDate": this.datepipe.transform(this.muReportForm.value.strEDate, 'yyyy-MM-dd', 'en-US'),
      "ProviderId": this.muReportForm.value.ProviderId,
      "TypeName": req,
    }

    this.getStage2PatientList(Patientreport);
  }

  disableEndDate() {
    var StartDate =
      this.muReportForm.value.strSDate == null
        ? ""
        : this.muReportForm.value.strSDate;
    if (StartDate != "") {
      this.disableEndDateInput = false;
    }
    else {
      this.disableEndDateInput = true;
    }
  }

  getStage2PatientList(data: any) {
    this.Stage2PatientList = [];
    this.Stage2PatientListlength = null;
    this.service.getStage2PatientList(data).subscribe(data => {
      if (data.IsSuccess) {
        this.Stage2PatientList = data.ListResult;
        this.Stage2PatientListlength = data.ListResult.length;
      }
      else {
        this.Stage2PatientListlength = 0;
      }
      this.customizedspinner = false;
    });
  }

  hideScroll() {
    this.customizedspinner = false; $('body').removeClass('loadactive');
  }

  onSubmitMUReport() {
    if (this.muReportForm.invalid) {
      return;
    }
    var MUreport = {
      "startDate": this.datepipe.transform(this.muReportForm.value.strSDate, 'MM/dd/yyyy', 'en-US'),
      "endDate": this.datepipe.transform(this.muReportForm.value.strEDate, 'MM/dd/yyyy', 'en-US'),
      "ProviderId": this.muReportForm.value.ProviderId,
      "stage_type": this.muReportForm.value.stage_type,
    }
    this.ReportingDate = this.datepipe.transform(this.muReportForm.value.strSDate, 'MM/dd/yyyy', 'en-US');
    this.Dates = this.datepipe.transform(this.muReportForm.value.strEDate, 'MM/dd/yyyy', 'en-US');

    if (this.muReportForm.value.stage_type == 2) {
      this.protectvalue = null;
      this.clinicalvalue = null;
      this.drugvalue = null;
      this.immunizationvalue = null;
      this.syndromicvalue = null;
      this.specializedvalue = null;
      this.getStage2NumeDenomicount(MUreport);
      this.checkboxeventry1(this.radioy1);
    }
    else if (this.muReportForm.value.stage_type == 3) {
      this.getStage3NumeDenomicount(MUreport);
    }
    this.checkboxeventry1(false);
    this.checkboxeventrn1(false);
    this.checkboxeventry21(false);
    this.checkboxeventrn21(false);
    this.checkboxeventry22(false);
    this.checkboxeventrn22(false);
    this.checkboxeventry101(false);
    this.checkboxeventrn101(false);
    this.checkboxeventry102(false);
    this.checkboxeventrn102(false);
    this.checkboxeventry103(false);
    this.checkboxeventrn103(false);
    this.checkboxevent1(false);
    this.checkboxevent2(false);
    this.checkboxevent31(false);
    this.checkboxevent32(false);
    this.checkboxevent41(false);
    this.checkboxevent42(false);
    this.checkboxevent43(false);
    this.checkboxevent51(false);
    this.checkboxevent52(false);
    this.checkboxevent61(false);
    this.checkboxevent62(false);
    this.checkboxevent63(false);
    this.checkboxevent71(false);
    this.checkboxevent72(false);
    this.checkboxevent73(false);
    this.checkboxevent81(false);
    this.checkboxevent82(false);
    this.checkboxevent83(false);
    this.checkboxevent84(false);
    this.checkboxevent85(false);
    this.checkboxevent01(false);
    this.checkboxevent021(false);
    this.checkboxevent022(false);
    this.checkboxevent031(false);
    this.checkboxevent032(false);
    this.checkboxevent033(false);
    this.checkboxevent04(false);
    this.checkboxevent05(false);
    this.checkboxevent06(false);
    this.checkboxevent07(false);
    this.checkboxevent081(false);
    this.checkboxevent082(false);
    this.checkboxevent09(false);
    this.checkboxevent0101(false);
    this.checkboxevent0102(false);
    this.checkboxevent0103(false);
    this.checkboxeventry103(false);
    this.checkboxeventrn103(false);
    this.checkboxeventry102(false);
    this.checkboxeventrn103(false);
    this.checkboxeventry101(false);
    this.checkboxeventrn101(false);
    this.checkboxeventry22(false);
    this.checkboxeventrn22(false);
    this.checkboxeventry21(false);
    this.checkboxeventrn21(false);
    this.checkboxeventry1(false);
    this.checkboxeventrn1(false);
    this.checkboxevent1(false);
    this.checkboxevent85c(false);
    this.checkboxevent84c(false);
    this.checkboxevent31c(false);
    this.checkboxevent32c(false);
    this.checkboxevent81c(false);
    this.checkboxevent82c(false);
    this.checkboxevent83c(false);
  }

  getStage2NumeDenomicount(data: any) {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.stage2NumeDenomicount = null;
    this.stage3NumeDenomicount = null;
    this.service.GetStage2NumeDenomiCount(data).subscribe(data => {
      if (data.IsSuccess) {
        this.Stage2 = true;
        this.Stage3 = false;
        this.checkboxevent01(this.checkbox01);
        this.checkboxevent021(this.checkbox021);
        this.checkboxevent022(this.checkbox022);
        this.checkboxevent031(this.checkbox031);
        this.checkboxevent032(this.checkbox032);
        this.checkboxevent033(this.checkbox033);
        this.checkboxevent04(this.checkbox04);
        this.checkboxevent05(this.checkbox05);
        this.checkboxevent06(this.checkbox06);
        this.checkboxevent07(this.checkbox07);
        this.checkboxevent081(this.checkbox081);
        this.checkboxevent082(this.checkbox082);
        this.checkboxevent09(this.checkbox09);
        this.checkboxevent0101(this.checkbox0101);
        this.checkboxevent0102(this.checkbox0102);
        this.checkboxevent0103(this.checkbox0103);
        this.stage2NumeDenomicount = data.ListResult;
        this.disabledowloadPDF = false;
        for (var val of data.ListResult) {
          if (val.TypeName == '3-1') {
            this.numerator3_1 = val.Numerator;
            this.denominator3_1 = val.Denominator;
            this.percentage3_1 = val.Percentage;
          }
          if (val.TypeName == '3-2') {
            this.numerator3_2 = val.Numerator;
            this.denominator3_2 = val.Denominator;
            this.percentage3_2 = val.Percentage;
          }
          if (val.TypeName == '3-3') {
            this.numerator3_3 = val.Numerator;
            this.denominator3_3 = val.Denominator;
            this.percentage3_3 = val.Percentage;
          }
          if (val.TypeName == '4') {
            this.numerator4 = val.Numerator;
            this.denominator4 = val.Denominator;
            this.percentage4 = val.Percentage;
          }
          if (val.TypeName == '5') {
            this.numerator5 = val.Numerator;
            this.denominator5 = val.Denominator;
            this.percentage5 = val.Percentage;
          }
          if (val.TypeName == '6') {
            this.numerator6 = val.Numerator;
            this.denominator6 = val.Denominator;
            this.percentage6 = val.Percentage;
          }
          if (val.TypeName == '7') {
            this.numerator7 = val.Numerator;
            this.denominator7 = val.Denominator;
            this.percentage7 = val.Percentage;
          }
          if (val.TypeName == '8-1') {
            this.numerator8_1 = val.Numerator;
            this.denominator8_1 = val.Denominator;
            this.percentage8_1 = val.Percentage;
          }
          if (val.TypeName == '8-2') {
            this.numerator8_2 = val.Numerator;
            this.denominator8_2 = val.Denominator;
            this.percentage8_2 = val.Percentage;
          }
          if (val.TypeName == '9') {
            this.numerator9 = val.Numerator;
            this.denominator9 = val.Denominator;
            this.percentage9 = val.Percentage;
          }
        }
        this.customizedspinner = false; $('body').removeClass('loadactive');
      }
    });
  }

  checkboxeventry1(event) {
    this.radioy1 = event;
    if (this.radioy1 == true) {
      this.pdfradioy1 = "√";
      this.radion1 = false;
      this.checkboxeventrn1(this.radion1);
    }
    else if (this.radioy1 == false || this.radioy1 == undefined) {
      this.pdfradioy1 = "\t";
      this.checkboxeventrn1(this.radion1);
    }
  }
  checkboxeventrn1(event) {
    this.radion1 = event;
    if (this.radion1 == true) {
      this.pdfradion1 = "√";
      this.radioy1 = false;
      this.checkboxeventry1(this.radioy1);
    }
    else if (this.radion1 == false || this.radion1 == undefined) {
      this.pdfradion1 = "\t";
    }
    this.checkboxeventry21(this.radioy21);
  }
  checkboxeventrn21(event) {
    this.radion21 = event;
    if (this.radion21 == true) {
      this.pdfradion21 = "√";
      this.radioy21 = false;
      this.checkboxeventry21(this.radioy21);
    }
    else if (this.radion21 == false || this.radion21 == undefined) {
      this.pdfradion21 = "\t";
    }
    this.checkboxeventry22(this.radioy22);
  }
  checkboxeventry21(event) {
    this.radioy21 = event;
    if (this.radioy21 == true) {
      this.pdfradioy21 = "√";
      this.radion21 = false;
      this.checkboxeventrn21(this.radion21);
    }
    else if (this.radioy21 == false || this.radioy21 == undefined) {
      this.pdfradioy21 = "\t";
      this.checkboxeventrn21(this.radion21);
    }
  }
  checkboxeventry22(event) {
    this.radioy22 = event;
    if (this.radioy22 == true) {
      this.pdfradioy22 = "√";
      this.radion22 = false;
      this.checkboxeventrn22(this.radion22);
    }
    else if (this.radioy22 == false || this.radioy22 == undefined) {
      this.pdfradioy22 = "\t";
      this.checkboxeventrn22(this.radion22);
    }
  }
  checkboxeventrn22(event) {
    this.radion22 = event;
    if (this.radion22 == true) {
      this.pdfradion22 = "√";
      this.radioy22 = false;
      this.checkboxeventry22(this.radioy22);
    }
    else if (this.radion22 == false || this.radion22 == undefined) {
      this.pdfradion22 = "\t";
    }
    this.checkboxeventry101(this.radioy101);
  }
  checkboxeventry101(event) {
    this.radioy101 = event;
    if (this.radioy101 == true) {
      this.pdfradioy101 = "√";
      this.radion101 = false;
      this.checkboxeventrn101(this.radion101);
    }
    else if (this.radioy101 == false || this.radioy101 == undefined) {
      this.pdfradioy101 = "\t";
      this.checkboxeventrn101(this.radion101);
    }
  }
  checkboxeventrn101(event) {
    this.radion101 = event;
    if (this.radion101 == true) {
      this.pdfradion101 = "√";
      this.radioy101 = false;
      this.checkboxeventry101(this.radioy101);
    }
    else if (this.radion101 == false || this.radion101 == undefined) {
      this.pdfradion101 = "\t";
    }
    this.checkboxeventry102(this.radioy102);
  }
  checkboxeventry102(event) {
    this.radioy102 = event;
    if (this.radioy102 == true) {
      this.pdfradioy102 = "√";
      this.radion102 = false;
      this.checkboxeventrn102(this.radion102);
    }
    else if (this.radioy102 == false || this.radioy102 == undefined) {
      this.pdfradioy102 = "\t";
      this.checkboxeventrn102(this.radion102);
    }
  }
  checkboxeventrn102(event) {
    this.radion102 = event;
    if (this.radion102 == true) {
      this.pdfradion102 = "√";
      this.radioy102 = false;
      this.checkboxeventry102(this.radioy102);
    }
    else if (this.radion102 == false || this.radion102 == undefined) {
      this.pdfradion102 = "\t";
    }
    this.checkboxeventry103(this.radioy103);
  }
  checkboxeventry103(event) {
    this.radioy103 = event;
    if (this.radioy103 == true) {
      this.pdfradioy103 = "√";
      this.radion103 = false;
      this.checkboxeventrn103(this.radion103);
    }
    else if (this.radioy103 == false || this.radioy103 == undefined) {
      this.pdfradioy103 = "\t";
      this.checkboxeventrn103(this.radion103);
    }
  }
  checkboxeventrn103(event) {
    this.radion103 = event;
    if (this.radion103 == true) {
      this.pdfradion103 = "√";
      this.radioy103 = false;
      this.checkboxeventry103(this.radioy103);
    }
    else if (this.radion103 == false || this.radion103 == undefined) {
      this.pdfradion103 = "\t";
    }
  }
  checkboxevent2(event) {
    this.checkboxvalue2 = event;
    var count: number = 0;
    this.checkbox2 = event;
    if (this.percentage2 > 60.0 || this.checkbox2 == true) {
      count++;
      this.patientelectronicacess2 = count;
    }
    else {
      this.patientelectronicacess2 = count;
    }
    if (this.checkbox2 == true) {
      this.pdfcheckbox2 = "√"
    }
    else if (this.checkbox2 == false || this.checkbox2 == undefined) {
      this.pdfcheckbox2 = "\t";
    }
    this.result2 = this.patientelectronicacess2 == undefined ? 0 : this.patientelectronicacess2;
  }
  checkboxevent1(event) {
    this.checkboxvalue1 = event;
    this.checkbox1 = event;
    var count: number = 0;
    if (this.checkbox1 == true) {
      count++;
      this.patientelectronicacess1 = count;
    }
    else {
      this.patientelectronicacess1 = count;
    }
    this.result1 = this.patientelectronicacess1 == undefined ? 0 : this.patientelectronicacess1;
    if (this.checkbox1 == true) {
      this.pdfcheckbox1 = "√"
    }
    else if (this.checkbox1 == false || this.checkbox1 == undefined) {
      this.pdfcheckbox1 = "\t"
    }
  }
  checkboxevent31c(event) {
    this.checkboxvalue31c = event;
    this.checkbox31c = event;
    var count: number = 0;
    if (this.checkbox31c == true || this.checkbox31 == true) {
      count++;
      this.patientelectronicacess31 = count;
    }
    else if (this.checkbox31c == false && this.checkbox31 == false) {
      this.patientelectronicacess31 = count;
    }
    this.result3 = (this.patientelectronicacess31 == undefined ? 0 : this.patientelectronicacess31) + (this.patientelectronicacess32 == undefined ? 0 : this.patientelectronicacess32);
    if (this.checkbox31c == true) {
      this.pdfcheckbox31c = "√"
    }
    else if (this.checkbox31c == false || this.checkbox31c == undefined) {
      this.pdfcheckbox31c = "\t"
    }
  }
  checkboxevent32c(event) {
    this.checkboxvalue32c = event;
    this.checkbox32c = event;
    var count: number = 0;
    if (this.checkbox32c == true || this.checkbox32 == true) {
      count++;
      this.patientelectronicacess32 = count;
    }
    else if (this.checkbox32c == false && this.checkbox32 == false) {
      this.patientelectronicacess32 = count;
    }
    this.result3 = (this.patientelectronicacess31 == undefined ? 0 : this.patientelectronicacess31) + (this.patientelectronicacess32 == undefined ? 0 : this.patientelectronicacess32);
    if (this.checkbox32c == true) {
      this.pdfcheckbox32c = "√"
    }
    else if (this.checkbox32c == false || this.checkbox32c == undefined) {
      this.pdfcheckbox32c = "\t"
    }
  }
  checkboxevent41(event) {
    this.checkboxvalue41 = event;
    this.checkbox41 = event;
    var count: number = 0;
    if (this.percentage41 > 60.0 || this.checkbox41 == true) {
      count++;
      this.patientelectronicacess41 = count;
    }
    else {
      this.patientelectronicacess41 = count;
    }
    this.result4 = this.patientelectronicacess41 + this.patientelectronicacess42 + this.patientelectronicacess43;
    if (this.checkbox41 == true) {
      this.pdfcheckbox41 = "√"
    }
    else if (this.checkbox41 == false || this.checkbox41 == undefined) {
      this.pdfcheckbox41 = "\t"
    }
  }
  checkboxevent42(event) {
    this.checkboxvalue42 = event;
    this.checkbox42 = event;
    var count: number = 0;
    if (this.percentage42 > 60.0 || this.checkbox42 == true) {
      count++;
      this.patientelectronicacess42 = count;
    }
    else {
      this.patientelectronicacess42 = count;
    }
    this.result4 = this.patientelectronicacess41 + this.patientelectronicacess42 + this.patientelectronicacess43;
    if (this.checkbox42 == true) {
      this.pdfcheckbox42 = "√"
    }
    else if (this.checkbox42 == false || this.checkbox42 == undefined) {
      this.pdfcheckbox42 = "\t"
    }
  }
  checkboxevent43(event) {
    this.checkboxvalue43 = event;
    this.checkbox43 = event;
    var count: number = 0;
    if (this.percentage43 > 60.0 || this.checkbox43 == true) {
      count++;
      this.patientelectronicacess43 = count;
    }
    else {
      this.patientelectronicacess43 = count;
    }
    this.result4 = this.patientelectronicacess41 + this.patientelectronicacess42 + this.patientelectronicacess43;
    if (this.checkbox43 == true) {
      this.pdfcheckbox43 = "√"
    }
    else if (this.checkbox43 == false || this.checkbox43 == undefined) {
      this.pdfcheckbox43 = "\t"
    }
  }
  checkboxevent51(event) {
    this.checkboxvalue51 = event;
    this.checkbox51 = event;
    var count: number = 0;
    if (this.percentage51 > 80.0 || this.checkbox51 == true) {
      count++;
      this.patientelectronicacess51 = count;
    }
    else {
      this.patientelectronicacess51 = count;
    }
    this.result5 = this.patientelectronicacess51 + this.patientelectronicacess52;
    if (this.checkbox51 == true) {
      this.pdfcheckbox51 = "√"
    }
    else if (this.checkbox51 == false || this.checkbox51 == undefined) {
      this.pdfcheckbox51 = "\t"
    }
  }
  checkboxevent52(event) {
    this.checkboxvalue52 = event;

    this.checkbox52 = event;
    var count: number = 0;
    if (this.percentage52 > 35.0 || this.checkbox52 == true) {
      count++;
      this.patientelectronicacess52 = count;
    }
    else {
      this.patientelectronicacess52 = count;
    }
    this.result5 = this.patientelectronicacess51 + this.patientelectronicacess52;
    if (this.checkbox52 == true) {
      this.pdfcheckbox52 = "√"
    }
    else if (this.checkbox52 == false || this.checkbox52 == undefined) {
      this.pdfcheckbox52 = "\t"
    }
  }
  checkboxevent61(event) {
    this.checkboxvalue61 = event;

    this.checkbox61 = event;
    var count: number = 0;
    if (this.percentage61 > 10.0 || this.checkbox61 == true) {
      count++;
      this.patientelectronicacess61 = count;
    }
    else {
      this.patientelectronicacess61 = count;
    }
    this.result6 = this.patientelectronicacess61 + this.patientelectronicacess62 + this.patientelectronicacess63;
    if (this.checkbox61 == true) {
      this.pdfcheckbox61 = "√"
    }
    else if (this.checkbox61 == false || this.checkbox61 == undefined) {
      this.pdfcheckbox61 = "\t"
    }
  }
  checkboxevent62(event) {
    this.checkboxvalue62 = event;

    this.checkbox62 = event;
    var count: number = 0;
    if (this.percentage62 > 25.0 || this.checkbox62 == true) {
      count++;
      this.patientelectronicacess62 = count;
    }
    else {
      this.patientelectronicacess62 = count;
    }
    this.result6 = this.patientelectronicacess61 + this.patientelectronicacess62 + this.patientelectronicacess63;
    if (this.checkbox62 == true) {
      this.pdfcheckbox62 = "√"
    }
    else if (this.checkbox62 == false || this.checkbox62 == undefined) {
      this.pdfcheckbox62 = "\t"
    }
  }
  checkboxevent63(event) {
    this.checkboxvalue63 = event;

    this.checkbox63 = event;
    var count: number = 0;
    if (this.percentage63 > 5.0 || this.checkbox63 == true) {
      count++;
      this.patientelectronicacess63 = count;
    }
    else {
      this.patientelectronicacess63 = count;
    }
    this.result6 = this.patientelectronicacess61 + this.patientelectronicacess62 + this.patientelectronicacess63;
    if (this.checkbox63 == true) {
      this.pdfcheckbox63 = "√"
    }
    else if (this.checkbox63 == false || this.checkbox63 == undefined) {
      this.pdfcheckbox63 = "\t"
    }
  }
  checkboxevent71(event) {
    this.checkboxvalue71 = event;

    this.checkbox71 = event;
    var count: number = 0;
    if (this.percentage71 > 50.0 || this.checkbox71 == true) {
      count++;
      this.patientelectronicacess71 = count;
    }
    else {
      this.patientelectronicacess71 = count;
    }
    this.result7 = this.patientelectronicacess71 + this.patientelectronicacess72 + this.patientelectronicacess73;
    if (this.checkbox71 == true) {
      this.pdfcheckbox71 = "√"
    }
    else if (this.checkbox71 == false || this.checkbox71 == undefined) {
      this.pdfcheckbox71 = "\t"
    }
  }
  checkboxevent72(event) {
    this.checkboxvalue72 = event;

    this.checkbox72 = event;
    var count: number = 0;
    if (this.percentage72 > 40.0 || this.checkbox72 == true) {
      count++;
      this.patientelectronicacess72 = count;
    }
    else {
      this.patientelectronicacess72 = count;
    }
    this.result7 = this.patientelectronicacess71 + this.patientelectronicacess72 + this.patientelectronicacess73;
    if (this.checkbox72 == true) {
      this.pdfcheckbox72 = "√"
    }
    else if (this.checkbox72 == false || this.checkbox72 == undefined) {
      this.pdfcheckbox72 = "\t"
    }
    //this.onSubmitMUReport();
  }
  checkboxevent73(event) {
    this.checkboxvalue73 = event;

    this.checkbox73 = event;
    var count: number = 0;
    if (this.percentage73 > 80.0 || this.checkbox73 == true) {
      count++;
      this.patientelectronicacess73 = count;
    }
    else {
      this.patientelectronicacess73 = count;
    }
    this.result7 = this.patientelectronicacess71 + this.patientelectronicacess72 + this.patientelectronicacess73;
    if (this.checkbox73 == true) {
      this.pdfcheckbox73 = "√"
    }
    else if (this.checkbox73 == false || this.checkbox73 == undefined) {
      this.pdfcheckbox73 = "\t"
    }
    //this.onSubmitMUReport();
  }
  checkboxevent31(event) {
    this.checkboxvalue31 = event;

    this.checkbox31 = event;
    var count: number = 0;
    if (this.checkbox31 == true) {
      count++;
      this.patientelectronicacess31 = count;
    }
    else {
      this.patientelectronicacess31 = count;
    }
    this.result3 = (this.patientelectronicacess31 == undefined ? 0 : this.patientelectronicacess31) + (this.patientelectronicacess32 == undefined ? 0 : this.patientelectronicacess32);
    if (this.checkbox31 == true) {
      this.pdfcheckbox31 = "√"
    }
    else if (this.checkbox31 == false || this.checkbox31 == undefined) {
      this.pdfcheckbox31 = "\t"
    }
    //this.onSubmitMUReport();
  }
  checkboxevent32(event) {
    this.checkboxvalue32 = event;

    this.checkbox32 = event;
    var count: number = 0;
    if (this.checkbox32 == true) {
      count++;
      this.patientelectronicacess32 = count;
    }
    else {
      this.patientelectronicacess32 = count;
    }
    this.result3 = (this.patientelectronicacess31 == undefined ? 0 : this.patientelectronicacess31) + (this.patientelectronicacess32 == undefined ? 0 : this.patientelectronicacess32);
    if (this.checkbox32 == true) {
      this.pdfcheckbox32 = "√"
    }
    else if (this.checkbox32 == false || this.checkbox32 == undefined) {
      this.pdfcheckbox32 = "\t"
    }
    //this.onSubmitMUReport();
  }
  checkboxevent81c(event) {
    this.checkboxvalue81c = event;
    this.checkbox81c = event;
    var count: number = 0;
    if (this.checkbox81c == true || this.checkbox81 == true) {
      count++;
      this.patientelectronicacess81 = count;
    }
    else if (this.checkbox81c == false && this.checkbox81 == false) {
      this.patientelectronicacess81 = count;
    }
    this.result8 = (this.patientelectronicacess81 == undefined ? 0 : this.patientelectronicacess81) + (this.patientelectronicacess82 == undefined ? 0 : this.patientelectronicacess82) + (this.patientelectronicacess83 == undefined ? 0 : this.patientelectronicacess83) + (this.patientelectronicacess84 == undefined ? 0 : this.patientelectronicacess84) + (this.patientelectronicacess85 == undefined ? 0 : this.patientelectronicacess85);
    if (this.checkbox81c == true) {
      this.pdfcheckbox81c = "√"
    }
    else if (this.checkbox81c == false || this.checkbox81c == undefined) {
      this.pdfcheckbox81c = "\t"
    }
    //this.onSubmitMUReport();
  }
  checkboxevent82c(event) {
    this.checkboxvalue82c = event;
    this.checkbox82c = event;
    var count: number = 0;
    if (this.checkbox82c == true || this.checkbox82 == true) {
      count++;
      this.patientelectronicacess82 = count;
    }
    else if (this.checkbox82c == false && this.checkbox82 == false) {
      this.patientelectronicacess82 = count;
    }
    this.result8 = (this.patientelectronicacess81 == undefined ? 0 : this.patientelectronicacess81) + (this.patientelectronicacess82 == undefined ? 0 : this.patientelectronicacess82) + (this.patientelectronicacess83 == undefined ? 0 : this.patientelectronicacess83) + (this.patientelectronicacess84 == undefined ? 0 : this.patientelectronicacess84) + (this.patientelectronicacess85 == undefined ? 0 : this.patientelectronicacess85);
    if (this.checkbox82c == true) {
      this.pdfcheckbox82c = "√"
    }
    else if (this.checkbox82c == false || this.checkbox82c == undefined) {
      this.pdfcheckbox82c = "\t"
    }
    //this.onSubmitMUReport();
  }
  checkboxevent83c(event) {
    this.checkboxvalue83c = event;
    this.checkbox83c = event;
    var count: number = 0;
    if (this.checkbox83c == true || this.checkbox83 == true) {
      count++;
      this.patientelectronicacess83 = count;
    }
    else if (this.checkbox83c == false && this.checkbox83 == false) {
      this.patientelectronicacess83 = count;
    }
    this.result8 = (this.patientelectronicacess81 == undefined ? 0 : this.patientelectronicacess81) + (this.patientelectronicacess82 == undefined ? 0 : this.patientelectronicacess82) + (this.patientelectronicacess83 == undefined ? 0 : this.patientelectronicacess83) + (this.patientelectronicacess84 == undefined ? 0 : this.patientelectronicacess84) + (this.patientelectronicacess85 == undefined ? 0 : this.patientelectronicacess85);
    if (this.checkbox83c == true) {
      this.pdfcheckbox83c = "√"
    }
    else if (this.checkbox83c == false || this.checkbox83c == undefined) {
      this.pdfcheckbox83c = "\t"
    }
    //this.onSubmitMUReport();
  }
  checkboxevent84c(event) {
    this.checkboxvalue84c = event;
    this.checkbox84c = event;
    var count: number = 0;
    if (this.checkbox84c == true || this.checkbox84 == true) {
      count++;
      this.patientelectronicacess84 = count;
    }
    else if (this.checkbox84c == false && this.checkbox84 == false) {
      this.patientelectronicacess84 = count;
    }
    this.result8 = (this.patientelectronicacess81 == undefined ? 0 : this.patientelectronicacess81) + (this.patientelectronicacess82 == undefined ? 0 : this.patientelectronicacess82) + (this.patientelectronicacess83 == undefined ? 0 : this.patientelectronicacess83) + (this.patientelectronicacess84 == undefined ? 0 : this.patientelectronicacess84) + (this.patientelectronicacess85 == undefined ? 0 : this.patientelectronicacess85);
    if (this.checkbox84c == true) {
      this.pdfcheckbox84c = "√"
    }
    else if (this.checkbox84c == false || this.checkbox84c == undefined) {
      this.pdfcheckbox84c = "\t"
    }
    //this.onSubmitMUReport();
  }
  checkboxevent85c(event) {
    this.checkboxvalue85c = event;
    this.checkbox85c = event;
    var count: number = 0;
    if (this.checkbox85c == true || this.checkbox85 == true) {
      count++;
      this.patientelectronicacess85 = count;
    }
    else if (this.checkbox85c == false && this.checkbox85 == false) {
      this.patientelectronicacess85 = count;
    }
    this.result8 = (this.patientelectronicacess81 == undefined ? 0 : this.patientelectronicacess81) + (this.patientelectronicacess82 == undefined ? 0 : this.patientelectronicacess82) + (this.patientelectronicacess83 == undefined ? 0 : this.patientelectronicacess83) + (this.patientelectronicacess84 == undefined ? 0 : this.patientelectronicacess84) + (this.patientelectronicacess85 == undefined ? 0 : this.patientelectronicacess85);
    if (this.checkbox85c == true) {
      this.pdfcheckbox85c = "√"
    }
    else if (this.checkbox85c == false || this.checkbox85c == undefined) {
      this.pdfcheckbox85c = "\t"
    }
    //this.onSubmitMUReport();
  }
  checkboxevent81(event) {
    this.checkboxvalue81 = event;

    this.checkbox81 = event;
    var count: number = 0;
    if (this.checkbox81 == true) {
      count++;
      this.patientelectronicacess81 = count;
    }
    else {
      this.patientelectronicacess81 = count;
    }
    this.result8 = (this.patientelectronicacess81 == undefined ? 0 : this.patientelectronicacess81) + (this.patientelectronicacess82 == undefined ? 0 : this.patientelectronicacess82) + (this.patientelectronicacess83 == undefined ? 0 : this.patientelectronicacess83) + (this.patientelectronicacess84 == undefined ? 0 : this.patientelectronicacess84) + (this.patientelectronicacess85 == undefined ? 0 : this.patientelectronicacess85);
    if (this.checkbox81 == true) {
      this.pdfcheckbox81 = "√"
    }
    else if (this.checkbox81 == false || this.checkbox81 == undefined) {
      this.pdfcheckbox81 = "\t"
    }
    //this.onSubmitMUReport();
  }
  checkboxevent82(event) {
    this.checkboxvalue82 = event;

    this.checkbox82 = event;
    var count: number = 0;
    if (this.checkbox82 == true) {
      count++;
      this.patientelectronicacess82 = count;
    }
    else {
      this.patientelectronicacess82 = count;
    }
    this.result8 = (this.patientelectronicacess81 == undefined ? 0 : this.patientelectronicacess81) + (this.patientelectronicacess82 == undefined ? 0 : this.patientelectronicacess82) + (this.patientelectronicacess83 == undefined ? 0 : this.patientelectronicacess83) + (this.patientelectronicacess84 == undefined ? 0 : this.patientelectronicacess84) + (this.patientelectronicacess85 == undefined ? 0 : this.patientelectronicacess85);
    if (this.checkbox82 == true) {
      this.pdfcheckbox82 = "√"
    }
    else if (this.checkbox82 == false || this.checkbox82 == undefined) {
      this.pdfcheckbox82 = "\t"
    }
    //this.onSubmitMUReport();
  }
  checkboxevent83(event) {
    this.checkboxvalue83 = event;

    this.checkbox83 = event;
    var count: number = 0;
    if (this.checkbox83 == true) {
      count++;
      this.patientelectronicacess83 = count;
    }
    else {
      this.patientelectronicacess83 = count;
    }
    this.result8 = (this.patientelectronicacess81 == undefined ? 0 : this.patientelectronicacess81) + (this.patientelectronicacess82 == undefined ? 0 : this.patientelectronicacess82) + (this.patientelectronicacess83 == undefined ? 0 : this.patientelectronicacess83) + (this.patientelectronicacess84 == undefined ? 0 : this.patientelectronicacess84) + (this.patientelectronicacess85 == undefined ? 0 : this.patientelectronicacess85);
    if (this.checkbox83 == true) {
      this.pdfcheckbox83 = "√"
    }
    else if (this.checkbox83 == false || this.checkbox83 == undefined) {
      this.pdfcheckbox83 = "\t"
    }
    //this.onSubmitMUReport();
  }
  checkboxevent84(event) {
    this.checkboxvalue84 = event;

    this.checkbox84 = event;
    var count: number = 0;
    if (this.checkbox84 == true) {
      count++;
      this.patientelectronicacess84 = count;
    }
    else {
      this.patientelectronicacess84 = count;
    }
    this.result8 = (this.patientelectronicacess81 == undefined ? 0 : this.patientelectronicacess81) + (this.patientelectronicacess82 == undefined ? 0 : this.patientelectronicacess82) + (this.patientelectronicacess83 == undefined ? 0 : this.patientelectronicacess83) + (this.patientelectronicacess84 == undefined ? 0 : this.patientelectronicacess84) + (this.patientelectronicacess85 == undefined ? 0 : this.patientelectronicacess85);
    if (this.checkbox84 == true) {
      this.pdfcheckbox84 = "√"
    }
    else if (this.checkbox84 == false || this.checkbox84 == undefined) {
      this.pdfcheckbox84 = "\t"
    }
    //this.onSubmitMUReport();
  }
  checkboxevent85(event) {
    this.checkboxvalue85 = event;

    this.checkbox85 = event;
    var count: number = 0;
    if (this.checkbox85 == true) {
      count++;
      this.patientelectronicacess85 = count;
    }
    else {
      this.patientelectronicacess85 = count;
    }
    this.result8 = (this.patientelectronicacess81 == undefined ? 0 : this.patientelectronicacess81) + (this.patientelectronicacess82 == undefined ? 0 : this.patientelectronicacess82) + (this.patientelectronicacess83 == undefined ? 0 : this.patientelectronicacess83) + (this.patientelectronicacess84 == undefined ? 0 : this.patientelectronicacess84) + (this.patientelectronicacess85 == undefined ? 0 : this.patientelectronicacess85);
    if (this.checkbox85 == true) {
      this.pdfcheckbox85 = "√"
    }
    else if (this.checkbox85 == false || this.checkbox85 == undefined) {
      this.pdfcheckbox85 = "\t"
    }
    //this.onSubmitMUReport();
  }
  //stage2 checkbox
  checkboxevent01(event) {
    this.checkbox01 = event;
    this.checkboxValue01 = event;
    if (this.checkbox01 == true) {
      this.pdfcheckbox01 = "√"
    }
    else if (this.checkbox01 == false || this.checkbox01 == undefined) {
      this.pdfcheckbox01 = "\t"
    }

  }
  checkboxevent021(event) {

    this.checkbox021 = event;
    this.checkboxValue021 = event;
    if (this.checkbox021 == true) {
      this.pdfcheckbox021 = "√"
    }
    else if (this.checkbox021 == false || this.checkbox021 == undefined) {
      this.pdfcheckbox021 = "\t"
    }

  }
  checkboxevent022(event) {

    this.checkbox022 = event;
    this.checkboxValue022 = event;
    if (this.checkbox022 == true) {
      this.pdfcheckbox022 = "√"
    }
    else if (this.checkbox022 == false || this.checkbox022 == undefined) {
      this.pdfcheckbox022 = "\t"
    }

  }
  checkboxevent031(event) {
    this.checkboxValue031 = event;
    this.checkbox031 = event;
    if (this.checkbox031 == true) {
      this.pdfcheckbox031 = "√"
    }
    else if (this.checkbox031 == false || this.checkbox031 == undefined) {
      this.pdfcheckbox031 = "\t"
    }

  }
  checkboxevent032(event) {
    this.checkboxValue032 = event;
    this.checkbox032 = event;
    if (this.checkbox032 == true) {
      this.pdfcheckbox032 = "√"
    }
    else if (this.checkbox032 == false || this.checkbox032 == undefined) {
      this.pdfcheckbox032 = "\t"
    }

  }
  checkboxevent033(event) {
    this.checkboxValue033 = event;
    this.checkbox033 = event;
    if (this.checkbox033 == true) {
      this.pdfcheckbox033 = "√"
    }
    else if (this.checkbox033 == false || this.checkbox033 == undefined) {
      this.pdfcheckbox033 = "\t"
    }

  }
  checkboxevent04(event) {
    this.checkboxValue04 = event;
    this.checkbox04 = event;
    if (this.checkbox04 == true) {
      this.pdfcheckbox04 = "√"
    }
    else if (this.checkbox04 == false || this.checkbox04 == undefined) {
      this.pdfcheckbox04 = "\t"
    }

  }
  checkboxevent05(event) {
    this.checkboxValue05 = event;
    this.checkbox05 = event;
    if (this.checkbox05 == true) {
      this.pdfcheckbox05 = "√"
    }
    else if (this.checkbox05 == false || this.checkbox05 == undefined) {
      this.pdfcheckbox05 = "\t"
    }

  }
  checkboxevent06(event) {
    this.checkboxValue06 = event;
    this.checkbox06 = event;
    if (this.checkbox06 == true) {
      this.pdfcheckbox06 = "√"
    }
    else if (this.checkbox06 == false || this.checkbox06 == undefined) {
      this.pdfcheckbox06 = "\t"
    }

  }
  checkboxevent07(event) {
    this.checkboxValue07 = event;
    this.checkbox07 = event;
    if (this.checkbox07 == true) {
      this.pdfcheckbox07 = "√"
    }
    else if (this.checkbox07 == false || this.checkbox07 == undefined) {
      this.pdfcheckbox07 = "\t"
    }

  }
  checkboxevent081(event) {
    this.checkboxValue081 = event;
    this.checkbox081 = event;
    if (this.checkbox081 == true) {
      this.pdfcheckbox081 = "√"
    }
    else if (this.checkbox081 == false || this.checkbox081 == undefined) {
      this.pdfcheckbox081 = "\t"
    }

  }
  checkboxevent082(event) {

    this.checkbox082 = event;
    this.checkboxValue082 = event;
    if (this.checkbox082 == true) {
      this.pdfcheckbox082 = "√"
    }
    else if (this.checkbox082 == false || this.checkbox082 == undefined) {
      this.pdfcheckbox082 = "\t"
    }

  }
  checkboxevent09(event) {
    this.checkboxValue09 = event;
    this.checkbox09 = event;
    if (this.checkbox09 == true) {
      this.pdfcheckbox09 = "√"
    }
    else if (this.checkbox09 == false || this.checkbox09 == undefined) {
      this.pdfcheckbox09 = "\t"
    }

  }
  checkboxevent0101(event) {
    this.checkboxValue0101 = event;
    this.checkbox0101 = event;
    if (this.checkbox0101 == true) {
      this.pdfcheckbox0101 = "√"
    }
    else if (this.checkbox0101 == false || this.checkbox0101 == undefined) {
      this.pdfcheckbox0101 = "\t"
    }

  }
  checkboxevent0102(event) {
    this.checkboxValue0102 = event;
    this.checkbox0102 = event;
    if (this.checkbox0102 == true) {
      this.pdfcheckbox0102 = "√"
    }
    else if (this.checkbox0102 == false || this.checkbox0102 == undefined) {
      this.pdfcheckbox0102 = "\t"
    }

  }
  checkboxevent0103(event) {
    this.checkboxValue0103 = event;
    this.checkbox0103 = event;
    if (this.checkbox0103 == true) {
      this.pdfcheckbox0103 = "√"
    }
    else if (this.checkbox0103 == false || this.checkbox0103 == undefined) {
      this.pdfcheckbox0103 = "\t"
    }

  }
  getStage3NumeDenomicount(data: any) {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.stage2NumeDenomicount = null;
    this.stage3NumeDenomicount = null;
    this.service.GetNumeDenomicount(data).subscribe(data => {
      if (data.IsSuccess) {
        this.Stage2 = false;
        this.Stage3 = true;
        this.checkboxevent1(this.checkbox1);
        this.checkboxevent2(this.checkbox2);
        this.checkboxevent31(this.checkbox31);
        this.checkboxevent32(this.checkbox32);
        this.checkboxevent31c(this.checkbox31c);
        this.checkboxevent32c(this.checkbox32c);
        this.checkboxevent41(this.checkbox41);
        this.checkboxevent42(this.checkbox42);
        this.checkboxevent43(this.checkbox43);
        this.checkboxevent51(this.checkbox51);
        this.checkboxevent52(this.checkbox52);
        this.checkboxevent61(this.checkbox61);
        this.checkboxevent62(this.checkbox62);
        this.checkboxevent63(this.checkbox63);
        this.checkboxevent71(this.checkbox71);
        this.checkboxevent72(this.checkbox72);
        this.checkboxevent73(this.checkbox73);
        this.checkboxevent81(this.checkbox81);
        this.checkboxevent82(this.checkbox82);
        this.checkboxevent83(this.checkbox83);
        this.checkboxevent84(this.checkbox84);
        this.checkboxevent85(this.checkbox85);
        this.checkboxevent81c(this.checkbox81c);
        this.checkboxevent82c(this.checkbox82c);
        this.checkboxevent83c(this.checkbox83c);
        this.checkboxevent84c(this.checkbox84c);
        this.checkboxevent85c(this.checkbox85c);
        var count: number = 0;

        this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
        this.stage3NumeDenomicount = data.ListResult;
        this.disabledowloadPDF = false;
        for (var val of data.ListResult) {

          if (val.TypeName == '2') {
            this.numerator2 = val.Numerator;
            this.denominator2 = val.Denominator;
            this.percentage2 = val.Percentage;
            //this.checkboxevent2(this.checkbox2);
            var count: number = 0;
            if (this.percentage2 > 60.0 || this.checkbox2 == true) {
              count++;
              this.patientelectronicacess2 = count;
            }
            else {
              this.patientelectronicacess2 = count;
            }
          }
          if (val.TypeName == '4-1') {
            this.numerator41 = val.Numerator;
            this.denominator41 = val.Denominator;
            this.percentage41 = val.Percentage;
            var count: number = 0;
            if (this.percentage41 > 60.0 || this.checkbox41 == true) {
              count++;
              this.patientelectronicacess41 = count;
            }
            else {
              this.patientelectronicacess41 = count;
            }
          }
          if (val.TypeName == '4-2') {
            this.numerator42 = val.Numerator;
            this.denominator42 = val.Denominator;
            this.percentage42 = val.Percentage;
            var count: number = 0;
            if (this.percentage42 > 60.0 || this.checkbox42 == true) {
              count++;
              this.patientelectronicacess42 = count;
            }
            else {
              this.patientelectronicacess42 = count;
            }
          }
          if (val.TypeName == '4-3') {
            this.numerator43 = val.Numerator;
            this.denominator43 = val.Denominator;
            this.percentage43 = val.Percentage;
            var count: number = 0;
            if (this.percentage43 > 60.0 || this.checkbox43 == true) {
              count++;
              this.patientelectronicacess43 = count;
            }
            else {
              this.patientelectronicacess43 = count;
            }
          }
          if (val.TypeName == '5-1') {
            this.numerator51 = val.Numerator;
            this.denominator51 = val.Denominator;
            this.percentage51 = val.Percentage;


            var count: number = 0;
            if (this.percentage51 > 80.0 || this.checkbox51 == true) {
              count++;
              this.patientelectronicacess51 = count;
            }
            else {
              this.patientelectronicacess51 = count;
            }
          }
          if (val.TypeName == '5-2') {
            this.numerator52 = val.Numerator;
            this.denominator52 = val.Denominator;
            this.percentage52 = val.Percentage;
            var count: number = 0;
            if (this.percentage52 > 35.0 || this.checkbox52 == true) {
              count++;
              this.patientelectronicacess52 = count;
            }
            else {
              this.patientelectronicacess52 = count;
            }
          }
          if (val.TypeName == '6-1') {
            this.numerator61 = val.Numerator;
            this.denominator61 = val.Denominator;
            this.percentage61 = val.Percentage;
            var count: number = 0;
            if (this.percentage61 > 10.0 || this.checkbox61 == true) {
              count++;
              this.patientelectronicacess61 = count;
            }
            else {
              this.patientelectronicacess61 = count;
            }
          }
          if (val.TypeName == '6-2') {
            this.numerator62 = val.Numerator;
            this.denominator62 = val.Denominator;
            this.percentage62 = val.Percentage;
            var count: number = 0;
            if (this.percentage62 > 25.0 || this.checkbox62 == true) {
              count++;
              this.patientelectronicacess62 = count;
            }
            else {
              this.patientelectronicacess62 = count;
            }
          }
          if (val.TypeName == '6-3') {
            this.numerator63 = val.Numerator;
            this.denominator63 = val.Denominator;
            this.percentage63 = val.Percentage;
            var count: number = 0;
            if (this.percentage63 > 5.0 || this.checkbox63 == true) {
              count++;
              this.patientelectronicacess63 = count;
            }
            else {
              this.patientelectronicacess63 = count;
            }
          }
          if (val.TypeName == '7-1') {
            this.numerator71 = val.Numerator;
            this.denominator71 = val.Denominator;
            this.percentage71 = val.Percentage;
            var count: number = 0;
            if (this.percentage71 > 50.0 || this.checkbox71 == true) {
              count++;
              this.patientelectronicacess71 = count;
            }
            else {
              this.patientelectronicacess71 = count;
            }
          }
          if (val.TypeName == '7-2') {
            this.numerator72 = val.Numerator;
            this.denominator72 = val.Denominator;
            this.percentage72 = val.Percentage;
            var count: number = 0;
            if (this.percentage72 > 40.0 || this.checkbox72 == true) {
              count++;
              this.patientelectronicacess72 = count;
            }
            else {
              this.patientelectronicacess72 = count;
            }
          }
          if (val.TypeName == '7-3') {
            this.numerator73 = val.Numerator;
            this.denominator73 = val.Denominator;
            this.percentage73 = val.Percentage;
            var count: number = 0;
            if (this.percentage73 > 80.0 || this.checkbox73 == true) {
              count++;
              this.patientelectronicacess73 = count;
            }
            else {
              this.patientelectronicacess73 = count;
            }
          }
          this.customizedspinner = false; $('body').removeClass('loadactive');
        }
      }
      this.result1 = this.patientelectronicacess1 == undefined ? 0 : this.patientelectronicacess1;
      this.result2 = this.patientelectronicacess2 == undefined ? 0 : this.patientelectronicacess2;
      this.result3 = (this.patientelectronicacess31 == undefined ? 0 : this.patientelectronicacess31) + (this.patientelectronicacess32 == undefined ? 0 : this.patientelectronicacess32);
      this.result4 = this.patientelectronicacess41 + this.patientelectronicacess42 + this.patientelectronicacess43;
      this.result5 = this.patientelectronicacess51 + this.patientelectronicacess52;
      this.result6 = this.patientelectronicacess61 + this.patientelectronicacess62 + this.patientelectronicacess63;
      this.result7 = this.patientelectronicacess71 + this.patientelectronicacess72 + this.patientelectronicacess73;
      this.result8 = (this.patientelectronicacess81 == undefined ? 0 : this.patientelectronicacess81) + (this.patientelectronicacess82 == undefined ? 0 : this.patientelectronicacess82) + (this.patientelectronicacess83 == undefined ? 0 : this.patientelectronicacess83) + (this.patientelectronicacess84 == undefined ? 0 : this.patientelectronicacess84) + (this.patientelectronicacess85 == undefined ? 0 : this.patientelectronicacess85);
      this.customizedspinner = false; $('body').removeClass('loadactive');
    });
  }
  Stage3Form() {
    this.muReportForm = this.fb.group({
      strSDate: ['', Validators.required],
      strEDate: ['', Validators.required],
      ProviderId: ['', Validators.required],
      stage_type: ['', Validators.required]
    })
  }

  onSubmitPatientList(req) {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    var Patientreport = {
      "startDate": this.muReportForm.value.strSDate,
      "endDate": this.muReportForm.value.strEDate,
      "ProviderId": this.muReportForm.value.ProviderId,
      "TypeName": req,
    };
    this.getPatientList(Patientreport);
  }

  getPatientList(data: any) {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.mupatientList = [];
    this.mupatientListlength = null;
    this.service.getPatientList(data).subscribe(data => {
      if (data.IsSuccess) {
        this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
        this.mupatientList = data.ListResult;
        this.mupatientListlength = data.ListResult.length;
      }
      else {
        this.mupatientListlength = 0;
      }
      this.customizedspinner = false;
    });
  }
  onSortClick(event) {
    let target = event.currentTarget,
      classList = target.classList;
    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.sortArr('patient_id');
  }

  sortArr(colName: any) {
    this.mupatientList.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }
  onSortClick2(event) {
    let target = event.currentTarget,
      classList = target.classList;

    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.sortArr1('full_name');
  }

  sortArr1(colName: any) {
    this.mupatientList.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }
  onSortClick3(event) {
    let target = event.currentTarget,
      classList = target.classList;
    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.sortArr2('Req_date_format');
  }

  sortArr2(colName: any) {
    this.mupatientList.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }
  onSortClick4(event) {
    let target = event.currentTarget,
      classList = target.classList;
    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.sortArr3('Numerator');
  }

  sortArr3(colName: any) {
    this.mupatientList.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }
  onSortClick21(event) {
    let target = event.currentTarget,
      classList = target.classList;
    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.sortArr22('patient_id');
  }
  sortArr21(colName: any) {
    this.Stage2PatientList.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }

  onSortClick22(event) {
    let target = event.currentTarget,
      classList = target.classList;
    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.sortArr22('full_name');
  }

  sortArr22(colName: any) {
    this.Stage2PatientList.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }

  onSortClick23(event) {
    let target = event.currentTarget,
      classList = target.classList;
    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.sortArr23('display_name');
  }

  sortArr23(colName: any) {
    this.Stage2PatientList.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }

  onSortClick24(event) {
    let target = event.currentTarget,
      classList = target.classList;
    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.sortArr24('Date_Submitted');
  }

  sortArr24(colName: any) {
    this.Stage2PatientList.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }
  onSortClick25(event) {
    let target = event.currentTarget,
      classList = target.classList;
    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.sortArr25('Numerator');
  }

  getProviderList() {
    let req = { "ClinicId": this.authenticationService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
  }

  sortArr25(colName: any) {
    this.Stage2PatientList.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }
}
