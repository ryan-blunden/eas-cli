import mockdate from 'mockdate';

import { AppleDistributionCertificateQuery } from '../../api/graphql/queries/AppleDistributionCertificateQuery';
import { formatDistributionCertificate } from '../DistributionCertificateUtils';
jest.mock('../../api/graphql/queries/AppleDistributionCertificateQuery');
jest.mock('chalk', () => {
  return {
    __esModule: true, // this property makes it work
    default: { gray: jest.fn(log => log), underline: jest.fn(log => log) },
  };
});

mockdate.set(new Date('4/20/2021'));
describe('select credentials', () => {
  it('select an AppleDistributionCertificate fragment', async () => {
    const testDistCerts = (
      await AppleDistributionCertificateQuery.getAllForAccountAsync('quinAccount')
    ).sort((a, b) => (a.serialNumber > b.serialNumber ? 1 : -1));
    const loggedSoFar = testDistCerts
      .map(cert => formatDistributionCertificate(cert))
      .reduce((acc, certLog) => acc + certLog);
    expect(loggedSoFar).toMatchSnapshot();
  });
});
