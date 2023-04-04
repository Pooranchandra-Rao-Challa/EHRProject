import { UtilityService } from 'src/app/_services/utiltiy.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as xml2js from 'xml2js';
import { DR_FIRSR_VERESION, DR_FIRST_PATINET_URL, DR_FIRST_PROVIDER_URL_PARAMS, DR_FIRST_SSO_URL, DR_FIRST_URL, environment } from "src/environments/environment";
import { DatePipe } from "@angular/common";
import { DrFirstProviderParams } from '../_models/_provider/practiceProviders';
import { Observable } from 'rxjs';
import { Md5 } from "md5-typescript";
import { DrfirstUrlChanged } from '../_navigations/provider.layout/view.notification.service';
import { ProviderPatient } from '../_models/_provider/Providerpatient';



@Injectable()
export class DrfirstService {
  httpRequestHeaders: HttpHeaders;
  httpRequestParams: HttpParams;
  parser = new xml2js.Parser({ strict: false, trim: true });
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService,
    private utilityService: UtilityService,
    private drfirstUrlChanged: DrfirstUrlChanged,
  ) {
    this.initHeaders();
    console.log(Response);
    console.log(this.parser);
    this.parser.parseString(Response, (err, result) => {
      console.log(result.RCEXTRESPONSE.RESPONSE[0].PATIENTLIST[0].PATIENT[0].RCOPIAID[0]);
      console.log(result.RCEXTRESPONSE.RESPONSE[0].PATIENTLIST[0].PATIENT[0].EXTERNALID[0]);
      console.log(result.RCEXTRESPONSE.RESPONSE[0].PATIENTLIST[0].PATIENT[0].STATUS[0]);
      console.log(result.RCEXTRESPONSE.RESPONSE[0].STATUS[0]);
      console.log(result);
    })
    console.log(USAPhoneFormat('4938493883'))
  }

  initHeaders() {
    this.httpRequestHeaders = new HttpHeaders();
    this.httpRequestHeaders = this.httpRequestHeaders.append('Content-Type', 'text/xml').append('Accept', 'text/xml')
  }

  public SendPatient(patient: ProviderPatient) {
     var urlparams: string = ""
      var providerId = this.authenticationService.userValue.ProviderId;
    this.utilityService.DrfirstProviderParams(providerId, null).subscribe(resp => {
      if (resp.IsSuccess) {
        var drfirstProviderParams = resp.Result as DrFirstProviderParams;
        console.log(drfirstProviderParams);
        let patientXml = SendPatientXML(drfirstProviderParams, patient, this.datePipe);
        console.log(patientXml);
        return;
        this.SubmitRequest('xml=' + encodeURI(patientXml)).subscribe(resp => {
          console.log(resp);
          this.parser.parseString(resp, (err, result) => {
            console.log(result);

            let xmltoJsonData = result;
          });
        })
      }
    })





  }

  public SendMedication(provider, patient, medication, deleted) {
    let sendMedicationXML = SendMedicationXML(provider, patient, medication, deleted);
    this.SubmitRequest(sendMedicationXML).subscribe(resp => {
      console.log(resp);
    })
  }

  public SentDiagnosisForSnomed(provider, patient, diagnoses) {
    let sendMedicationXML = SentDiagnosisXMLForSnomed(provider, patient, diagnoses);
    this.SubmitRequest(sendMedicationXML).subscribe(resp => {
      console.log(resp);
    })
  }

  public SendDianosisForNonSnomed(provider, patient, diagnoses) {
    let sendMedicationXML = SendDianosisXMLForNonSnomed(provider, patient, diagnoses);
    this.SubmitRequest(sendMedicationXML).subscribe(resp => {
      console.log(resp);
    })
  }

  public SyncPrescription(provider, patient) {
    let sendMedicationXML = SyncPrescriptionXML(provider, patient);
    this.SubmitRequest(sendMedicationXML).subscribe(resp => {
      console.log(resp);
    })
  }


  private SubmitRequest(xmlpayload): Observable<any> {
    let eprescribeServer = environment.EPRESCRIBE_SERVER_STAGE101
    return this.http.post(eprescribeServer, xmlpayload,
      { headers: this.httpRequestHeaders, observe: 'body', responseType: 'json' })

  }



  // public ProviderUrl() {
  //   if (this.authenticationService.isProvider) {
  //     var urlparams: string = ""
  //     var providerId = this.authenticationService.userValue.ProviderId;      //var md5 = new Md5();
  //     this.utilityService.DrfirstProviderParams(providerId).subscribe(resp => {
  //       if (resp.IsSuccess) {
  //         var drfirstProviderParams = resp.Result as DrFirstProviderParams;
  //         if (drfirstProviderParams.EprescribeFrom == 'drfirst') {
  //           urlparams = DR_FIRST_PROVIDER_URL_PARAMS(
  //             drfirstProviderParams.VendorUserName,
  //             drfirstProviderParams.RcopiaUserName,
  //             drfirstProviderParams.RcopiaUserId,
  //             drfirstProviderParams.RcopiaUserExternalId) + this.gmtTime()
  //           var hashvalue = Md5.init(`${urlparams}${drfirstProviderParams.VendorPassword}`).toUpperCase()
  //           urlparams = DR_FIRST_URL(urlparams, hashvalue);
  //           this.drfirstUrlChanged.sendData(DR_FIRST_SSO_URL(urlparams));
  //         }
  //       }
  //     })
  //   }
  // }

  public ProviderUrl() {



    if (this.authenticationService.isProvider) {
      var urlparams: string = ""
      var providerId = this.authenticationService.userValue.ProviderId;
      var patientId = this.authenticationService.viewModel.Patient?.PatientId  //var md5 = new Md5();
      console.log(patientId);

      this.utilityService.DrfirstProviderParams(providerId, patientId).subscribe(resp => {
        if (resp.IsSuccess) {
          var drfirstProviderParams = resp.Result as DrFirstProviderParams;
          console.log(drfirstProviderParams);

          if (drfirstProviderParams.EprescribeFrom == 'drfirst') {
            urlparams = DR_FIRST_PROVIDER_URL_PARAMS(
              drfirstProviderParams.VendorUserName,
              drfirstProviderParams.RcopiaUserName,
              drfirstProviderParams.RcopiaUserId,
              drfirstProviderParams.RcopiaUserExternalId) + this.gmtTime();

            if (drfirstProviderParams.DrFirstPatientId)
              urlparams = DR_FIRST_PATINET_URL(
                drfirstProviderParams.VendorUserName,
                drfirstProviderParams.RcopiaUserName,
                drfirstProviderParams.RcopiaUserId,
                drfirstProviderParams.RcopiaUserExternalId,
                drfirstProviderParams.DrFirstPatientId + '') + this.gmtTime();

            var hashvalue = Md5.init(`${urlparams}${drfirstProviderParams.VendorPassword}`).toUpperCase()
            urlparams = DR_FIRST_URL(urlparams, hashvalue);
            this.drfirstUrlChanged.sendData(DR_FIRST_SSO_URL(urlparams));

          }
        }
      })
    }
  }

  gmtTime(): string {

    var GMTTime = new Date();
    return this.datePipe.transform(GMTTime, "MMddyyHHmmss", "UTC");
  }
  private ProviderDrfirstInfo() {

  }
}


