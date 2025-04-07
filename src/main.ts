import * as core from '@actions/core'
import { GithubExchanger } from '@veraid/authority-credentials'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const exchangeUrl = new URL(core.getInput('exchange-url'))

    core.debug('Initialising exchanger...')
    const exchanger = GithubExchanger.initFromEnv()

    core.debug('Exchanging credentials...')
    const { credential, type } = await exchanger.exchange(exchangeUrl)

    core.info(`Exchanged credentials (got "${type}")`)

    core.setOutput('credential', credential.toString('base64'))
    core.setOutput('type', type)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}
