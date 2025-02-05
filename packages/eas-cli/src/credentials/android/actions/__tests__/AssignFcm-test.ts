import { testLegacyAndroidFcmFragment } from '../../../__tests__/fixtures-android';
import { createCtxMock } from '../../../__tests__/fixtures-context';
import { AssignFcm } from '../AssignFcm';
import { getAppLookupParamsFromContextAsync } from '../BuildCredentialsUtils';

describe(AssignFcm, () => {
  it('assigns an fcm api key in Interactive Mode', async () => {
    const ctx = createCtxMock({
      nonInteractive: false,
    });
    const appLookupParams = await getAppLookupParamsFromContextAsync(ctx);
    const assignFcmAction = new AssignFcm(appLookupParams);
    await assignFcmAction.runAsync(ctx, testLegacyAndroidFcmFragment);

    // expect app credentials to be fetched/created, then updated
    expect(
      ctx.android.createOrGetExistingAndroidAppCredentialsWithBuildCredentialsAsync
    ).toHaveBeenCalledTimes(1);
    expect(ctx.android.updateAndroidAppCredentialsAsync).toHaveBeenCalledTimes(1);
  });
  it('works in Non-Interactive Mode', async () => {
    const ctx = createCtxMock({
      nonInteractive: true,
    });
    const appLookupParams = await getAppLookupParamsFromContextAsync(ctx);
    const assignFcmAction = new AssignFcm(appLookupParams);

    // dont fail if users are running in non-interactive mode
    await expect(
      assignFcmAction.runAsync(ctx, testLegacyAndroidFcmFragment)
    ).resolves.not.toThrowError();
  });
});
