export interface IApplicant {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    patronymic?: string;
    email: string;
    phone: string;
  };
  snils: string;
  quotas: IQuotas;
  documents: {
    originalDocumentReceived: boolean;
    originalDocumentReceivedAt?: string;
  };
  examScores: IExamScore[];
  selectedPrograms: ISelectedProgram[];
  createdAt: string;
}

export interface IApplicantMessage {
  snils: string;
  content: string;
}

export interface IQuotas {
  hasBvi: boolean;
  hasSpecialQuota: boolean;
  hasSeparateQuota: boolean;
  hasTargetQuota: boolean;
  hasPriorityRight: boolean;
}

export interface IExamScore {
  subjectName: string;
  score: number;
}

export interface ISelectedProgram {
  programId: number;
  programCode: string;
  programName: string;
  studyForm: 'full-time' | 'part-time';
  admissionType: 'budget' | 'paid' | 'target';
  priority: number;
}

export interface IAvailableProgram {
  id: number;
  code: string;
  name: string;
  faculty: string;
  requiredSubjects: string[];
  budgetPlaces: number;
  paidPlaces: number;
  studyForms: string[];
  admissionTypes: string[];
}