export const Response = `<RCExtResponse version="2.45">
<TraceInformation>
<RequestMessageID/>
<ResponseMessageID>SB-04042023043204878-56859</ResponseMessageID>
<DestinationURL>http://engine201.staging.drfirst.com/servlet/rcopia.servlet.EngineServlet</DestinationURL>
<RequestTimestamp>04/04/2023 04:32:03</RequestTimestamp>
<ResponseStartTimestamp>04/04/2023 04:32:04</ResponseStartTimestamp>
<RcopiaServerName>enginesb01u_51001</RcopiaServerName>
</TraceInformation>
<Request>
<Caller>
<VendorName>avendor18562</VendorName>
<VendorPassword>xxxxxxxx</VendorPassword>
</Caller>
<SystemName>avendor18562</SystemName>
<RcopiaPracticeUsername>eh4114</RcopiaPracticeUsername>
<Request>
<Command>send_patient</Command>
<PatientList>
<Patient>
<ExternalID>marcoasugger</ExternalID>
<FirstName>Marcoa</FirstName>
<LastName>Sugger</LastName>
<DOB>05/01/1965</DOB>
<Sex>m</Sex>
<HomePhone>419-855-3155</HomePhone>
<Address1>2645 Mulberry Lane</Address1>
<Address2/>
<City>Toledo</City>
<State>OH</State>
<Zip>43605</Zip>
</Patient>
</PatientList>
</Request>
</Request>
<Response>
<ServerIPAddress>engine201.staging.drfirst.com:80</ServerIPAddress>
<Status>ok</Status>
<PatientList>
<Patient>
<RcopiaID>26154332620</RcopiaID>
<ExternalID>marcoasugger</ExternalID>
<Status>created</Status>
</Patient>
</PatientList>
</Response>
<ResponseEndTimestamp>04/04/2023 04:32:04</ResponseEndTimestamp>
</RCExtResponse>`
/**<RCExtRequest version = "2.45">
    <Caller>
        <VendorName>avendor18562</VendorName>
        <VendorPassword>463s1hbf</VendorPassword>
    </Caller>
    <SystemName>avendor18562</SystemName>
    <RcopiaPracticeUsername>eh4114</RcopiaPracticeUsername>

    <Request>
        <Command>send_patient</Command>
        <PatientList>
      <Patient>
          <ExternalID>marcoasugger</ExternalID>
          <FirstName>Marcoa</FirstName>
          <LastName>Sugger</LastName>
          <DOB>05/01/1965</DOB>
          <Sex>m</Sex>
          <HomePhone>419-855-3155</HomePhone>
          <Address1>2645 Mulberry Lane</Address1>
          <Address2></Address2>
          <City>Toledo</City>
          <State>OH</State>
          <Zip>43605</Zip>
      </Patient>
    </PatientList>
    </Request>
</RCExtRequest> */
export const USAPhoneFormat = (phonenumber) => {
  var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (phoneRegex.test(phonenumber)) {
    return phonenumber.replace(phoneRegex, "($1) $2-$3");
  } else {
    // Invalid phone number
  }
}
export const SendPatientXML = (provider: DrFirstProviderParams, patient: ProviderPatient, datePipe) => `<?xml version="1.0" encoding="UTF-8"?>
  <RCExtRequest version = "${DR_FIRSR_VERESION}">
      <Caller>
          <VendorName>${provider.VendorUserName}</VendorName>
          <VendorPassword>${provider.VendorPassword}</VendorPassword>
      </Caller>
      <SystemName>${provider.VendorUserName}</SystemName>
      <RcopiaPracticeUsername>${provider.RcopiaUserName}</RcopiaPracticeUsername>
      <Request>
          <Command>send_patient</Command>
          <PatientList>
            <Patient>
                <ExternalID>${patient.PatientId}</ExternalID>
                <FirstName>${patient.FirstName}</FirstName>
                <LastName>${patient.LastName}</LastName>
                <DOB>${datePipe.transform(patient.Dob, "MM/dd/yyyy")}</DOB>
                <Sex>${patient.Gender == "female" ? 'f' : "male" ? 'm' :'u' }</Sex>
                <HomePhone>${patient.PrimaryPhone}</HomePhone>
                <MobilePhone>${patient.MobilePhone}</MobilePhone>

                <Address1>{patient.}</Address1>
                <Address2></Address2>
                <City>{patient.city}</City>
                <State>{patient.state}</State>
                <Zip>{patient.zip}</Zip>
            </Patient>
          </PatientList>
      </Request>
  </RCExtRequest>`;

