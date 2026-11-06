export async function hashPin(pin: string): Promise<string> {
  const normalized = pin.trim();

  if (!normalized) {
    return "";
  }

  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(normalized));

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function comparePin(inputPin: string, storedPin: string): Promise<boolean> {
  if (!storedPin) {
    return false;
  }

  if (storedPin.length === 64) {
    return (await hashPin(inputPin)) === storedPin;
  }

  return inputPin === storedPin;
}
