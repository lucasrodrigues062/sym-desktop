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
AND (Pedidopalm.DataPedido <= @datafim )
AND (Pedidopalm.Origem = @origem)


ORDER BY Pedidopalm.IdPedidoPalm`;

const queryItemPedidoPalm = `SELECT Itempedidopalm.IdItempedidopalm, Itempedidopalm.IdPedidoPalm, p.NOMEPRODUTO, ClassePIS.CodClassePIS, Itempedidopalm.Item, Itempedidopalm.CodProduto, Itempedidopalm.IdProduto, Itempedidopalm.Qtd, Itempedidopalm.QtdConfirmada, Itempedidopalm.IdPrecoTabela, Itempedidopalm.PercDescontoItem, Itempedidopalm.PrecoUnit, Itempedidopalm.SituacaoItemPedido, CodRetornoItem, DscRetornoItem,
CODEAN=Itempedidopalm.CodProdutoArq,
DADOS_IM.*
FROM Itempedidopalm CROSS APPLY (SELECT
QtdIMGerado = MAX(im.Qtd), PUnitIMGerado = MAX(im.PrecoUnit), PercDescItemIMGerado = MAX(im.PercDescontoItem), UnidItemMov = MAX(im.UnidItemMov),  ItemLoteSerie=max(dbo.fn_DscItemLoteSerie(im.IdItemMov)), IdItemMovGerado  = MAX(im.IdItemMov),   PercICMS=MAX(im.PercICMS), PercIPI=MAX(im.PercIPI), CFOP = MAX(NatOP.CFPO), SitTributariaItem=MAX(im.SitTributariaItem),
ValorItemICMS = CONVERT(NUMERIC(12,2) , MAX( dbo.fn_ValorItemMov4('VI', im.IdMov, im.IdItemMov, im.IdProduto, im.PrecoUnit, im.PercDescontoItem, im.Qtd, im.PercICMS, im.PercIPI, im.PercISS, im.MVAitem, TipoMov, Movimento.CodCliFor, Movimento.CodFilial, CodFilialDest, CodLocalDest, Movimento.PercDesconto, CalculaICMSsubstituto,  DescNaoIncideICMS, im.IdNaturezaOperacao, SitTributariaItem,ValorIPIincideICMS,ValorFreteincideICMS,PercReducaoBICMS,PercSubICMS, ValorItemFrete, ValorItemOutDespesas ))),
BaseItemICMS = CONVERT(NUMERIC(12,2) ,  MAX( dbo.fn_ValorItemMov4('BI', im.IdMov, im.IdItemMov, im.IdProduto, im.PrecoUnit, im.PercDescontoItem, im.Qtd, im.PercICMS, im.PercIPI, im.PercISS, im.MVAitem, TipoMov, Movimento.CodCliFor, Movimento.CodFilial, CodFilialDest, CodLocalDest, Movimento.PercDesconto,CalculaICMSsubstituto,  DescNaoIncideICMS, im.IdNaturezaOperacao, SitTributariaItem,ValorIPIincideICMS,ValorFreteincideICMS,PercReducaoBICMS,PercSubICMS, ValorItemFrete, ValorItemOutDespesas ))),
ValorItemSubICMS = CONVERT(NUMERIC(12,2) , MAX( dbo.fn_ValorItemMov4('VIS', im.IdMov, im.IdItemMov, im.IdProduto, im.PrecoUnit, im.PercDescontoItem, im.Qtd, im.PercICMS, im.PercIPI, im.PercISS, im.MVAitem, TipoMov, Movimento.CodCliFor, Movimento.CodFilial, CodFilialDest, CodLocalDest, Movimento.PercDesconto, CalculaICMSsubstituto,  DescNaoIncideICMS, im.IdNaturezaOperacao, SitTributariaItem,ValorIPIincideICMS,ValorFreteincideICMS,PercReducaoBICMS,PercSubICMS, ValorItemFrete, ValorItemOutDespesas ))),
BaseItemSubICMS = CONVERT(NUMERIC(12,2) ,  MAX( dbo.fn_ValorItemMov4('BIS', im.IdMov, im.IdItemMov, im.IdProduto, im.PrecoUnit, im.PercDescontoItem, im.Qtd, im.PercICMS, im.PercIPI, im.PercISS, im.MVAitem, TipoMov, Movimento.CodCliFor, Movimento.CodFilial, CodFilialDest, CodLocalDest, Movimento.PercDesconto, CalculaICMSsubstituto,  DescNaoIncideICMS, im.IdNaturezaOperacao, SitTributariaItem,ValorIPIincideICMS,ValorFreteincideICMS,PercReducaoBICMS,PercSubICMS, ValorItemFrete, ValorItemOutDespesas ))),
ValorItemIPI = CONVERT(NUMERIC(12,2) ,  MAX( dbo.fn_ValorItemMov4('VIP', im.IdMov, im.IdItemMov, im.IdProduto, im.PrecoUnit, im.PercDescontoItem, im.Qtd, im.PercICMS, im.PercIPI, im.PercISS, im.MVAitem, TipoMov, Movimento.CodCliFor, Movimento.CodFilial, CodFilialDest, CodLocalDest, Movimento.PercDesconto, CalculaICMSsubstituto,  DescNaoIncideICMS, im.IdNaturezaOperacao, SitTributariaItem,ValorIPIincideICMS,ValorFreteincideICMS,PercReducaoBICMS,PercSubICMS, ValorItemFrete, ValorItemOutDespesas )))
 FROM ItensMov im, NaturezaOperacao NatOP, PedidoPalm, Movimento  WHERE Itempedidopalm.IdPedidoPalm = PedidoPalm.IdPedidoPalm AND im.IdMov = Movimento.IdMov AND PedidoPalm.IdPedidoPalm = Movimento.IdPedidoPalm AND im.IdProduto = Itempedidopalm.IdProduto AND im.IdNaturezaOperacao = NatOP.IdNaturezaOperacao) AS DADOS_IM
 LEFT JOIN Produtos P ON ( Itempedidopalm.IdProduto = P.IdProduto) LEFT JOIN ClassePIS ON (P.IdClassePIS = ClassePIS.IdClassePIS)

WHERE (Itempedidopalm.IdPedidoPalm = @idpedido)
ORDER BY ItemPedidopalm.Item
`;

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

  ipcMain.on('buscaItemPedidoPalm', async (event, arg) => {
    const dados = arg as number;
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

      .input('idpedido', dados)
      .query(queryItemPedidoPalm);

    if (result.recordset.length > 0) {
      event.reply('buscaItemPedidoPalm', result.recordset);
    } else {
      event.reply('buscaItemPedidoPalm', 'KO');
    }
  });
}

export interface ItemPedidopalm {
  IdItempedidopalm: number;
  IdPedidoPalm: number;
  NOMEPRODUTO: string;

  Item: number;
  CodProduto: string;
  IdProduto: number;
  Qtd: number;
  QtdConfirmada: number;
  IdPrecoTabela: string;
  PercDescontoItem: number;
  PrecoUnit: number;
  SituacaoItemPedido: string;
  CodRetornoItem: string;
  DscRetornoItem: string;
  CODEAN: string;
  QtdIMGerado: number;
  PUnitIMGerado: number;
  PercDescItemIMGerado: number;
  UnidItemMov: string;
  ItemLoteSerie: string;
  IdItemMovGerado: number;
  PercICMS: number;
  PercIPI: number;
  CFOP: string;
  SitTributariaItem: string;
  ValorItemICMS: number;
  BaseItemICMS: number;
  ValorItemSubICMS: number;
  BaseItemSubICMS: number;
  ValorItemIPI: number;
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
