export interface SignupRequest {
  apikey: string;
  mobile: string;
  firstname: string;
  lastname?: string;
  otp: string;
  password: string;
  os?: 'web' | 'android' | 'ios';
  zipcode?: string;

}

export interface SignupResponse {
  status_code: string;
  status_message: string;
  datetime: string;
  data: {
    profile_picture: string;
    patient_id: string;
    firstname: string;
    lastname: string;
    mobile: string;
    patient_code: string;
    status: string;
    zipcode: string;
  }
}
