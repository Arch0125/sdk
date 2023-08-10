import { LocalAccountSigner } from "@alchemy/aa-core";
import { config } from "./kernel-account.test.js";
import type { PrivateKeyAccount } from "viem";
import { SocialRecoveryValidator } from "../validator/social-recovery-validator.js";
import { MockSigner } from "./mocks/mock-signer.js";
import { SocialRecoveryProvider } from "../validator-provider/social-recovery-provider.js";

describe("Recovery Validator Test", async () => {
  const owner = LocalAccountSigner.privateKeyToAccountSigner(config.privateKey);
  const mockOwner = new MockSigner();

  const validator = await SocialRecoveryValidator.init({
    owner: mockOwner,
    projectId: config.projectId,
    validatorAddress: "0x113EAAF894AF251Ae61E83Ea78Baced99d81F1dc",
  });

  it("should return proper validator address", async () => {
    expect(await validator.getAddress()).toMatchInlineSnapshot(
      `"${"0x113EAAF894AF251Ae61E83Ea78Baced99d81F1dc"}"`
    );
  });

  it("should return correct owner address", async () => {
    expect(await validator.getOwner()).eql(
      await mockOwner.getAddress()
    );
  });

  it("should sign hash properly", async () => {
    expect(
      await validator.signMessage("0xabcfC3DB1e0f5023F5a4f40c03D149f316E6A5cc")
    ).eql(
      "0x4d61c5c27fb64b207cbf3bcf60d78e725659cff5f93db9a1316162117dff72aa631761619d93d4d97dfb761ba00b61f9274c6a4a76e494df644d968dd84ddcdb1c"
    );
  });

  it("should sign hash properly without 0x", async () => {
    expect(await validator.signMessage("icanbreakthistestcase")).eql(
      "0x4d61c5c27fb64b207cbf3bcf60d78e725659cff5f93db9a1316162117dff72aa631761619d93d4d97dfb761ba00b61f9274c6a4a76e494df644d968dd84ddcdb1c"
    );
  });
});
