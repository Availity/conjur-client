import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { after, describe, it } from 'node:test';

import { MockConjurService, random } from './_internal/index.js';

import { ConjurAuthenticator } from './Authenticator.js';
import { ConjurLocator } from './Locator.js';

describe('Conjur Client', () => {
  const url = new URL('http://localhost:8089');
  const account = 'myorg';
  const conjur = new ConjurAuthenticator(url.toString());
  const { default: service } = MockConjurService;
  const server = createServer({
    keepAlive: true
  }, MockConjurService.listener).listen({
    host: 'localhost', port: 8089
  });
  after(() => {
    server.close();
    service.close();
  });
  
  const passwordSecret = 'account:variable:vault/secret/password';
  const mockPassword = random.ascii(20);
  const usernameSecret = 'account:variable:vault/secret/username';
  const mockUsername = random.ascii(20);
  
  MockConjurService.secretsCache.set(passwordSecret, mockPassword)
    .set(passwordSecret.replace(':', '/'), mockPassword)
    .set(usernameSecret, mockUsername)
    .set(usernameSecret.replace(':', '/'), mockUsername);
  
  it('should be able to work with a GitLab JWT', async () => {
    const gitlab = MockConjurService.gitlab;
    const client = await conjur.authenticate({ account, gitlab });
    const [ _account, kind, identifier ] = usernameSecret.split(':');
    
    const secret = await client.secret.retrieve(_account, kind, identifier);
    assert.equal(secret, mockUsername, 'Username should match the cached value');
  });
  
  it('should be able to retrieve a secret', async () => {
    const apiKey = MockConjurService.apiKey;
    const login = MockConjurService.apiLogin;
    const client = await conjur.authenticate({ account, apiKey, login });
    const [ _account, kind, identifier ] = usernameSecret.split(':');

    const secret = await client.secret.retrieve(_account, kind, identifier);
    assert.equal(secret, mockUsername, 'Username should match the cached value');
  });
  
  it('should be able to retrieve multiple secrets', async () => {
    const apiKey = MockConjurService.apiKey;
    const login = MockConjurService.apiLogin;
    const client = await conjur.authenticate({ account, apiKey, login });
    const mapping = {
      password: ConjurLocator.fromString(passwordSecret),
      username: ConjurLocator.fromString(usernameSecret)
    };
    
    const expected = {
      password: mockPassword,
      username: mockUsername
    };
    
    const secrets = await client.secret.retrieveMapped(mapping);
    assert.deepEqual(secrets, expected);
  });
});
