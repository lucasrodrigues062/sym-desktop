import { ipcMain, session } from 'electron';
import { ILoginProps } from 'renderer/view/pages/login-page';
import CronosService from '../../../release/app/mssql/connection';

export default function buscaFilial() {
  ipcMain.on('buscaFilial', async (event) => {
    const cookies = await session.defaultSession.cookies.get({
      name: 'user',
    });

    const user = JSON.parse(cookies[0].value) as ILoginProps;
    const cronosPool = await new CronosService().pool(
      user.database,
      user.server
    );
    const result = await cronosPool
      .request()

      .query(
        `SELECT CodFilial as codFilial, NomeFilial as filial FROM Filiais f  WHERE Inativa = 'N'`
      );

    if (result.recordset.length > 0) {
      event.reply('buscaFilial', result.recordset);
    } else {
      event.reply('buscaFilial', 'KO');
    }
  });
}