export const SendMedicationXML = (provider, patient, medication, deleted) => `<?xml version="1.0" encoding="UTF-8"?>
  <RCExtRequest version = "2.32">
      <Caller>
          <VendorName>${provider.vendor_username}</VendorName>
          <VendorPassword>${provider.vendor_password}</VendorPassword>
      </Caller>
      <SystemName>${provider.vendor_username}</SystemName>
      <RcopiaPracticeUsername>${provider.rcopia_user_name}</RcopiaPracticeUsername>

      <Request>
        <Command>send_medication</Command>
        <MedicationList>

            <!-- Medication defined by NDC list, with structured sig -->
            <Medication>
                <Deleted>${deleted}</Deleted>
                <RcopiaID>${medication.rcopia_id}</RcopiaID>
                <Patient>
                    <RcopiaID>${patient.drfirst_patient_id}</RcopiaID>
                    <ExternalID>${patient.rcopia_user_external_id}</ExternalID>
                </Patient>
                <Provider>
                    <Username>${provider.rcopia_user_name}</Username>
                </Provider>
                <Sig>
                    <Drug>
                        <NDCID>${medication.ndc}</NDCID>
                        <BrandName>${medication.display_name}</BrandName>
                        <GenericName>${medication.drug_name}</GenericName>
                        <Form>${medication.units}</Form>
                        <Strength>${medication.strength}</Strength>
                    </Drug>
                    <Dose>${medication.manual_dose_form}</Dose>
                    <DoseUnit>${medication.units}</DoseUnit>
                    <DoseTiming>${medication.notes}</DoseTiming>
                    <Duration>${medication.days_supply}</Duration>
                    <Quantity>${medication.quantity}</Quantity>
                    <QuantityUnit>${medication.units}</QuantityUnit>
                    <Refills>${medication.refills}</Refills>
                    <SubstitutionPermitted></SubstitutionPermitted>
                    <OtherNotes></OtherNotes>
                    <PatientNotes></PatientNotes>
                </Sig>
                <StartDate>${medication.start_at}</StartDate>
                <StopDate>${medication.stop_at}</StopDate>
                <FillDate></FillDate>
                <StopReason></StopReason>
            </Medication>
        </MedicationList>
      </Request>
  </RCExtRequest>`;

