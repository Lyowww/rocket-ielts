export enum QueryKeysEnum {
  signin = "signin",
  signup = "signup",
}

export type QueryKeyType = keyof typeof QueryKeysEnum;
