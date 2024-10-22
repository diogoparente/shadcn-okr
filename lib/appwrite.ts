import { Account, Client, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID ?? "");

export const account = new Account(client);
export const databases = new Databases(client);

export { client };
