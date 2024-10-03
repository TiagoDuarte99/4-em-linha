import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Player } from './player.enum';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.css']
})
export class JogoComponent {
  constructor(private snackBar: MatSnackBar) { }
  title = '4emlinha';

  nLinhas = 6;
  nculunas = 7;
  vence4linha = 4;
  numJogadas: number = 0;
  maxJogadas: number = 42;

  tabuleiro: Player[][] = [];
  jogadorAjogar: Player = Player.Red;
  vencedor: Player = Player.None;

  ngOnInit(): void {
    this.gerartabuleiro();
  }

  private gerartabuleiro(): void {
    this.tabuleiro = [];
    for (let i = 0; i < this.nLinhas; i++) {
      this.tabuleiro[i] = [];
      for (let j = 0; j < this.nculunas; j++) {
        this.tabuleiro[i][j] = Player.None;
      }
    }
  }

  public jogar(coluna: number): void {

    if (this.vencedor !== Player.None || this.numJogadas === this.maxJogadas) {
      this.exibirMensagem(`O jogo já terminou - ${this.obterJogador(this.vencedor)} ganhou.`);
      return;
    }

    if (this.tabuleiro[0][coluna] !== Player.None) {
      this.exibirMensagem('Coluna já cheia ');
      return;
    }

    for (let linha = this.nLinhas - 1; linha >= 0; linha--) {
      if (this.tabuleiro[linha][coluna] === Player.None) {
        this.tabuleiro[linha][coluna] = this.jogadorAjogar;
        this.numJogadas++;
        if (this.verificarVencedor(linha, coluna)) {
          this.vencedor = this.jogadorAjogar;
          this.exibirMensagem(this.obterQuemGanhou());
        } else if (this.numJogadas === this.maxJogadas) {
          this.exibirMensagem(this.obterQuemGanhou());
        } else {
          this.jogadorAjogar = this.jogadorAjogar === Player.Red ? Player.Yellow : Player.Red;
        }
        break;
      }
    }
  }

  private verificarVencedor(linha: number, coluna: number): boolean {
    return this.verificarVencedorDirecao(linha, coluna, 1, 0) || // horizontal
      this.verificarVencedorDirecao(linha, coluna, 0, 1) || // vertical
      this.verificarVencedorDirecao(linha, coluna, 1, 1) || // diagonal up-right
      this.verificarVencedorDirecao(linha, coluna, -1, 1);  // diagonal down-right
  }

  private verificarVencedorDirecao(linha: number, coluna: number, dlinha: number, dcoluna: number): boolean {
    const player = this.tabuleiro[linha][coluna];
    let count = 1;
    let r = linha + dlinha;
    let c = coluna + dcoluna;
    while (r >= 0 && r < this.nLinhas && c >= 0 && c < this.nculunas && this.tabuleiro[r][c] === player) {
      count++;
      r += dlinha;
      c += dcoluna;
    }
    r = linha - dlinha;
    c = coluna - dcoluna;
    while (r >= 0 && r < this.nLinhas && c >= 0 && c < this.nculunas && this.tabuleiro[r][c] === player) {
      count++;
      r -= dlinha;
      c -= dcoluna;
    }
    return count >= this.vence4linha;
  }

  public obterQuemGanhou(): string {
    switch (this.vencedor) {
      case Player.None: return 'Empate';
      case Player.Red: return 'Vermelhos ganharam!';
      case Player.Yellow: return 'Amarelos ganharam!';
    }
  }

  public obterClass(value: Player): string {
    if (value === Player.None) {
      return 'cell';
    } else {
      return `cell ${value === Player.Red ? 'red' : 'yellow'}`;
    }
  }

  public reset(): void {
    this.gerartabuleiro();
    this.vencedor = Player.None;
    this.jogadorAjogar = Player.Red;
    this.numJogadas = 0;
  }

  public exibirMensagem(mensagem: string): void {
    this.snackBar.open(mensagem, "", {
      duration: 3000
    });
  }

  obterJogador(player: Player): string {
    if (this.vencedor !== Player.None) {
      return this.vencedor === Player.Red ? 'Vermelho' : 'Amarelo';
    } else {
      return player === Player.Red ? 'Vermelho' : 'Amarelo';
    }
  }

  public obterTextoCabecalho(): string {
    if (this.vencedor !== Player.None) {
      return 'Vencedor - ' + this.obterJogador(this.vencedor);
    } else if (this.numJogadas === this.maxJogadas) {
      return 'Empate';
    } else {
      return this.obterJogador(this.jogadorAjogar);
    }
  }
}