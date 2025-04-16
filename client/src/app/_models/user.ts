export interface User {
  id: number;
  username: string;
  token: string;
  knownAs: string;
  gender: string;
  photoUrl?: string;
  roles: string[];
}
