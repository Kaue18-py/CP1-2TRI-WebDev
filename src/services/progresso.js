export function chaveEpisodio(temporada, episodio) {
  return `${temporada}-${episodio}`;
}

export function estaVisto(serie, temporada, episodio) {
  if (!serie) {
    return false;
  }
  return serie.vistos.includes(chaveEpisodio(temporada, episodio));
}

export function vistosDaTemporada(serie, numeroTemporada) {
  if (!serie) {
    return 0;
  }
  return serie.vistos.filter((chave) => chave.startsWith(`${numeroTemporada}-`)).length;
}

export function porcentagem(serie) {
  if (!serie || serie.totalEpisodios === 0) {
    return 0;
  }
  return Math.min(100, Math.round((serie.vistos.length / serie.totalEpisodios) * 100));
}
export function proximoEpisodio(serie) {
  for (const temporada of serie.temporadas) {
    for (let numero = 1; numero <= temporada.total; numero++) {
      if (!serie.vistos.includes(chaveEpisodio(temporada.numero, numero))) {
        return { temporada: temporada.numero, episodio: numero };
      }
    }
  }
  return null;
}

export function minutosAssistidos(serie) {
  return serie.vistos.length * serie.duracaoMedia;
}

export function formatarTempo(minutos) {
  if (minutos < 60) {
    return `${minutos} min`;
  }

  const horas = Math.floor(minutos / 60);

  if (horas < 24) {
    return `${horas} h`;
  }

  const dias = Math.floor(horas / 24);
  const resto = horas % 24;
  const textoDias = dias === 1 ? "1 dia" : `${dias} dias`;

  if (resto === 0) {
    return textoDias;
  }
  return `${textoDias} e ${resto} h`;
}
