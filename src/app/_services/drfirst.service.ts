import { UtilityService } from 'src/app/_services/utiltiy.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { HttpClient, HttpHeaders, HttpParams, HttpUrlEncodingCodec } from "@angular/common/http";

import { Injectable } from "@angular/core";
import * as xml2js from 'xml2js';
import { DR_FIRSR_VERESION, DR_FIRST_PATINET_URL, DR_FIRST_PROVIDER_URL, DR_FIRST_SSO_URL, DR_FIRST_URL, environment } from "src/environments/environment";
import { DatePipe } from "@angular/common";
import { DrFirstAttributes, DrFirstPatient } from '../_models/_provider/practiceProviders';
import { Md5 } from "md5-typescript";
import { DrfirstUrlChanged } from '../_navigations/provider.layout/view.notification.service';
import { AlertMessage, ERROR_CODES } from '../_alerts/alertMessage';

export class DrFirstValidFields {
  FirstName = { required: true, length: 35 };
  MiddleName = { required: false, length: 35 };
  LastName = { required: true, length: 35 };
  DOB = { required: true, format: 'MM/dd/yyyy' }
  Sex = { char: 1 }
  MobilePhone = { length: 10, format: '(ddd) ddd-dddd', required: true }
  Address1 = { length: 40, default: 'Unknown', max: 100 }
  City = { required: true, length: 100 }
  State = { required: true, length: 2 }
  Zip = { required: true, size: [5, 10] }
}

