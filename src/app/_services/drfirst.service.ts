import { UtilityService } from 'src/app/_services/utiltiy.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as xml2js from 'xml2js';
import { DR_FIRST_PROVIDER_URL, DR_FIRST_PROVIDER_URL_PARAMS, environment } from "src/environments/environment";
import { DatePipe } from "@angular/common";
import { DrFirstProviderParams } from '../_models/_provider/practiceProviders';
import { Observable } from 'rxjs';
//import { Md5 } from 'ts-md5';
import {Md5} from "md5-typescript";
import { DrfirstUrlChanged } from '../_navigations/provider.layout/view.notification.service';


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
  }

  initHeaders() {
    this.httpRequestHeaders = new HttpHeaders();
    this.httpRequestHeaders = this.httpRequestHeaders.set('Content-Type', 'application/xml; charset=UTF-8')
  }

  public SendPatient(provider, patient) {
    let patientXml = SendPatientXML(provider, patient, this.datePipe);
    this.SubmitRequest('xml=' + encodeURI(patientXml)).subscribe(resp => {
      console.log(resp);
      // this.parser.parseString(resp, (err, result) => {
      //   let xmltoJsonData = result;
      // });
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

  public ProviderUrl() {
    if (this.authenticationService.isProvider) {
      var urlparams: string = ""
      var providerId = this.authenticationService.userValue.ProviderId;
      //var md5 = new Md5();
      this.utilityService.DrfirstProviderParams(providerId).subscribe(resp => {
        if (resp.IsSuccess) {
          var drfirstProviderParams = resp.Result as DrFirstProviderParams;
          urlparams = DR_FIRST_PROVIDER_URL_PARAMS(
            drfirstProviderParams.VendorUserName,
            drfirstProviderParams.RcopiaUserName,
            drfirstProviderParams.RcopiaUserId,
            drfirstProviderParams.RcopiaUserExternalId)
        }
        var date = new Date();
        urlparams += this.datePipe.transform(date,"MMddyyyyHHmmss")
        var hashvalue = Md5.init(`${urlparams}${drfirstProviderParams.VendorPassword }`).toUpperCase()
        urlparams = `${urlparams}&MAC=${hashvalue}`
        this.drfirstUrlChanged.sendData(DR_FIRST_PROVIDER_URL(urlparams));
        //action=login&service=rcopia&startup_screen=patient&rcopia_user_external_id=dfdoc&rcopia_practice_username=df18&rcopia_patient_system_name=vendordf18&rcopia_patient_external_id=Bruce_Paltrow&close_window=n&allow_popup_screens=y&logout_url=http://www.google.com&time=080307200000
      })
    }

  }

  private ProviderDrfirstInfo() {

  }
}





export const SendPatientXML = (provider, patient, datePipe) => `<?xml version="1.0" encoding="UTF-8"?>
  <RCExtRequest version = "2.32">
      <Caller>
          <VendorName>${provider.vendor_username}</VendorName>
          <VendorPassword>${provider.vendor_password}</VendorPassword>
      </Caller>
      <SystemName>${provider.vendor_username}</SystemName>
      <RcopiaPracticeUsername>${provider.rcopia_user_name}</RcopiaPracticeUsername>
      <Request>
          <Command>send_patient</Command>
          <PatientList>
            <Patient>
                <ExternalID>${patient.id}</ExternalID>
                <FirstName>${patient.first_name.to_s}</FirstName>
                <LastName>${patient.last_name.to_s}</LastName>
                <DOB>${datePipe.transform(patient.birth, "MM/dd/yyyy")}</DOB>
                <Sex>patient{patient.gender == "female" ? 'F' : "male" ? 'M' :'U' }</Sex>
                <HomePhone>${patient.primary_phone}</HomePhone>
                <MobilePhone>${patient.mobile_phone}</MobilePhone>
                <WorkPhone>${patient.work_phone}</WorkPhone>
                <Address1>${patient.first_address.to_s}</Address1>
                <Address2></Address2>
                <City>${patient.city.to_s}</City>
                <State>${patient.state}</State>
                <Zip>${patient.zip.to_s}</Zip>
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
