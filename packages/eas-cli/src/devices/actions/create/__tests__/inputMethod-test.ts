import prompts from 'prompts';

import { asMock } from '../../../../__tests__/utils';
import { AppleDeviceMutation } from '../../../../credentials/ios/api/graphql/mutations/AppleDeviceMutation';
import { AppleDeviceClass, AppleTeam } from '../../../../graphql/generated';
import { runInputMethodAsync } from '../inputMethod';

jest.mock('../../../../credentials/ios/api/graphql/mutations/AppleDeviceMutation');
jest.mock('../../../../ora');

beforeEach(() => {
  asMock(prompts).mockReset();
  asMock(prompts).mockImplementation(() => {
    throw new Error(`unhandled prompts call - this shouldn't happen - fix tests!`);
  });
  asMock(AppleDeviceMutation.createAppleDeviceAsync).mockClear();
});

describe(runInputMethodAsync, () => {
  it('should allow for multiple device registration', async () => {
    mockDeviceData('00001111-001122334455662E', 'my iPhone', AppleDeviceClass.Iphone);
    asMock(prompts).mockImplementationOnce(() => ({ value: true }));
    mockDeviceData('b12cba9856d89c932ab7a4b813c4d932534e1679', 'my iPad', AppleDeviceClass.Ipad);
    asMock(prompts).mockImplementationOnce(() => ({ value: false }));

    const accountId = 'account-id';
    // @ts-expect-error appleTeam is missing properties of AppleTeam GraphQL type
    const appleTeam: AppleTeam = {
      id: 'apple-team-id',
      appleTeamIdentifier: 'ABC123XY',
      appleTeamName: 'John Doe (Individual)',
    };

    await runInputMethodAsync(accountId, appleTeam);

    expect(AppleDeviceMutation.createAppleDeviceAsync).toHaveBeenCalledTimes(2);
  });
});

function mockDeviceData(udid: string, name: string, deviceClass: AppleDeviceClass): void {
  asMock(prompts).mockImplementationOnce(() => ({ udid }));
  asMock(prompts).mockImplementationOnce(() => ({ name }));
  asMock(prompts).mockImplementationOnce(() => ({ deviceClass }));
  asMock(prompts).mockImplementationOnce(() => ({ value: true }));
}
