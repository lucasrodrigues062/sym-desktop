import { ipcMain, session } from 'electron';
import { ILoginProps } from 'renderer/view/pages/login-page';
import CronosService from '../../../release/app/mssql/connection';

const queryPedidoPalm = `SELECT Pedidopalm.IdPedidoPalm, PedidoPalm.CodFilial, Pedidopalm.Origem, Pedidopalm.NumPedidoPalm,  Pedidopalm.NumPedidoPalmAux, Pedidopalm.DataPedido, PedidoPalm.IdEmpresa, Pedidopalm.CodVendedor, Pedidopalm.CodCliFor, Pedidopalm.CnpjCpfCliFor, Pedidopalm.CodPortador, Pedidopalm.CodCondPag, Pedidopalm.TotalPedido, Vendedores.CodLocal, Pedidopalm.DataEntrega, Pedidopalm.Observacoes, Pedidopalm.SituacaoPedido, Pedidopalm.IdUsuario, Pedidopalm.DataOperacao, Cli_for.NOMECLIFOR, Vendedores.NOMEVENDEDOR, Condpag.CONDPAG, Cli_for.UFCLIFOR, Cidade.Cidade, Portador.NomePortador, DataProxVisita, PedidoPalm.PercDesconto, PedidoPalm.NumNF,  PedidoPalm.NumPedidoCRONOS, CodRetorno, DscRetorno, ArqRetPed, ArqRet2Ped, ArqRetNF,
Dados_Mov.*, CNPJCliente=Cli_For.CPFCGCCLIFOR, TipoPessoa=Cli_For.TipoPessoa,  UFFilial=Filiais.UFFilial, IEFilial=Filiais.InscricaoEstadual,   CNPJFilial=Filiais.Cgc

FROM dbo.PedidoPalm Pedidopalm LEFT JOIN dbo.CLI_FOR Cli_for ON Pedidopalm.CodCliFor = Cli_for.CODCLIFOR LEFT JOIN Cidade ON (Cli_for.IdCidade = Cidade.IdCidade) LEFT JOIN dbo.VENDEDORES Vendedores ON  PedidoPalm.CodVendedor = Vendedores.CodVendedor LEFT JOIN dbo.CONDPAG Condpag ON Pedidopalm.CodCondPag = Condpag.CODCONDPAG LEFT JOIN Portador ON PedidoPalm.CodPortador = Portador.CodPortador
    CROSS APPLY (SELECT NumMov=MAX(M.NumMov),  IdMovGerado =MAX(IdMov),  DtMovGerado = MAX(DtMov), DtEntSaiMovGerado = MAX(DataEntradaSaida),  DataCancelamento = MAX(DataCancelamento), ChaveNFEMovGerado = MAX(ChaveNFe), SerieDocMovGerado = MAX(SerieDoc), CodCPMovGerado = MAX(m.CodCondPag), DtOperacaoMov = MAX(M.DataOperacao), StatusMov = MAX(dbo.fn_DscStatusMov(M.Status, TipoMov)), DscStatusNFE = MAX(dbo.fn_DscStatusNFE(M.NFeStatus)), TipoMovGerado = MAX(dbo.fn_DscTipoMov2(TipoMov, DAV)), SituacaoMov = MAX(dbo.fn_DscStatusSep( StatusSeparacao)),
    TotProdMovGer=MAX(M.TOTMOV), BaseICMS=MAX(M.BaseICMS), ValorICMS=MAX(M.ValorICMS), BaseSubICMS=MAX(M.BaseSubICMS), ValorSubICMS=MAX(M.ValorSubICMS), ValorIPI=MAX(M.ValorIPI), ValorFrete=MAX(M.ValorFrete), ValorSeguro=MAX(M.ValorSeguro),
    OutrasDespesas=MAX(M.OutrasDespesas), TotLiqMovGer = MAX(dbo.fn_ValorMovimento2( M.IdMov, M.TotMov, M.PercDesconto, M.ValorSubICMS, M.ValorFrete, M.ValorSeguro, M.OutrasDespesas, M.ValorIPI, M.Frete,'L'))
    FROM Movimento M WHERE  M.IdPedidoPalm = PedidoPalm.IdPedidoPalm) AS DADOS_MOV, Filiais
WHERE PedidoPalm.CodFilial = Filiais.CodFilial  AND PedidoPalm.CodFilial = @codfilial



AND (Pedidopalm.DataPedido >= @dataini )
AND (Pedidopalm.DataPedido < @datafim )
AND (Pedidopalm.Origem = @origem)


ORDER BY Pedidopalm.IdPedidoPalm`;

interface IBuscaPedidoPalm {
  codfilial: string;
  origem: string;
  dataini: string;
  datafim: string;
}

export default function buscaOl() {
  ipcMain.on('buscaPedidoPalm', async (event, arg) => {
    const dados = arg as IBuscaPedidoPalm;
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
      .input('codfilial', dados.codfilial)
      .input('origem', dados.origem)
      .input('dataini', dados.dataini)
      .input('datafim', dados.datafim)
      .query(queryPedidoPalm);

    if (result.recordset.length > 0) {
      event.reply('buscaPedidoPalm', result.recordset as PedidoPalm[]);
    } else {
      event.reply('buscaPedidoPalm', 'KO');
    }
  });
}

export interface PedidoPalm {
  IdPedidoPalm: number;
  CodFilial: string;
  Origem: string;
  NumPedidoPalm: string;
  NumPedidoPalmAux: string;
  DataPedido: string;
  CodVendedor: string;
  CodCliFor: string;
  CnpjCpfCliFor: string;
  CodPortador: string;
  CodCondPag: string;
  TotalPedido: number;
  CodLocal: string;
  DataEntrega: string;
  Observacoes: string;
  SituacaoPedido: string;
  IdUsuario: string;
  DataOperacao: string;
  NOMECLIFOR: string;
  NOMEVENDEDOR: string;
  CONDPAG: string;
  UFCLIFOR: string;
  Cidade: string;
  NomePortador: string;
  DataProxVisita: string;
  PercDesconto: number;
  NumNF: string;
  NumPedidoCRONOS: string;
  CodRetorno: string;
  DscRetorno: string;
  ArqRetPed: string;
  ArqRet2Ped: string;
  ArqRetNF: string;
  NumMov: string;
  IdMovGerado: number;
  DtMovGerado: string;
  DtEntSaiMovGerado: string;
  DataCancelamento: string;
  ChaveNFEMovGerado: string;
  SerieDocMovGerado: string;
  CodCPMovGerado: string;
  DtOperacaoMov: string;
  StatusMov: string;
  DscStatusNFE: string;
  TipoMovGerado: string;
  SituacaoMov: string;
  TotProdMovGer: number;
  BaseICMS: number;
  ValorICMS: number;
  BaseSubICMS: number;
  ValorSubICMS: number;
  ValorIPI: number;
  ValorFrete: number;
  ValorSeguro: number;
  OutrasDespesas: number;
  TotLiqMovGer: number;
  CNPJCliente: string;
  TipoPessoa: string;
  UFFilial: string;
  IEFilial: string;
  CNPJFilial: string;
}