export const SentDiagnosisXMLForSnomed = (provider, patient, diagnoses) => `<?xml version="1.0" encoding="UTF-8"?>
  <RCExtRequest version = "2.32">
      <Caller>
          <VendorName>${provider.vendor_username}</VendorName>
          <VendorPassword>${provider.vendor_password}</VendorPassword>
      </Caller>
      <SystemName>${provider.vendor_username}</SystemName>
      <RcopiaPracticeUsername>${provider.rcopia_user_name}</RcopiaPracticeUsername>

      <Request>
      <Command>send_problem</Command>
      <ProblemList>
        <Problem>
          <Deleted></Deleted>
          <Status><Active/></Status>
          <OnsetDate>${diagnoses.start_at}</OnsetDate>
          <RcopiaID>${diagnoses.rcopia_id}</RcopiaID>
          <ExternalID>${diagnoses.id}</ExternalID>
          <Patient>
              <RcopiaID>${patient.drfirst_patient_id}</RcopiaID>
              <ExternalID>${patient.rcopia_user_external_id}</ExternalID>
          </Patient>
          <SNOMED>
            <ConceptID>${diagnoses.code}</ConceptID>
            <Description>${diagnoses.description}</Description>
          </SNOMED>
        </Problem>
      </ProblemList>
    </Request>
  </RCExtRequest>`;

export const SendDianosisXMLForNonSnomed = (provider, patient, diagnoses) => `<?xml version="1.0" encoding="UTF-8"?>
<RCExtRequest version = "2.32">
    <Caller>
        <VendorName>#{self.patient.provider.vendor_username}</VendorName>
        <VendorPassword>${provider.vendor_password}</VendorPassword>
    </Caller>
    <SystemName>#{self.patient.provider.vendor_username}</SystemName>
    <RcopiaPracticeUsername>${provider.rcopia_user_name}</RcopiaPracticeUsername>

    <Request>
    <Command>send_problem</Command>
    <ProblemList>
      <Problem>
        <Deleted></Deleted>
        <Status><Active/></Status>
        <OnsetDate>${diagnoses.start_at}</OnsetDate>
        <RcopiaID>${diagnoses.rcopia_id}</RcopiaID>
        <ExternalID>${diagnoses.id}</ExternalID>
        <Patient>
            <RcopiaID>${patient.drfirst_patient_id}</RcopiaID>
            <ExternalID>${patient.rcopia_user_external_id}</ExternalID>
        </Patient>
        <ICD10>
          <Code>${diagnoses.code}</Code>
          <Description>${diagnoses.description}</Description>
        </ICD10>
      </Problem>
    </ProblemList>
  </Request>
</RCExtRequest>`

