import { generateUniqueId } from '@/utils'

describe('generateUniqueId', () => {
  it('should generate a 6-character unique ID by default', async () => {
    const id = await generateUniqueId(['user123', 'photo.png'])
    expect(id).toBeTypeOf('string')
    expect(id.length).toBe(6)
  })

  it('should generate a unique ID with a custom length', async () => {
    const id = await generateUniqueId(['user123', 'photo.png'], undefined, 16)
    expect(id).toBeTypeOf('string')
    expect(id.length).toBe(16)
  })

  it('should include input values in the hash', async () => {
    const id1 = await generateUniqueId(['user123', 'fileA'])
    const id2 = await generateUniqueId(['user123', 'fileB'])
    expect(id1).not.toEqual(id2)
  })

  it('should throw a RangeError if length is less than 1', async () => {
    await expect(
      generateUniqueId(['user123', 'photo.png'], undefined, 0),
    ).rejects.toThrow(RangeError)
  })

  it('should handle default randomBias correctly', async () => {
    const id1 = await generateUniqueId(['user123', 'photo.png'])
    const id2 = await generateUniqueId(['user123', 'photo.png'])
    expect(id1).not.toEqual(id2) // Ensures default randomBias (random value) works
  })

  it('should use fallbackSimple when crypto.subtle.digest is not supported', async () => {
    // Mock crypto.subtle to simulate unsupported environment
    const originalCrypto = globalThis.crypto

    // Use vi to stub the global crypto object
    vi.stubGlobal('crypto', {
      subtle: undefined, // Simulate lack of subtle support
    } as unknown as Crypto)

    const length = 6
    const id = await generateUniqueId(['user123', 'photo.png'])

    // Ensure fallbackSimple logic is used
    expect(id).toBeTypeOf('string')
    expect(id.length).toBe(length)

    // Restore original crypto object
    vi.stubGlobal('crypto', originalCrypto)
  })

  it('should correctly utilize randomBias for unique ID generation', async () => {
    const randomBias1 = 'bias1'
    const randomBias2 = 'bias2'

    const id1 = await generateUniqueId(['user123', 'photo.png'], randomBias1)
    const id2 = await generateUniqueId(['user123', 'photo.png'], randomBias2)

    expect(id1).not.toEqual(id2) // Different biases should produce different IDs
  })
})
