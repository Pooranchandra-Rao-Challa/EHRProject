import { Component, ComponentFactoryResolver, ElementRef, ViewChild } from '@angular/core';
import { Accountservice } from 'src/app/_services/account.service';
import { EmailedUrls } from 'src/app/_models/emailed.urls';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-email-urls',
  templateUrl: './emailed.url.component.html',
  styleUrls: ['./emailed.url.component.scss']
})
export class EmailedUrlsComponent {

  @ViewChild('iframe', { static: true })
  iframe: ElementRef;
  doc;
  element;
  constructor(private accountService: Accountservice) {
    this.InitUrls();
  }
  emaildUrls: EmailedUrls[]
  emailedColumns: string[] = ['Name', 'FunctionalName', 'Created'];
  selectedEmail: EmailedUrls = null;
  InitUrls() {
    this.accountService.EmailedUrls().subscribe(resp => {
      if (resp.IsSuccess) {
        this.emaildUrls = resp.ListResult as EmailedUrls[];
      }
    })
  }

  onLoad(iframe) {
    this.doc = iframe.contentDocument || iframe.contentWindow;
  }

  loadHtmlView(pkey: number) {
    this.emaildUrls.forEach((data, i) => {
      if (data.Pkey == pkey) {
        this.selectedEmail = data;
        //if (this.element!=undefined)
          //this.iframe.nativeElement.contentDocument.body.removeChild(this.element)
        this.element = document.createRange().createContextualFragment(this.selectedEmail?.Html);
        this.iframe.nativeElement.contentDocument.body.appendChild(this.element)

      }
    }
    )
  }