export const DeleteDianosisXMLForSnomed = (provider, patient, diagnoses) => `<?xml version="1.0" encoding="UTF-8"?>
<RCExtRequest version = "2.32">
    <Caller>
        <VendorName>S{provider.vendor_username}</VendorName>
        <VendorPassword>${provider.vendor_password}</VendorPassword>
    </Caller>
    <SystemName>${provider.vendor_username}</SystemName>
    <RcopiaPracticeUsername>${provider.rcopia_user_name}</RcopiaPracticeUsername>

    <Request>
    <Command>send_problem</Command>
    <ProblemList>
      <Problem>
        <Deleted>y</Deleted>
        <Status><Deleted/></Status>
        <OnsetDate>${diagnoses.start_at}</OnsetDate>
        <RcopiaID>${diagnoses.rcopia_id}</RcopiaID>
        <ExternalID>${diagnoses.id}</ExternalID>
        <Patient>
            <RcopiaID>${patient.drfirst_patient_id}</RcopiaID>
            <ExternalID>${patient.rcopia_user_external_id}</ExternalID>
        </Patient>
        <SNOMED>
          <ConceptID>${diagnoses.code}</ConceptID>
          <Description>${diagnoses.description}</Description>
        </SNOMED>
      </Problem>
    </ProblemList>
  </Request>
</RCExtRequest>`;

export const DeleteDianosisXMLForNonSnomed = () => `<?xml version="1.0" encoding="UTF-8"?>
<RCExtRequest version = "2.32">
    <Caller>
        <VendorName>#{self.patient.provider.vendor_username}</VendorName>
        <VendorPassword>#{self.patient.provider.vendor_password}</VendorPassword>
    </Caller>
    <SystemName>#{self.patient.provider.vendor_username}</SystemName>
    <RcopiaPracticeUsername>#{patient.provider.rcopia_user_name}</RcopiaPracticeUsername>

    <Request>
    <Command>send_problem</Command>
    <ProblemList>
      <Problem>
        <Deleted>y</Deleted>
        <Status><Deleted/></Status>
        <OnsetDate>#{diagnoses.start_at.try(:strftime, Date::DATE_FORMATS[:standart])}</OnsetDate>
        <RcopiaID>#{diagnoses.rcopia_id}</RcopiaID>
        <ExternalID>#{diagnoses.id}</ExternalID>
        <Patient>
            <RcopiaID>#{patient.drfirst_patient_id}</RcopiaID>
            <ExternalID>#{patient.rcopia_user_external_id}</ExternalID>
        </Patient>
        <ICD10>
          <Code>#{diagnoses.code}</Code>
          <Description>#{diagnoses.description}</Description>
        </ICD10>
      </Problem>
    </ProblemList>
  </Request>
</RCExtRequest>`;

