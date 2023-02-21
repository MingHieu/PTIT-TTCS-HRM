export interface IJwtPayload {
  sub: number; // userId
  userId: number;
  permissions: string[];
}
