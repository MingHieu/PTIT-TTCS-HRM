export interface IJwtPayload {
  sub: number; // userId
  username: string;
  permissions: string[];
}