export const SendAllergyXMLForNDC = () => `<?xml version="1.0" encoding="UTF-8"?>
<RCExtRequest version = "2.32">
  <Caller>
    <VendorName>#{self.patient.provider.vendor_username}</VendorName>
    <VendorPassword>#{self.patient.provider.vendor_password}</VendorPassword>
  </Caller>
  <SystemName>#{self.patient.provider.vendor_username}</SystemName>
  <RcopiaPracticeUsername>#{patient.provider.rcopia_user_name}</RcopiaPracticeUsername>

  <Request>
    <Command>send_allergy</Command>
    <AllergyList>
      <!-- Allergy defined by drug NDC id -->
      <Allergy>
        <ExternalID>#{allergy.id}</ExternalID>
        <RcopiaID>#{allergy.rcopia_id}</RcopiaID>
        <Deleted>n</Deleted>
        <Status><Active/></Status>
        <Patient>
            <RcopiaID>#{patient.drfirst_patient_id}</RcopiaID>
            <ExternalID>#{patient.rcopia_user_external_id}</ExternalID>
        </Patient>
        <Allergen>
          <Name>#{allergy.allergen_name}</Name>
          <Drug>
            <RcopiaID></RcopiaID>
            <NDCID>#{allergy.ndc}</NDCID>
          </Drug>
        </Allergen>
        <Reaction>#{allergy.reaction.try(:join, ', ')}</Reaction>
        <OnsetDate>#{allergy.start_at.try(:strftime, Date::DATE_FORMATS[:standart])}</OnsetDate>
      </Allergy>
    </AllergyList>
  </Request>
</RCExtRequest>`;

export const SendAllergyXMLForNonNDC = () => `<?xml version="1.0" encoding="UTF-8"?>
<RCExtRequest version = "2.32">
  <Caller>
    <VendorName>#{self.patient.provider.vendor_username}</VendorName>
    <VendorPassword>#{self.patient.provider.vendor_password}</VendorPassword>
  </Caller>
  <SystemName>#{self.patient.provider.vendor_username}</SystemName>
  <RcopiaPracticeUsername>#{patient.provider.rcopia_user_name}</RcopiaPracticeUsername>

  <Request>
    <Command>send_allergy</Command>
    <AllergyList>
      <!-- Allergy defined by drug NDC id -->
      <Allergy>
        <ExternalID>#{allergy.id}</ExternalID>
        <RcopiaID>#{allergy.rcopia_id}</RcopiaID>
        <Deleted>n</Deleted>
        <Status><Active/></Status>
        <Patient>
            <RcopiaID>#{patient.drfirst_patient_id}</RcopiaID>
            <ExternalID>#{patient.rcopia_user_external_id}</ExternalID>
        </Patient>
        <Allergen>
          <Name>#{allergy.allergen_name}</Name>
        </Allergen>
        <Reaction>#{allergy.reaction.try(:join, ', ')}</Reaction>
        <OnsetDate>#{allergy.start_at.try(:strftime, Date::DATE_FORMATS[:standart])}</OnsetDate>
      </Allergy>
    </AllergyList>
  </Request>
</RCExtRequest>`;

export const DeleteAllergyXMLForNDC = () => `<?xml version="1.0" encoding="UTF-8"?>
<RCExtRequest version = "2.32">
  <Caller>
    <VendorName>#{self.patient.provider.vendor_username}</VendorName>
    <VendorPassword>#{self.patient.provider.vendor_password}</VendorPassword>
  </Caller>
  <SystemName>#{self.patient.provider.vendor_username}</SystemName>
  <RcopiaPracticeUsername>#{patient.provider.rcopia_user_name}</RcopiaPracticeUsername>

  <Request>
    <Command>send_allergy</Command>
    <AllergyList>
      <!-- Allergy defined by drug NDC id -->
      <Allergy>
        <ExternalID>#{allergy.id}</ExternalID>
        <RcopiaID>#{allergy.rcopia_id}</RcopiaID>
        <Deleted>y</Deleted>
        <Status><Deleted/></Status>
        <Patient>
            <RcopiaID>#{patient.drfirst_patient_id}</RcopiaID>
            <ExternalID>#{patient.rcopia_user_external_id}</ExternalID>
        </Patient>
        <Allergen>
          <Name>#{allergy.allergen_name}</Name>
          <Drug>
            <RcopiaID></RcopiaID>
            <NDCID>#{allergy.ndc}</NDCID>
          </Drug>
        </Allergen>
        <Reaction>#{allergy.reaction}</Reaction>
        <OnsetDate>#{allergy.start_at.try(:strftime, Date::DATE_FORMATS[:standart])}</OnsetDate>
      </Allergy>
    </AllergyList>
  </Request>
</RCExtRequest>`;

