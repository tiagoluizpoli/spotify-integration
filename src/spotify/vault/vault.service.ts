import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

export interface ISecret {
  state: string;
  code: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  scope?: string;
  createdAt: Date;
  updatedAt: Date;
}
@Injectable()
export class VaultService {
  private filePath: string;
  constructor() {
    this.filePath = path.resolve(process.cwd(), 'secrets.json');
    this.ensureFileExists();
  }

  private ensureFileExists(): void {
    try {
      console.log(fs.existsSync(this.filePath));
      if (!fs.existsSync(this.filePath)) {
        // If the file doesn't exist, create it with an empty array for secrets
        fs.writeFileSync(this.filePath, '[]', 'utf8');
      }
    } catch (error) {
      Logger.error('Error while checking and creating the vault file:', error);
      throw error; // Rethrow the error to indicate the problem
    }
  }

  private readSecretsFromFile(): ISecret[] {
    try {
      const fileContents = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(fileContents) as ISecret[];
    } catch (error) {
      // If the file doesn't exist or is empty, return an empty array
      Logger.error('No secrets found in the file');
      return [];
    }
  }

  private writeSecretsToFile(secret: ISecret[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(secret, null, 2), 'utf8');
  }

  getAllSecrets(): ISecret[] {
    return this.readSecretsFromFile();
  }

  getSecretById(state: string): ISecret | null {
    const secret = this.readSecretsFromFile();
    return secret.find((secret) => secret.state === state) || null;
  }

  addSecret(newSecret: ISecret): ISecret {
    const secret = this.readSecretsFromFile();

    secret.push(newSecret);
    this.writeSecretsToFile(secret);
    return newSecret;
  }

  updateSecret(updatedsecret: ISecret): ISecret | null {
    const secret = this.readSecretsFromFile();
    const index = secret.findIndex(
      (secret) => secret.state === updatedsecret.state,
    );
    if (index !== -1) {
      secret[index] = { ...updatedsecret };
      this.writeSecretsToFile(secret);
      return secret[index];
    }
    return null;
  }

  deleteSecret(state: string): boolean {
    const secret = this.readSecretsFromFile();
    const filteredSecrets = secret.filter((secret) => secret.state !== state);
    if (filteredSecrets.length < secret.length) {
      this.writeSecretsToFile(filteredSecrets);
      return true;
    }
    return false;
  }
}
