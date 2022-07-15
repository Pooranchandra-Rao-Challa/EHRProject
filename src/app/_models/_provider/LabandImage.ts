import {PracticeProviders} from 'src/app/_models/_provider/practiceProviders';
export class Labandimaging{
    CurrentPatient?:PracticeProviders;
    LabProcedureId?:string;
    PatientId?:string;
    ClinicId?:string;
    ProviderId?:string;
    Signed?:string;
    LocationId?:string;
    OrderId?:string;
    OrderType?:string;
    LabName?:string;
    Status?:string;
    ScheduleDate?:string;
    OrderingPhyscian?:string;
    OrderingFacility?:string;
    LabandImageStatus?:string;
    ReceivedDate?:string;
    Notes?:string;
    Tests:Test[]=[];
    View?:string;
}

export class Test{
Code?:string;
Test?:string;
}