export const DeleteAllergyXMLForNonNDC = () => `<?xml version="1.0" encoding="UTF-8"?>
<RCExtRequest version = "2.32">
  <Caller>
    <VendorName>#{self.patient.provider.vendor_username}</VendorName>
    <VendorPassword>#{self.patient.provider.vendor_password}</VendorPassword>
  </Caller>
  <SystemName>#{self.patient.provider.vendor_username}</SystemName>
  <RcopiaPracticeUsername>#{patient.provider.rcopia_user_name}</RcopiaPracticeUsername>

  <Request>
    <Command>send_allergy</Command>
    <AllergyList>
      <!-- Allergy defined by drug NDC id -->
      <Allergy>
        <ExternalID>#{allergy.id}</ExternalID>
        <RcopiaID>#{allergy.rcopia_id}</RcopiaID>
        <Deleted>y</Deleted>
        <Status><Deleted/></Status>
        <Patient>
            <RcopiaID>#{patient.drfirst_patient_id}</RcopiaID>
            <ExternalID>#{patient.rcopia_user_external_id}</ExternalID>
        </Patient>
        <Allergen>
          <Name>#{allergy.allergen_name}</Name>
        </Allergen>
        <Reaction>#{allergy.reaction}</Reaction>
        <OnsetDate>#{allergy.start_at.try(:strftime, Date::DATE_FORMATS[:standart])}</OnsetDate>
      </Allergy>
    </AllergyList>
  </Request>
</RCExtRequest>`;

export const GetNotificationsXML = () => `<?xml version="1.0" encoding="UTF-8"?>
<RCExtRequest version = "2.32">
    <Caller>
        <VendorName>#{vendor_username}</VendorName>
        <VendorPassword>#{vendor_password}</VendorPassword>
    </Caller>
    <SystemName>#{vendor_username}</SystemName>
    <RcopiaPracticeUsername>#{rcopia_user_name}</RcopiaPracticeUsername>

    <Request>
      <Command>get_notification_count</Command>
      <ReturnPrescriptionIDs>y</ReturnPrescriptionIDs>
      <Type>all</Type>
    </Request>
</RCExtRequest>`;

export const SyncPrescriptionXML = (provider, patient) => `<?xml version="1.0" encoding="UTF-8"?>
<RCExtRequest version = "2.32">
  <Caller>
    <VendorName>${provider.vendor_username}</VendorName>
    <VendorPassword>${provider.vendor_password}</VendorPassword>
  </Caller>
  <SystemName>${provider.vendor_username}</SystemName>
  <RcopiaPracticeUsername>${provider.rcopia_user_name}</RcopiaPracticeUsername>

  <Request>
      <Command>update_prescription</Command>
        <LastUpdateDate>#{(last_prescription_time).try(:strftime, '%m/%d/%Y %I:%M:%S') || '01/01/2016 00:00:02'}</LastUpdateDate>
    <Patient>
        <RcopiaID></RcopiaID>
        <ExternalID></ExternalID>
    </Patient>
    <Status>all</Status>
  </Request>
</RCExtRequest>`;

export const UpdatePrescriptionEventXML = () => `<?xml version="1.0" encoding="UTF-8"?>
<RCExtRequest version = "1.0">
    <Caller>
      <VendorName>#{self.patient.provider.vendor_username}</VendorName>
      <VendorPassword>#{self.patient.provider.vendor_password}</VendorPassword>
    </Caller>
    <SystemName>#{self.patient.provider.vendor_username}</SystemName>
    <RcopiaPracticeUsername>#{patient.provider.rcopia_user_name}</RcopiaPracticeUsername>
    <Request>
      <Command>update_prescription_events</Command>
      <LastUpdateDate>#{(last_prescription_time).try(:strftime, '%m/%d/%Y %I:%M:%S') || '01/01/2016 00:00:02'}</LastUpdateDate>
        <PrescriptionList>
          <Prescription>
            <RcopiaID>#{rcopia_id}</RcopiaID>
            <ExternalID></ExternalID>
            <PrescriberOrderNumber></PrescriberOrderNumber>
          </Prescription>
        </PrescriptionList>
    </Request>
</RCExtRequest>`;
