import { ipcMain, session } from 'electron';
import { ILoginProps } from 'renderer/view/pages/login-page';
import CronosService from '../../../release/app/mssql/connection';

export default function buscaOl() {
  ipcMain.on('buscaOl', async (event) => {
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

      .query(`SELECT DISTINCT (Origem) as Origem FROM PedidoPalm pp`);

    if (result.recordset.length > 0) {
      event.reply(
        'buscaOl',
        result.recordset.map((x) => x.Origem)
      );
    } else {
      event.reply('buscaOl', 'KO');
    }
  });
}
