'use strict';

const API = 'https://brasilapi.com.br/api';
const $ = (id) => document.getElementById(id);

// Cria elementos de texto sem inserir HTML fornecido pela API.
function linha(rotulo, valor) {
  const p = document.createElement('p');
  p.className = 'mb-1';
  const strong = document.createElement('strong');
  strong.textContent = `${rotulo}: `;
  p.append(strong, document.createTextNode(String(valor ?? 'Não informado')));
  return p;
}

function aviso(area, mensagem, tipo = 'warning') {
  area.replaceChildren();
  const div = document.createElement('div');
  div.className = `alert alert-${tipo}`;
  div.setAttribute('role', 'alert');
  div.textContent = mensagem;
  area.append(div);
}

async function consultar(endpoint, formId, areaId, exibir) {
  const form = $(formId);
  const area = $(areaId);
  const botao = form.querySelector('button[type="submit"]');
  botao.disabled = true;
  aviso(area, 'Carregando dados...', 'info');
  try {
    const resposta = await fetch(`${API}${endpoint}`);
    if (!resposta.ok) {
      if (resposta.status === 404) throw new Error('Nenhum resultado encontrado para esta consulta.');
      throw new Error(`A consulta não pôde ser concluída (erro HTTP ${resposta.status}).`);
    }
    const dados = await resposta.json();
    area.replaceChildren();
    exibir(dados, area);
  } catch (erro) {
    const mensagem = erro instanceof TypeError
      ? 'Não foi possível conectar à API. Confira sua internet e tente novamente.'
      : erro.message;
    aviso(area, `${mensagem} Você pode tentar novamente.`, 'danger');
  } finally {
    botao.disabled = false;
  }
}

$('form-cep').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const cep = $('cep').value.replace(/\D/g, '');
  if (!/^\d{8}$/.test(cep)) return aviso($('resultado-cep'), 'Digite um CEP válido com 8 números.');
  // Endpoint 1: GET /cep/v1/{cep}
  consultar(`/cep/v1/${cep}`, 'form-cep', 'resultado-cep', (dados, area) => {
    area.append(linha('CEP', dados.cep), linha('Rua', dados.street || 'Não informada'),
      linha('Bairro', dados.neighborhood || 'Não informado'), linha('Cidade', dados.city), linha('Estado', dados.state));
  });
});

$('form-ddd').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const ddd = $('ddd').value.trim();
  if (!/^\d{2}$/.test(ddd)) return aviso($('resultado-ddd'), 'Digite um DDD válido com 2 números.');
  // Endpoint 2: GET /ddd/v1/{ddd}
  consultar(`/ddd/v1/${ddd}`, 'form-ddd', 'resultado-ddd', (dados, area) => {
    const cidades = Array.isArray(dados.cities) ? dados.cities : [];
    area.append(linha('Estado', dados.state), linha('Quantidade de cidades', cidades.length));
    if (cidades.length) {
      const p = document.createElement('p');
      p.className = 'mb-0 mt-2';
      p.textContent = `Algumas cidades: ${cidades.slice(0, 12).join(', ')}${cidades.length > 12 ? '...' : ''}`;
      area.append(p);
    } else aviso(area, 'Nenhuma cidade encontrada para esse DDD.');
  });
});

$('form-feriados').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const ano = $('ano').value.trim();
  if (!/^\d{4}$/.test(ano) || Number(ano) < 1900 || Number(ano) > 2199)
    return aviso($('resultado-feriados'), 'Digite um ano entre 1900 e 2199.');
  // Endpoint 3: GET /feriados/v1/{ano}
  consultar(`/feriados/v1/${ano}`, 'form-feriados', 'resultado-feriados', (dados, area) => {
    if (!Array.isArray(dados) || dados.length === 0) return aviso(area, 'Nenhum feriado encontrado.');
    const ul = document.createElement('ul');
    for (const item of dados) {
      const li = document.createElement('li');
      const partes = String(item.date ?? '').split('-');
      const data = partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : item.date;
      li.textContent = `${data} — ${item.name}`;
      ul.append(li);
    }
    area.append(linha('Feriados encontrados', dados.length), ul);
  });
});

$('form-bancos').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const termo = $('banco').value.trim();
  if (termo.length < 2) return aviso($('resultado-bancos'), 'Digite pelo menos 2 letras do nome do banco.');
  // Endpoint 4: GET /banks/v1
  consultar('/banks/v1', 'form-bancos', 'resultado-bancos', (dados, area) => {
    const itens = Array.isArray(dados) ? dados.filter((b) =>
      `${b.name ?? ''} ${b.fullName ?? ''}`.toLocaleLowerCase('pt-BR').includes(termo.toLocaleLowerCase('pt-BR'))) : [];
    if (!itens.length) return aviso(area, 'Nenhum banco corresponde à pesquisa.');
    area.append(linha('Resultados encontrados', itens.length));
    const ul = document.createElement('ul');
    for (const banco of itens.slice(0, 15)) {
      const li = document.createElement('li');
      li.textContent = `${banco.code ?? 'Sem código'} — ${banco.fullName || banco.name || 'Sem nome'}`;
      ul.append(li);
    }
    area.append(ul);
    if (itens.length > 15) area.append(linha('Exibição', 'Primeiros 15 resultados'));
  });
});
