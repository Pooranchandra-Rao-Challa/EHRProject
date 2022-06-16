export class PrimaryInsurance {
    InsuranceId?: string;
    SubscriberNane?: string;
    DateOfBirth?: Date;
    Gender?: string;
    StreetAddress?: string;
    City?: string;
    State?: string;
    Zip?: string;
    InsuranceCompanyPlanID?: string;
    InsuranceCompanyPlan?: string;
    SubscriberId?: string;
    RelationshipToSubscriber?: string;
    SourceOfPaymentTypology?: string;
    PaymentTypologyCode?:string;
    InsuranceType?: string;
    StartDate?: string;
    EndDate?: string;
    LocationId?:string;
    PatientId?:string;
    ProviderId?:string;
}
export class SecondaryInsurance {
    InsuranceId?: string;
    SubscriberNane?: string;
    DateOfBirth?: Date;
    Gender?: string;
    StreetAddress?: string;
    City?: string;
    State?: string;
    Zip?: string;
    InsuranceCompanyPlanID?: string;
    InsuranceCompanyPlan?: string;
    SubscriberId?: string;
    RelationshipToSubscriber?: string;
    SourceOfPaymentTypology?: string;
    InsuranceType?: string;
    StartDate?: string;
    EndDate?: string;
    InsuranceCompanyName?:string;
    LocationId?:string;
    PatientId?:string;
    ProviderId?:string;
}
export class ParticularInsuranceCompanyDetails {

    InsuranceCompanyId?: string;
    PlanType?: string;
    InsuranceCompanyName?: string;
    GroupPlan?: string;
    Employer?: string;
    Address?: string;
    StreetAddress?: string;
    City?: string;
    State?: string;
    Zip?: string;
    Contact?: string;
    Phone?: string;
    BenfitRenewal?: string;
    Group?: string;
    Local?: string;
    PayerID?: string;
    LocationId?:string;

}