  downloadPDF() {

    console.log(this.iframe.nativeElement.contentDocument)
    html2canvas(this.iframe.nativeElement.contentDocument.body).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.html(this.iframe.nativeElement.contentDocument.body.innerHtml);
      PDF.save('angular-demo.pdf');
    });
  }
    // let html1 = '<style>/* patient email template css from here to end of the style*/.patient-invitation {border: 1px solid #979797;border-radius: 18px;margin: 72px auto;width: 801px  }  .patient-invitation table {border-collapse: collapse;margin: -1px;}  .patient-invitation table tfoot tr td {border: 0;border-radius: 0 0 16px 16px;height: 25px;padding: 0 60px;background-color: #41b6a6;}  .patient-invitation table tfoot tr td p {color: #fff;font-family: \'Times New Roman\';font-size: 14px;margin: 0}  .patient-invitation table tbody {width: 100%;}  .patient-invitation table tbody tr td.patient-content {border: 0;padding: 7px 60px;}  .patient-invitation table tbody tr td.patient-content p.content {color: #000;font-family: \'Times New Roman\';font-size: 14px;margin: 0}.patient-invitation table tbody tr td.patient-content p.undersignee {color: #000;font-family: \'Times New Roman\';font-size: 14px;margin: 0;font-weight: bold;}  .patient-invitation table tbody tr td.patient-content p.creds {border: 2px solid #41b6a6;border-radius: 6px;color: #000;font-family: \'Times New Roman\';font-size: 14px;margin: 0 auto;padding: 15px 50px;width: 40%}  .patient-invitation table tbody tr td.patient-content p.creds span {margin: 21% } .patient-invitation table tbody tr td.patient-title {border: 0;padding: 40px 60px 7px}  .patient-invitation table tbody tr td.patient-title p.title {border-bottom-color: #000;border-bottom-style: solid;border-bottom-width: 1px;border-top-color: #000;border-top-style: solid;border-top-width: 1px;font-family: \'Times New Roman\';font-size: 34px;margin: 0;padding: 10px;text-align: center;}  .patient-invitation table tbody tr td.patient-title p.title span {font-weight: bold;text-decoration: underline;}  </style>  <div class="patient-invitation" id="patientinvitation">  <table class="patienttablealignments" style="width:50%;"><thead><tr><td><a href="https://1.ehr.one"><img alt="Logo header mailer" width="680" src="http://localhost:4200/assets/images/logo-header-mailer.png"></a></td></tr></thead><tbody><tr><td class="patient-title"><p class="title"><span class="practice">Burns Dental Group</span> is pleased to offer you access to your Patient Portal through EHR1!</p></td></tr><tr><td class="patient-content"><p class="content">Dear Devid Kumar,</p></td></tr><tr><td class="patient-content"><p class="content">For your convenience we have created your patient portal account for you!</p></td></tr><tr><td class="patient-content"><p class="content">Visit us at<a href="https://1.ehr.one"></a></p></td></tr><tr><td class="patient-content"><p class="content">Please help us keep you in the loop; once logged in, please view your clinical summary via your Messages andbegin taking advantage of all of our services!</p></td></tr><tr><td class="patient-content"><p class="content">Sincerely,</p></td></tr><tr><td class="patient-content"><p class="undersignee">Your EHR1 Support Team</p></td></tr><tr><td class="patient-content"><p class="creds"><span>Username: noxoowji<br><br></span><span>Password: UA7gdgg<br></span></p></td></tr><tr><td class="patient-content"><p class="content">API Access Feature – Access or Link Health Information</p></td></tr><tr><td class="patient-content"><p class="content">Credentials can be used to authenticate to a third-party application if it hasbeen registered with EHR1 and has connected to our public API. For assistance registering new applications,submit a support ticket.</p></td></tr></tbody><tfoot><tr><td><p class="llcfooter">© 2022 EHR One, LLC</p></td></tr></tfoot></table></div>';
    // // let patientDefService: PdfService = new PdfService();
    // // let docDef: InvitationPdf = new InvitationPdf()
    // // patientDefService.generatePdf(docDef.patientInviationDefinition())
    // var PDF = new jsPDF();
    // //var html = htmlToPdfmake(html);
    // //console.log(html1);
    // var parser = new DOMParser();
	  // var doc = parser.parseFromString(html1, 'text/html');
    // var element1 = doc.getElementById("patientinvitation");
    // var element = document.createElement("div");
    // element.innerHTML = html1;

    // // html2canvas(element1, { scale: 3 }).then((canvas) => {
    // //   const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
    // //   const fileWidth = 200;
    // //   const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
    // //   let PDF = new jsPDF('p', 'mm', 'a4',);
    // //   PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 5, fileWidth, generatedImageHeight,);
    // //   PDF.html(html1)
    // //   PDF.save('angular-invoice-pdf-demo.pdf');
    // // });

    // PDF.html(html1)
    // PDF.save('angular-invoice-pdf-demo.pdf');

    // var html2 = htmlToPdfmake(html1,{
    //   imagesByReference:true,
    //   tableAutoSize:true
    // });

    // console.log(html2);
    // html2.content[0].stack[1]["layout"] = "ehrlayout";
    // console.log(html2.content[0].stack[1]);

    // const documentDefinition = {
    //   pageSize: 'A4',
    //   content: html2.content,
    //   images:html2.images,
    //   styles:{
    //     'patient-invitation':{
    //       width:'400px',
    //       height:'100%'
    //     },
    //     'patienttablealignments':{
    //       border:0
    //     },
    //     'table-tr':{
    //       border: 0
    //     },
    //     'table-td':{
    //       border: 0
    //     },
    //     'practice':{
    //       fontSize: 34
    //     }
    //   }
    // };
    // pdfMake.tableLayouts = {
    //   ehrlayout: {
		// 		hLineWidth: function (i, node) {
		// 			return (i === 0 || i=== 1 || i === node.table.body.length) ? 1 : 0;
		// 		},
		// 		vLineWidth: function (i, node) {
		// 			return (i === 0 || i === node.table.widths.length) ? 1 : 0;
		// 		},
		// 		hLineColor: function (i, node) {
		// 			return (i === 0 || i === node.table.body.length) ? '#41b6a6' : 'gray';
		// 		},
		// 		vLineColor: function (i, node) {
		// 			return (i === 0 || i === node.table.widths.length) ? '#41b6a6' : 'gray';
		// 		},
		// 		// hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
		// 		// vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
		// 		paddingLeft: function(i, node) {
    //       //return (i === 0 || i === node.table.widths.length) ? '0' : '4';
    //       console.log(i, " ",node);

    //       return 0;
    //     },
		// 		paddingRight: function(i, node) {
    //       return (i === 0 || i=== 1 || i === node.table.body.length) ? 0 : 4;
    //       return 0;
    //     },
		// 		paddingTop: function(i, node) {
    //       return (i === 0 || i === node.table.widths.length) ? 0 : 4;
    //     },
		// 		paddingBottom: function(i, node) {
    //       return (i === 0 || i === node.table.widths.length) ? 0 : 4;
    //     },
		// 		// fillColor: function (rowIndex, node, columnIndex) { return null; }
		// 	}
    // };
    // pdfMake.createPdf(documentDefinition).download("test.pdf");

  // }
}
