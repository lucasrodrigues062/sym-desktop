import { ILoginProps } from 'renderer/view/pages/login-page';
import { ipcMain, session } from 'electron';
import dayjs from 'dayjs';
import CronosService from '../../../release/app/mssql/connection';
import { checkUserPwd } from '../../../release/app/mssql/queries';

export default function cronosLogin() {
  ipcMain.on('cronosLogin', async (event, arg) => {
    const user = arg as ILoginProps;
    const cronosPool = await new CronosService().pool(
      user.database,
      user.server
    );
    const result = await cronosPool
      .request()
      .input('username', user.username)
      .input('pwd', user.password)
      .query(checkUserPwd);
    const { same } = result.recordset[0];

    if (same === 1) {
      await session.defaultSession.cookies.set({
        url: 'http://localhost',
        name: 'user',
        value: JSON.stringify(arg),
        expirationDate: dayjs().add(7, 'day').toDate().getTime() / 1000,
      });

      event.reply('cronosLogin', 'OK');
    } else {
      event.reply('cronosLogin', 'KO');
    }
  });
}
