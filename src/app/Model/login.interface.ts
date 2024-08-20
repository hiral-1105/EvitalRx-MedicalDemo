
export interface LoginRequest {
   apikey: string;
  mobile: string;
  password: string;
}

export interface LoginResponse {
  status_code: string;
  status_message: string;
  datetime: string;
  data: {
    patient_id: string;
    status: string;
    accesstoken: string;
    profile_picture: string;
    firstname: string;
    lastname: string;
    patient_code: string;
    zipcode: string;
  };
}
