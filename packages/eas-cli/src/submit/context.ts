import { ExpoConfig } from '@expo/config';
import { Platform } from '@expo/eas-build-job';
import { SubmitProfile } from '@expo/eas-json';

import { CredentialsContext } from '../credentials/context';
import { getExpoConfig } from '../project/expoConfig';
import { getProjectAccountName } from '../project/projectUtils';
import { Actor } from '../user/User';
import { ensureLoggedInAsync } from '../user/actions';

export interface SubmissionContext<T extends Platform> {
  accountName: string;
  archiveFlags: SubmitArchiveFlags;
  credentialsCtx: CredentialsContext;
  exp: ExpoConfig;
  nonInteractive: boolean;
  platform: T;
  profile: SubmitProfile<T>;
  projectDir: string;
  projectId: string;
  projectName: string;
  user: Actor;
}

export interface SubmitArchiveFlags {
  latest?: boolean;
  id?: string;
  path?: string;
  url?: string;
}

export async function createSubmissionContextAsync<T extends Platform>(params: {
  archiveFlags: SubmitArchiveFlags;
  credentialsCtx?: CredentialsContext;
  env?: Record<string, string>;
  nonInteractive: boolean;
  platform: T;
  profile: SubmitProfile<T>;
  projectDir: string;
  projectId: string;
}): Promise<SubmissionContext<T>> {
  const { projectDir, nonInteractive } = params;
  const exp = getExpoConfig(projectDir, { env: params.env });
  const { env, ...rest } = params;
  const user = await ensureLoggedInAsync();
  const projectName = exp.slug;
  const accountName = getProjectAccountName(exp, user);
  let credentialsCtx: CredentialsContext | undefined = params.credentialsCtx;
  if (!credentialsCtx) {
    credentialsCtx = new CredentialsContext({ projectDir, user, exp, nonInteractive });
  }
  return {
    ...rest,
    accountName,
    credentialsCtx,
    exp,
    projectName,
    user,
  };
}
