import { Injectable } from '@angular/core';
import { BABY_SHOWER_DEMO } from '../constants/demo.data';
import { BabyShower } from '../types/event/baby-shower.types';
import { Event } from '../types/event/event.types';

/**
 * InviteService maneja la carga y gestión de datos de eventos
 * - Proporciona datos de demostración
 * - Carga eventos por ID
 * - Formatea fechas
 * - Construye datos específicos del evento
 */
@Injectable({
  providedIn: 'root',
})
export class InviteService {
  /**
   * Obtiene datos de demostración para Baby Shower
   */
  getDemoData(): BabyShower {
    return BABY_SHOWER_DEMO;
  }

  /**
   * Carga un evento por ID (placeholder para API futura)
   * TODO: Integrar con API backend
   */
  loadEventById(eventId: string): Promise<Event> {
    // Placeholder: en producción, consultar API
    return Promise.resolve(BABY_SHOWER_DEMO);
  }

  /**
   * Formatea una fecha en objeto estructurado
   */
  formatDate(date: Date): { day: number; month: string; year: number } {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return { day, month, year };
  }

  /**
   * Calcula fecha futura basada en días desde hoy
   */
  getDateFromNow(daysFromNow: number): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysFromNow);
  }

  /**
   * Valida que un evento sea válido
   */
  isValidEvent(event: unknown): boolean {
    if (typeof event !== 'object' || event === null) return false;
    const e = event as Record<string, unknown>;
    return typeof e['title'] === 'string' && typeof e['hostName'] === 'string';
  }

  /**
   * Crea una copia modificable de un evento
   */
  cloneEvent(event: Event): Event {
    return JSON.parse(JSON.stringify(event));
  }
}
