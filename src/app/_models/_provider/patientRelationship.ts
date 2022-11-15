export class PatientRelationShip {
  RelationPatientId?: string;
  ProviderId?: string;
  RelationFirstName?: string;
  RelationMiddleName?: string;
  RelationLastName?: string;
  RelationUserId?: string;
  RelationUserName?: string;
  RelationShip?: string;
  PatientId?: string;
  HasAccess?: boolean;
}

export const PATIENT_RELATIONSHIP: { Id: string, value: string }[] = [
  { Id: '1', value: 'Parent-Mother' },
  { Id: '2', value: 'Parent-Father' },
  { Id: '3', value: 'Sibling-Sister' },
  { Id: '4', value: 'Sibling-Brother' },
  { Id: '5', value: 'Child-Daughter' },
  { Id: '6', value: 'Child-Son' },
  { Id: '8', value: 'Grandparent-Grandmother' },
  { Id: '9', value: 'Grandparent-Grandfather' },
  { Id: '10', value: 'Great Grandparent' },
  { Id: '11', value: 'Uncle' },
  { Id: '12', value: 'Aunt' },
  { Id: '13', value: 'Cousin' },
  { Id: '14', value: 'Other' },
  { Id: '15', value: 'UnKnown' },
];
