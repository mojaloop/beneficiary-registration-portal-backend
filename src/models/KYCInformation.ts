import {TKycInfo} from "../types/types";

export class KYCInformation {
    sub: string;
    birthdate: string;
    address: {
      locality: string;
    };
    gender: string;
    name: string;
    phoneNumber: string;
    email: string;
    picture: string;
  
    constructor(data: TKycInfo) {
      this.sub = data.sub || '';
      this.birthdate = data.birthdate || '';
      this.address = data.address ? { locality: data.address.locality || '' } : { locality: '' };
      this.gender = data.gender || '';
      this.name = data.name || '';
      this.phoneNumber = data.phoneNumber || '';
      this.email = data.email || '';
      this.picture = data.picture || '';
    }
  }