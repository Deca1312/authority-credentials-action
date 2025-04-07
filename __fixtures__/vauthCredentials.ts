import { jest } from '@jest/globals'
import type { GithubExchanger as GithubExchangerType } from '@veraid/authority-credentials'

const INSTANCE = {
  exchange: jest.fn<GithubExchangerType['exchange']>()
}

export const GithubExchanger = {
  ...INSTANCE,
  initFromEnv: jest.fn().mockReturnValue(INSTANCE)
}
