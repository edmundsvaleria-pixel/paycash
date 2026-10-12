export type Role = "admin" | "member";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: Role;
  test_plaintext_password: string | null;
  created_at: string;
};

export type Contribution = {
  id: number;
  member_id: string;
  amount_gbp: number;
  method: "MoMo" | "Cash" | "Bank" | "Other";
  note: string | null;
  contributed_at: string;
  verified: boolean;
  verified_at: string | null;
  created_at: string;
};

export type Setting = {
  key: string;
  value: string;
};