import { jest } from '@jest/globals'
import type {
  VeraidCredential,
  CredentialType
} from '@veraid/authority-credentials'

import * as core from '../__fixtures__/core.js'
import * as vauthCredentials from '../__fixtures__/vauthCredentials.js'

jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule(
  '@veraid/authority-credentials',
  () => vauthCredentials
)

const { run } = await import('../src/main.js')

const EXCHANGE_URL = 'https://vauth.example/credentials/123'
const CREDENTIAL: VeraidCredential = {
  credential: Buffer.from('the credential'),
  type: 'the type' as CredentialType
}

describe('main.ts', () => {
  afterEach(() => {
    vauthCredentials.GithubExchanger.initFromEnv.mockClear()
    vauthCredentials.GithubExchanger.exchange.mockClear()
  })

  it('should call the exchanger with the correct URL', async () => {
    core.getInput.mockReturnValue(EXCHANGE_URL)
    vauthCredentials.GithubExchanger.exchange.mockResolvedValue(CREDENTIAL)

    await run()

    expect(vauthCredentials.GithubExchanger.exchange).toHaveBeenCalledWith(
      new URL(EXCHANGE_URL)
    )
  })

  it('should output the credential and type', async () => {
    core.getInput.mockReturnValue(EXCHANGE_URL)
    vauthCredentials.GithubExchanger.exchange.mockResolvedValue(CREDENTIAL)

    await run()

    expect(core.setOutput).toHaveBeenCalledWith(
      'credential',
      CREDENTIAL.credential.toString('base64')
    )
    expect(core.setOutput).toHaveBeenCalledWith('type', CREDENTIAL.type)
  })

  it('should mark the action as failed if an error occurs', async () => {
    core.getInput.mockReturnValue(EXCHANGE_URL)
    const error = new Error('test')
    vauthCredentials.GithubExchanger.exchange.mockRejectedValue(error)

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(error.message)
  })
})
