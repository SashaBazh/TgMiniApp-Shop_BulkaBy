export interface ReferralData {
  username: string;
  telegram_id: number;
  earnings: number;
}

export interface UserProfileResponse {
  username: string;
  points: number;
  referral_link: string;
  referrals_count: number;
  referrals_earning: number;
  referrals: ReferralData[];
  birthday: string | null;
  image_url?: string;
  status: string;
}