@Injectable()
export class DrfirstService {
  httpRequestHeaders: HttpHeaders;
  httpRequestParams: HttpParams;
  parser = new xml2js.Parser({ strict: false, trim: true });
  codec = new HttpUrlEncodingCodec;
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService,
    private utilityService: UtilityService,
    private drfirstUrlChanged: DrfirstUrlChanged,
    private alertmsg: AlertMessage
  ) {


  }


  public SendPatient(patient: DrFirstPatient) {
    var urlparams: string = ""
    var providerId = this.authenticationService.userValue.ProviderId;
    this.utilityService.DrfirstProviderParams(providerId, patient.PatientId).subscribe(resp => {
      if (resp.IsSuccess) {
        var drfirstProviderParams = resp.Result as DrFirstAttributes;
        //console.log(drfirstProviderParams);
        let patientXml = SendPatientXML(drfirstProviderParams, patient, this.datePipe);
        //console.log(patientXml);
        // this.SubmitRequest(encodeURI(patientXml)).subscribe(resp => {
        //   console.log(resp);
        //   this.parser.parseString(resp, (err, result) => {
        //     console.log(result);
        //     let xmltoJsonData = result;
        //     var patientId = result.RCEXTRESPONSE.RESPONSE[0].PATIENTLIST[0].PATIENT[0].EXTERNALID[0]
        //     var rcopiaId = result.RCEXTRESPONSE.RESPONSE[0].PATIENTLIST[0].PATIENT[0].EXTERNALID[0]
        //     var status = result.RCEXTRESPONSE.RESPONSE[0].STATUS[0];
        //     if (status == "ok") {
        //       this.utilityService.UpdateDrFirstPatient(patientId, rcopiaId).subscribe((resp) => {
        //         this.alertmsg.displayMessageDailog(ERROR_CODES["M2PE001"]);
        //       });
        //     } else {
        //       this.alertmsg.displayMessageDailog(ERROR_CODES["E2PE001"]);
        //     }
        //   });
        // })
        this.SubmitRequest(this.codec.encodeValue(patientXml), patientXml);
      }
    })
  }

  public logDrfirstdata() {


  }

  public SendMedication(provider, patient, medication, deleted) {
    let sendMedicationXML = SendMedicationXML(provider, patient, medication, deleted);
    // this.SubmitRequest(sendMedicationXML).subscribe(resp => {
    //   console.log(resp);
    // })
  }

  public SentDiagnosisForSnomed(provider, patient, diagnoses) {
    let sendMedicationXML = SentDiagnosisXMLForSnomed(provider, patient, diagnoses);
    // this.SubmitRequest(sendMedicationXML).subscribe(resp => {
    //   console.log(resp);
    // })
  }

  public SendDianosisForNonSnomed(provider, patient, diagnoses) {
    let sendMedicationXML = SendDianosisXMLForNonSnomed(provider, patient, diagnoses);
    // this.SubmitRequest(sendMedicationXML).subscribe(resp => {
    //   console.log(resp);
    // })
  }

  public SyncPrescription(provider, patient) {
    let sendMedicationXML = SyncPrescriptionXML(provider, patient);
    // this.SubmitRequest(sendMedicationXML).subscribe(resp => {
    //   console.log(resp);
    // })
  }
  public func_callbk(data) {
    //console.log(data);
  }

  private SubmitRequest(xmlpayload, patientXml) {
    let eprescribeServer = environment.EPRESCRIBE_SERVER_STAGE102
    //console.log(xmlpayload);

    // Using CORS Method
    const drfirstUrl = `${eprescribeServer}/send_patient?xml=${xmlpayload}&output=text/xml`
    let callbackparam: string = 'callbackparam'
    this.http.jsonp(drfirstUrl, callbackparam)
      .subscribe((jsonCallback) => {
        //console.log(jsonCallback);
      },
        (error) => {
          console.log(error);
          console.log(error.message);
        },
        () => { }
      );



    // UsingProxy
    let proxyUri = `/send_patient?xml=${xmlpayload}&output=text/xml`
    this.http.get('/send_patient', { headers: this.httpRequestHeaders, params: { "xml": patientXml } }).subscribe((resp) => { console.log(resp) },
      (error) => { console.log(error); },
      () => { }
    )

  }



  public ProviderUrl(startup:string ='report') {
    if (this.authenticationService.isProvider) {
      var urlparams: string = ""
      var providerId = this.authenticationService.userValue.ProviderId;

      this.utilityService.DrfirstProviderParams(providerId, undefined).subscribe(resp => {
        if (resp.IsSuccess) {
          var drfirstProviderParams = resp.Result as DrFirstAttributes;

          if (drfirstProviderParams.EprescribeFrom == 'drfirst') {
            urlparams = DR_FIRST_PROVIDER_URL(
              drfirstProviderParams.VendorUserName,
              drfirstProviderParams.RcopiaPracticeUserName,
              drfirstProviderParams.ProviderUserName,
              drfirstProviderParams.RcopiaUserExternalId == null || drfirstProviderParams.RcopiaUserExternalId == undefined
                ? "" : drfirstProviderParams.RcopiaUserExternalId,startup) + this.gmtTime();

            var hashvalue = Md5.init(`${urlparams}${drfirstProviderParams.VendorPassword}`).toUpperCase()
            urlparams = DR_FIRST_URL(urlparams, hashvalue);
            this.drfirstUrlChanged.sendData(DR_FIRST_SSO_URL(urlparams), "Provider", startup);

          }
        }
      })
    }
  }

  public PatientUrl() {
    if (this.authenticationService.isProvider) {
      var urlparams: string = ""
      var providerId = this.authenticationService.userValue.ProviderId;
      var patientId = this.authenticationService.viewModel.Patient?.PatientId
      this.utilityService.DrfirstProviderParams(providerId, patientId).subscribe(resp => {
        if (resp.IsSuccess) {
          var drfirstProviderParams = resp.Result as DrFirstAttributes;
          console.log(drfirstProviderParams);

          if (drfirstProviderParams.EprescribeFrom == 'drfirst') {

            if (drfirstProviderParams.DrFirstPatientId) {
              urlparams = DR_FIRST_PATINET_URL(
                drfirstProviderParams.VendorUserName,
                drfirstProviderParams.RcopiaPracticeUserName,
                drfirstProviderParams.ProviderUserName,
                drfirstProviderParams.RcopiaUserExternalId == null || drfirstProviderParams.RcopiaUserExternalId == undefined
                  ? "" : drfirstProviderParams.RcopiaUserExternalId,
                drfirstProviderParams.DrFirstPatientId + '') + this.gmtTime();
              console.log(urlparams);

              var hashvalue = Md5.init(`${urlparams}${drfirstProviderParams.VendorPassword}`).toUpperCase()
              console.log(hashvalue);

              urlparams = DR_FIRST_URL(urlparams, hashvalue);
              console.log(urlparams);

              this.drfirstUrlChanged.sendData(DR_FIRST_SSO_URL(urlparams), "Patient","");

            }


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


export const USAPhoneFormat = (phonenumber, format = false) => {
  var phoneRegex = /^([+1]{2})*\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (phoneRegex.test(phonenumber)) {
    if (!format) return phonenumber.replace(phoneRegex, "$2$3$4")
    return phonenumber.replace(phoneRegex, "($2) $3-$4");
  } else {
    // Invalid phone number
  }
}
export const SendPatientXML = (provider: DrFirstAttributes, patient: DrFirstPatient, datePipe) => `<?xml version="1.0" encoding="UTF-8"?>
  <RCExtRequest version = "${DR_FIRSR_VERESION}">
      <Caller>
          <VendorName>${provider.VendorUserName}</VendorName>
          <VendorPassword>${provider.VendorPassword}</VendorPassword>
      </Caller>
      <SystemName>${provider.VendorUserName}</SystemName>
      <RcopiaPracticeUsername>${provider.RcopiaPracticeUserName}</RcopiaPracticeUsername>
      <Request>
          <Command>send_patient</Command>
          <PatientList>
            <Patient>
                <ExternalID>${patient.PatientId}</ExternalID>
                <FirstName>${patient.FirstName}</FirstName>
                <LastName>${patient.LastName}</LastName>
                <DOB>${datePipe.transform(patient.DOB, "MM/dd/yyyy")}</DOB>
                <Sex>${patient.Gender == "female" ? 'f' : "male" ? 'm' : 'u'}</Sex>
                <MobilePhone>${USAPhoneFormat(patient.MobilePhone ? patient.MobilePhone : patient.HomePhone)}</MobilePhone>
                <Address1>${patient.PatientAddress == 'null' ? 'Unknown' : patient.PatientAddress}</Address1>
                <Address2></Address2>
                <City>${patient.City}</City>
                <State>${patient.State}</State>
                <Zip>${patient.Zip == null ? patient.ClinicZip : patient.Zip}</Zip>
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
