// home.page.ts
import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

interface Conversion {
  [unit: string]: {
    [targetUnit: string]: number;
  };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  valor: number;
  unidadOrigen: string;
  unidadDestino: string;
  resultado: number;

  // Historial de conversiones realizadas
  historialConversiones: { origen: string, destino: string, valor: number, resultado: number }[] = [];

  // Objeto de conversiones disponibles
  conversiones: Conversion = {
    kg: { lb: 2.20462, g: 1000, oz: 35.27396, t: 0.001 },
    lb: { kg: 0.453592, g: 453.592, oz: 16, t: 0.000453592 },
    g: { kg: 0.001, lb: 0.00220462, oz: 0.03527396, t: 0.000001 },
    oz: { kg: 0.0283495, lb: 0.0625, g: 28.3495, t: 0.0000283495 },
    t: { kg: 1000, lb: 2204.62, g: 1000000, oz: 35273.96 },
  };

  constructor(private toastController: ToastController) {
    this.valor = 0;
    this.unidadOrigen = 'kg';
    this.unidadDestino = 'lb';
    this.resultado = 0;
  }

  convertirPeso() {
    this.resultado = this.valor * this.conversiones[this.unidadOrigen][this.unidadDestino];

    // Agregar la conversión al historial
    this.historialConversiones.push({
      origen: this.unidadOrigen,
      destino: this.unidadDestino,
      valor: this.valor,
      resultado: this.resultado
    });
  }

  limpiarResultados() {
    this.valor = 0;
    this.resultado = 0;
  }

  invertirUnidades() {
    const temp = this.unidadOrigen;
    this.unidadOrigen = this.unidadDestino;
    this.unidadDestino = temp;
    this.convertirPeso();
  }

  reiniciar() {
    this.valor = 0;
    this.unidadOrigen = 'kg';
    this.unidadDestino = 'lb';
    this.resultado = 0;
    this.historialConversiones = [];
  }
  async exportarHistorial() {
    try {
      const historialString = JSON.stringify(this.historialConversiones, null, 2);
      const blob = new Blob([historialString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Crear un enlace invisible y hacer clic en él para iniciar la descarga
      const a = document.createElement('a');
      a.href = url;
      a.download = 'historial_conversiones.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);


      const toast = await this.toastController.create({
        message: 'Historial exportado con éxito',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    } catch (error) {
      console.error('Error al exportar el historial', error);
      const toast = await this.toastController.create({
        message: 'Error al exportar el historial',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    }
  }
}