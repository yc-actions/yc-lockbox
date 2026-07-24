import { info, getInput, setOutput, setSecret, error, setFailed } from '@actions/core'
import { Session } from '@yandex-cloud/nodejs-sdk'
import { GetPayloadRequest, PayloadServiceClient } from '@yandex-cloud/nodejs-sdk/lockbox-v1/payload_service'
import { fromServiceAccountJsonFile } from './service-account-json'

async function run(): Promise<void> {
    try {
        info(`start`)
        const ycSaJsonCredentials = getInput('yc-sa-json-credentials', {
            required: true
        })

        const secretId = getInput('secret-id', {
            required: true
        })

        const versionId = getInput('version-id')

        const serviceAccountJson = fromServiceAccountJsonFile(JSON.parse(ycSaJsonCredentials))
        info('Parsed Service account JSON')

        const session = new Session({ serviceAccountJson })
        const payloadService = session.client(PayloadServiceClient)

        const res = await payloadService.get(
            GetPayloadRequest.fromPartial({
                secretId,
                versionId
            })
        )
        const keys: string[] = []
        for (const entry of res.entries) {
            const { key, textValue, binaryValue } = entry
            const value = binaryValue !== undefined ? Buffer.from(binaryValue).toString('base64') : (textValue ?? '')
            setOutput(key, value)
            setSecret(value)
            keys.push(key)
        }

        info(`Fetched values for ${keys.join(', ')}`)
    } catch (err) {
        if (err instanceof Error) {
            error(err)
            setFailed(err.message)
        }
    }
}

run()
