import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentModeService, PaymentMode } from '../../app/service/payment-mode.service';

@Component({
  selector: 'app-wallet-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet-page.component.html',
  styleUrls: ['./wallet-page.component.css']
})
export class WalletPageComponent implements OnInit {
  paymentModes: PaymentMode[] = [];
  newMethod = '';
  newDescription = '';

  constructor(private paymentModeService: PaymentModeService) {}

  ngOnInit(): void {
    this.loadPaymentModes();
  }

  loadPaymentModes() {
    this.paymentModeService.getUserPaymentModes().subscribe({
      next: (modes) => this.paymentModes = modes,
      error: (err) => console.error('Erreur chargement modes de paiement', err)
    });
  }

  toggleActive(mode: PaymentMode) {
    this.paymentModeService.updatePaymentMode(mode._id!, { isActive: !mode.isActive })
      .subscribe({
        next: () => this.loadPaymentModes(),
        error: (err) => console.error('Erreur toggle mode', err)
      });
  }

  addPaymentMode() {
    if (!this.newMethod.trim()) return;
    this.paymentModeService.createPaymentMode({
      method: this.newMethod,
      description: this.newDescription,
      isActive: true
    }).subscribe({
      next: () => {
        this.newMethod = '';
        this.newDescription = '';
        this.loadPaymentModes();
      },
      error: (err) => console.error('Erreur ajout mode', err)
    });
  }

  deletePaymentMode(mode: PaymentMode) {
    if (!confirm(`Supprimer ${mode.method} ?`)) return;
    this.paymentModeService.deletePaymentMode(mode._id!)
      .subscribe({
        next: () => this.loadPaymentModes(),
        error: (err) => console.error('Erreur suppression mode', err)
      });
  }
}
