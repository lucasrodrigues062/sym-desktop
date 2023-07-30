import { ILoginProps } from 'renderer/view/pages/login-page';
import { checkUserPwd } from '../../../release/app/mssql/queries';

export default async function CronosChannel(
  cronosPool: any,
  arg: any,
  type: string
) {
  if (type === 'login') {
    const user = arg as ILoginProps;
    const result = await cronosPool
      .request()
      .input('username', user.username)
      .input('pwd', user.password)
      .query(checkUserPwd);
    const { same } = result.recordset[0];
    if (same) {
      return 'OK';
    }
    return 'KO';
  }
}
