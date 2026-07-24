// The credentials shape expected by Session's `serviceAccountJson` config.
// v3 of the SDK no longer re-exports IIAmCredentials through its `exports` map,
// so we declare the structurally-compatible interface locally.
export interface IIAmCredentials {
    serviceAccountId: string
    accessKeyId: string
    privateKey: Buffer | string
}

export interface ServiceAccountJsonFileContents {
    id: string
    created_at: string
    key_algorithm: string
    service_account_id: string
    private_key: string
    public_key: string
}

export function fromServiceAccountJsonFile(data: ServiceAccountJsonFileContents): IIAmCredentials {
    return {
        accessKeyId: data.id,
        privateKey: data.private_key,
        serviceAccountId: data.service_account_id
    }
}
