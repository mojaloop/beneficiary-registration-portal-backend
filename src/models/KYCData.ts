import {TKYCData} from "../types/types";

export class KYCData {
    name: string;
    dob: string;
    gender: string;
    address: string;
    email: string;
    phone: string;
    nationality: string;
    passport_number: string;
    issue_date: string;
    expiry_date: string;
    bank_account_number: string;
    bank_name: string;
    employer: string;
    occupation: string;
    income: string;
    marital_status: string;
    dependents: number;
    risk_level: string;
  
    constructor(data: TKYCData) {
      this.name = data.name || '';
      this.dob = data.dob || '';
      this.gender = data.gender || '';
      this.address = data.address || '';
      this.email = data.email || '';
      this.phone = data.phone || '';
      this.nationality = data.nationality || '';
      this.passport_number = data.passport_number || '';
      this.issue_date = data.issue_date || '';
      this.expiry_date = data.expiry_date || '';
      this.bank_account_number = data.bank_account_number || '';
      this.bank_name = data.bank_name || '';
      this.employer = data.employer || '';
      this.occupation = data.occupation || '';
      this.income = data.income || '';
      this.marital_status = data.marital_status || '';
      this.dependents = data.dependents || 0;
      this.risk_level = data.risk_level || '';
    }
  }